const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const User = require('./models/User');

dotenv.config();

const bcryptSalt = bcrypt.genSaltSync(10);

const mongooseUrl = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
const clientUrl = process.env.CLIENT_URL;

mongoose.connect(mongooseUrl);

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: clientUrl,
  })
);

app.get('/', (req, res) => {
  res.json('Hello World!');
});

// Register user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, bcryptSalt);
    const createdUser = await User.create({
      username,
      password: hashedPassword,
    });
    jwt.sign({ userId: createdUser._id }, jwtSecret, {}, (err, token) => {
      if (err) throw err;
      res
        .cookie('token', token, { sameSite: 'none', secure: true })
        .status(201)
        .json({ id: createdUser._id });
    });
  } catch (error) {
    console.log(error);
  }
});

// Login user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      jwt.sign({ userId: user._id }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res
          .cookie('token', token, { sameSite: 'none', secure: true })
          .status(200)
          .json({ id: user._id });
      });
    } else {
      res.status(401).json('Wrong credentials');
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
