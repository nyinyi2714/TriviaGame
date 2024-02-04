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
const Question = require('./models/Question')

// JWT Token for Auth
const jwt = require('jsonwebtoken')

// Cors
const cors = require('cors')
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'https://main.dr0zerqotak90.amplifyapp.com']
app.use(cors({ origin: allowedOrigins, credentials: true }))

// BodyParser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

const bcrypt = require('bcrypt')

// httpOnly Cookie for JWT token
const cookieParser = require('cookie-parser')
app.use(cookieParser())

const accessCookieLifeSpan = 5 * 60 * 60 * 1000 // 5h

// Testing Connection
app.get('/', (req, res) => {
  res.json({ message: 'Successfully Connected' })
})

const authenticateJWT = (req, res, next) => {
  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ error: 'no access token present' })
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      // Token verification failed
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' })
      } else {
        return res.status(401).json({ error: 'Unauthorized' })
      }
    }

    try {
      // Fetch the user from the database using the userId from the decoded token
      const user = await User.findById(decoded.userId)

      if (!user) {
        return res.status(401).json({ error: 'User not found' })
      }

      // Attach the user object to the request for later use in routes
      req.user = user

      // Continue with the next middleware

      next()
    } catch (error) {
      console.error('Error fetching user:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })
}

// Function to generate access token
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' })
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
      money: 6000, // start the game with 0
      score: 0
    })

    const savedUser = await user.save()

    // After successful registration, generate tokens
    const accessToken = generateAccessToken(savedUser._id)

    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: accessCookieLifeSpan })
    res.status(200).json({ success: true })

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

    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: accessCookieLifeSpan })
    res.status(200).json({ success: true })

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
    res.json({ authenticated: true })
  } else {
    res.json({ authenticated: false })
  }
})

// Return top 10 leaderboard scores
app.get('/leaderboard', async (req, res) => {
  try {
    // Fetch leaderboard data from the database (top 10 players)
    const leaderboardData = await User.find().sort({ score: -1 }).limit(10)
    res.status(200).json(leaderboardData)
  } catch (error) {
    console.error('Error fetching leaderboard data:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Return questions from our own database
app.post('/questions', authenticateJWT, async (req, res) => {

  // Check if there's a user in the request
  const user = req.user

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized - User not found' })
  }

  try {
    // Choose difficulty based on user's money amount
    let difficulty
    if (user.money <= 10000) {
      difficulty = 'easy'
    } else if (user.money <= 100000) {
      difficulty = 'medium'
    } else {
      difficulty = 'hard'
    }
    // Fetch a random question from the Question model for the selected difficulty
    const question = await Question.aggregate([
      { $match: { difficulty: difficulty } },
      { $sample: { size: 1 } },
    ])


    // Check if there are questions
    if (!question || question.length === 0) {
      return res.status(404).json({ message: 'No questions found for the selected difficulty.' })
    }

    // Check if 'choices' array is present in the fetched question
    const { _id, question: fetchedQuestion, choices } = question[0]
    if (!choices || !Array.isArray(choices) || choices.length < 4) {
      return res.status(500).json({ message: 'Invalid question format.' })
    }

    // Send the question and choices
    res.status(200).json({ userMoney: user.money, question_id: _id, question: fetchedQuestion, choices: choices })
  } catch (error) {
    console.error('Error fetching trivia questions:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Endpoint for saving progress
app.post('/save', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user._id
    const { question_id, userChoice } = req.body

    // Check if the user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Fetch the question from the database based on question_id
    const question = await Question.findById(question_id)
    if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }

    // Check if userChoice matches the correctAnswer
    const isUserCorrect = userChoice === question.correctAnswer

     
      let moneyBet
      switch (question.difficulty) {
        case 'easy':
          moneyBet = 5000
          break
        case 'medium':
          moneyBet = 50000
          break
        case 'hard':
          moneyBet = 500000
          break
        default:
          moneyBet = 0
      }

      let hasUserWon = null

      // If correct, update user's money
      if(isUserCorrect) user.money = user.money + moneyBet

      // if incorrect, substract. Min is $0
      else user.money = Math.max(user.money - moneyBet, 0)
      
      // when user moneny hits 1 mil, they win. their progess reset. their score increase by 1
      if(user.money >= 1000000) {
        user.money = 6000
        user.score = user.score + 1
        hasUserWon = true
      } else if(user.money <= 0) {
        hasUserWon = false
      }
      await user.save()

      // Send back if the user is correct and the correct answer
      res.status(200).json({ isUserCorrect: isUserCorrect, correctAnswer: question.correctAnswer, hasUserWon })
    
  } catch (error) {
    console.error('Error updating user money:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.listen(PORT)


