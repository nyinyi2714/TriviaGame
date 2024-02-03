const express = require('express')
const app = express()
const PORT = 5000
require('dotenv').config();

// Connect to mongoDB
const mongoose = require('mongoose')
try {
  mongoose.connect(process.env.DATABASE_URL);
} catch (error) {
  console.error('MongoDB connection error:', error);
}

const User = require('./models/User');

// JWT Token for Auth
const jwt = require('jsonwebtoken');

// Middleware to authenticate requests
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err, key) => {
    if (err) return res.sendStatus(403);
    try {
      const user = await User.findById(key.userId);
      if (!user) {
        return res.sendStatus(404); // User not found
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Error finding user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};

// Cors
const cors = require('cors')
app.use(cors({origin: "http://localhost:3000", credentials: true}))

// BodyParser
const bodyParser = require('body-parser')	
app.use(bodyParser.urlencoded({extended: false}))			
app.use(express.json())

const bcrypt = require('bcrypt');

// httpOnly Cookie for JWT token
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ message: "Successfully Connected" })
})

// Registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

		// Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
			firstname: firstname,
			lastname: lastname,
			email: email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    const token = jwt.sign({ userId: savedUser._id }, process.env.SECRET_KEY, { expiresIn: '5h' });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // After successful authentication, generate a token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '5h' });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ success: true, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/logout', (req, res) => {
  // Clear the token cookie by setting an expired date in the past
  res.cookie('token', '', { expires: new Date(0), httpOnly: true });
  res.status(200).json({ success: true, message: 'Logout successful' });
});

// Check if the user is logged in
app.get('/checkAuth', authenticateJWT, async (req, res) => {
  if (req.user) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

app.listen(PORT)
