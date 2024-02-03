const express = require('express')
const app = express()
const PORT = 5000
require('dotenv').config()

// Connect to mongoDB
const mongoose = require('mongoose')
try {
  mongoose.connect(process.env.DATABASE_URL)
} catch (error) {
  console.error('MongoDB connection error:', error)
}

// Import models from Database
const User = require('./models/User')
const Leaderboard = require('./models/Leaderboard')

// JWT Token for Auth
const jwt = require('jsonwebtoken')

// axios to make http requests
const axios = require('axios')

// Cors
const cors = require('cors')
app.use(cors({origin: 'http://localhost:3000', credentials: true}))

// BodyParser
const bodyParser = require('body-parser')	
app.use(bodyParser.urlencoded({extended: false}))			
app.use(express.json())

const bcrypt = require('bcrypt')

// httpOnly Cookie for JWT token
const cookieParser = require('cookie-parser')
app.use(cookieParser())

const accessCookieLifeSpan = 60 * 60 * 1000 // 1h

// Testing Connection
app.get('/', (req, res) => {
  res.json({ message: 'Successfully Connected' })
})

// Middleware to authenticate requests
const authenticateJWT = (req, res, next) => {
  const accessToken = req.cookies.accessToken
  const refreshToken = req.cookies.refreshToken

  if (!accessToken) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, key) => {
    // If Access token is invalid or expired
    if (err) {
      // if there's no refresh token present in the httpOnly cookies
      if (!refreshToken) {
        return res.sendStatus(403)
      }

      // Verify the refresh token
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (refreshErr, refreshKey) => {
        if (refreshErr) {
          return res.sendStatus(403) // Invalid refresh token
        }

        try {
          // Find user based on the refresh token
          const user = await User.findById(refreshKey.userId)
          if (!user) {
            return res.sendStatus(404) // User not found
          }

          // Generate a new access token
          const newAccessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1hr' })

          // Set the new access token in an HTTP-only cookie
          res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: accessCookieLifeSpan }) // 1hr

          // Set the user in the request for further processing
          req.user = user

          // Continue to the next middleware or route
          next()
        } catch (error) {
          console.error('Error finding user:', error)
          res.status(500).json({ message: 'Internal server error' })
        }
      })

      // if access token is valid
    } else {
      try {
        const user = await User.findById(key.userId)
        if (!user) {
          return res.sendStatus(404) // User not found
        }

        req.user = user
        next()
      } catch (error) {
        console.error('Error finding user:', error)
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  })
}

// Function to generate access token
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
}

// Function to generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

// User Registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

		// Check if the username already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ message: 'username already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
			username: username,
      password: hashedPassword,
    })

    const savedUser = await user.save()

    // After successful registration, generate tokens
    const accessToken = generateAccessToken(savedUser._id)
    const refreshToken = generateRefreshToken(savedUser._id)

    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: accessCookieLifeSpan })
    res.cookie('refreshToken', refreshToken, { httpOnly: true })
    res.status(200).json({ success: true, accessToken })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// User Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    // After successful authentication, generate tokens
    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: accessCookieLifeSpan })
    res.cookie('refreshToken', refreshToken, { httpOnly: true })
    res.status(200).json({ success: true, accessToken })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.get('/logout', (req, res) => {
  // Clear the token cookie by setting an expired date in the past
  res.cookie('accessToken', '', { expires: new Date(0), httpOnly: true })
  res.status(200).json({ success: true, message: 'Logout successful' })
})

// Check if the user is logged in
app.get('/checkAuth', authenticateJWT, async (req, res) => {
  if (req.user) {
    // TODO: remove user info
    res.json({ authenticated: true, user: req.user })
  } else {
    res.json({ authenticated: false })
  }
})

// Return top 10 leaderboard scores
app.get('/leaderboard', async (req, res) => {
  try {
    // Fetch leaderboard data from the database (top 10 players)
    const leaderboardData = await Leaderboard.find().sort({ score: -1 }).limit(10)

    res.status(200).json(leaderboardData)
  } catch (error) {
    console.error('Error fetching leaderboard data:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Return questions from Open Trivia Database API
app.post('/questions', async (req, res) => {

  // Check if there's a user in the request
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized - User not found' });
  }

  try {
    const amount = req.body.amount
    // TODO: choose difficulty based on user's money amount
    const difficulty = req.body.difficulty
    const category = req.body.category

    // Check if amount and difficulty parameters are present
    if (!amount || !difficulty || !category) {
      return res.status(400).json({ message: 'Amount, difficulty and category are required parameters.' })
    }

    // Make a request to the Open Trivia Database API
    const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}`
    const response = await axios.get(apiUrl)

    // Extract and send the questions as the response
    const questions = response.data.results
    res.status(200).json({ questions })
  } catch (error) {
    console.error('Error fetching trivia questions:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.post('/save', async (req, res) => {
  try {
    const userId = req.user.id;
    const { newMoney } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's money attribute
    user.money = newMoney;
    await user.save();

    res.status(200).json({ message: 'Money updated successfully' });
  } catch (error) {
    console.error('Error updating user money:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT)
