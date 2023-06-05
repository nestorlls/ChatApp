const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const ws = require('ws');

const User = require('./models/User');
const Message = require('./models/Message');

dotenv.config();

const bcryptSalt = bcrypt.genSaltSync(10);

const mongooseUrl = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
const clientUrl = process.env.CLIENT_URL;

mongoose.connect(mongooseUrl);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: clientUrl,
  })
);

function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) reject(err);
        resolve(userData);
      });
    } else {
      reject('Unauthorized');
    }
  });
}

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
    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie('token', token, { sameSite: 'none', secure: true })
          .status(201)
          .json({ id: createdUser._id, username });
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// Login user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const passOk = await bcrypt.compare(password, user.password);
      if (passOk) {
        jwt.sign(
          { userId: user._id, username },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res
              .cookie('token', token, { sameSite: 'none', secure: true })
              .status(200)
              .json({
                id: user._id,
                username,
              });
          }
        );
      }
    } else {
      res.status(401).json('Wrong credentials');
    }
  } catch (error) {
    console.log(error);
  }
});

app.get('/profile', (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, decoded) => {
      if (err) throw err;
      res.json(decoded);
    });
  } else {
    res.status(401).json('Unauthorized');
  }
});

app.get('/messages/:userId', async (req, res) => {
  const userRecipientId = req.params.userId;
  const userData = await getUserDataFromRequest(req);
  const userSenderId = userData.userId;

  const messages = await Message.find({
    sender: { $in: [userSenderId, userRecipientId] },
    recipient: { $in: [userSenderId, userRecipientId] },
  })
    .sort({ createdAt: 1 })
    .exec();
  res.json(messages);
});

const server = app.listen(3000, () => {
  console.log('Listening on port 3000');
});

const wss = new ws.WebSocketServer({ server });
wss.on('connection', (connection, req) => {
  // read id and username from the cookie for this connection
  const cookies = req?.headers.cookie;
  if (cookies) {
    const tokenString = cookies
      .split(';')
      .find((string) => string.startsWith('token='));
    if (tokenString) {
      const token = tokenString.split('=')[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, decoded) => {
          if (err) throw err;
          connection.userId = decoded.userId;
          connection.username = decoded.username;
        });
      }
    }
  }

  // send message to user selected
  connection.on('message', async (message) => {
    const { recipient, text } = JSON.parse(message);

    // create new message in database
    const messageData = await Message.create({
      sender: connection.userId,
      recipient,
      text,
    });

    // send message to all users
    if (recipient && text) {
      [...wss.clients]
        .filter((client) => client.userId === recipient)
        .forEach((client) => {
          client.send(
            JSON.stringify({
              _id: messageData._id,
              sender: connection.userId,
              recipient,
              text,
            })
          );
        });
    }
  });

  // notify every about online people (when someone is online)
  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((client) => ({
          userId: client.userId,
          username: client.username,
        })),
      })
    );
  });
});
