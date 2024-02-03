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
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173']
app.use(cors({ origin: allowedOrigins, credentials: true }))

// BodyParser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

const bcrypt = require('bcrypt')

// httpOnly Cookie for JWT token
const cookieParser = require('cookie-parser')
app.use(cookieParser())

const accessCookieLifeSpan = 60 * 60 * 1000 // 1h

const answers = []

// Testing Connection
app.get('/', (req, res) => {
  res.json({ message: 'Successfully Connected' })
})

const authenticateJWT = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      // Token verification failed
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      } else {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    // Token verified successfully
    // Attach the decoded user to the request for later use in routes
    req.user = decoded;

    next();
  });
};

// Function to generate access token
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
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
      money: 0, // start the game with 0
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
    // Choose difficulty based on user's money amount
    let difficulty
    switch (user.money) {
      case user.money <= 10000:
        difficulty = 'easy'
        break
      case user.money <= 100000:
        difficulty = 'medium'
        break
      case user.money > 100000:
        difficulty = 'hard'
        break
      default:
        difficulty = 'easy'
    }

    // category will be implemented if have time. Catagory will be randomized by default
    // const category = req.body.category

    // Check if amount and difficulty parameters are present
    // if (!category) {
    //   return res.status(400).json({ message: 'Amount, difficulty and category are required parameters.' })
    // }

    // Make a request to the Open Trivia Database API
    const apiUrl = `https://opentdb.com/api.php?amount=1&difficulty=${difficulty}`
    const response = await axios.get(apiUrl)

    // Extract and send the questions as the response
    const questions = response.data.results
    const extractQuestions = extractQuestionAndChoices(questions)

    res.status(200).json({ extractQuestions })
  } catch (error) {
    console.error('Error fetching trivia questions:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Extract questions and answer choices from the external API
function extractQuestionAndChoices(questionData) {
  const { question, difficulty, correct_answer, incorrect_answers } = questionData;

  // Combine correct and incorrect answers into choices array
  const choices = [...incorrect_answers, correct_answer];

  // Function to shuffle an array (Fisher-Yates algorithm)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Shuffle the choices to randomize the order
  const shuffledChoices = shuffleArray(choices);

  // Save correct answer in the answers global variable
  answers.push({ question: question, difficulty, correct_answer })

  return {
    question,
    choices: shuffledChoices,
    correctAnswer: correct_answer,
  };
}

// Remove the question from the answers global variable after user answered the question
const delAnswer = (answers, questionRef) => {
  return answers.filter(answer => answer.question !== questionRef)
}

// Endpoint for saving progress
app.post('/save', async (req, res) => {
  try {
    const userId = req.user.id;
    const { question, userChoice } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if answers varible is not empty
    if (answers.length <= 0) return res.status(500).json({ message: 'No saved correct answers' })

    // Check if the question and userChoice sent from the client matches the correct answer
    // store inside the answers global variable
    if (userChoice.toLowerCase() !== answers[question].answer.toLowerCase()) {
      res.status(200).json({ isUserCorrect: false, correctAnswer: answers[question].answer })
    } else {
      // if correct, update user's money
      let userReward;
      switch (answers[question].difficulty) {
        case "easy":
          userReward = 5000
          break
        case "medium":
          userReward = 50000
          break
        case "hard":
          userReward = 500000
          break
        default:
          userReward = 0
      }

      user.money = user.money + userReward;
      await user.save();

      // delete the question and answer object from the answers global variable
      answers = delAnswer(answers, question)

      // Send back if the user is correct or not
      // Send back correct answer
      res.status(200).json({ isUserCorrect: true, correctAnswer: answers[question].answer })
    }

  } catch (error) {
    console.error('Error updating user money:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT)
