const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const ws = require('ws');
const path = require('path');
const fs = require('fs');

const User = require('./models/User');
const Message = require('./models/Message');

dotenv.config();

const bcryptSalt = bcrypt.genSaltSync(10);

const mongooseUrl = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
const clientUrl = process.env.CLIENT_URL;

mongoose.connect(mongooseUrl);
const dirname = path.resolve(__dirname).replace(/\\/g, '/');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: clientUrl,
  })
);
app.use('/uploads', express.static(path.join(dirname, 'uploads')));

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
      { _id: createdUser._id, username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie('token', token, { sameSite: 'none', secure: true })
          .status(201)
          .json({ _id: createdUser._id, username });
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
        jwt.sign({ _id: user._id, username }, jwtSecret, {}, (err, token) => {
          if (err) throw err;
          res
            .cookie('token', token, { sameSite: 'none', secure: true })
            .status(200)
            .json({
              _id: user._id,
              username,
            });
        });
      }
    } else {
      res.status(401).json('Wrong credentials');
    }
  } catch (error) {
    console.log(error);
  }
});

app.post('/logout', async (_req, res) => {
  res.clearCookie('token').json('Logged out');
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
  const userSenderId = userData._id;

  const messages = await Message.find({
    sender: { $in: [userSenderId, userRecipientId] },
    recipient: { $in: [userSenderId, userRecipientId] },
  })
    .sort({ createdAt: 1 })
    .exec();
  res.json(messages);
});

app.get('/people', async (_req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 }).exec();
  res.json(users);
});

const server = app.listen(3000, () => {
  console.log('Listening on port 3000');
});

// Websocket
const wss = new ws.WebSocketServer({ server });

// view who are online
wss.on('connection', (connection, req) => {
  function notifyAboutOnlinePeople() {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((cliente) => ({
            _id: cliente._id,
            username: cliente.username,
          })),
        })
      );
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log('disconnected');
    }, 1000);
  }, 5000);

  connection.on('pong', () => {
    clearTimeout(connection.deathTimer);
  });

  // read id and username from the cookie for this connection
  const cookies = req?.headers.cookie;
  if (cookies) {
    const tokenString = cookies
      .split(';')
      .find((string) => string.startsWith('token='));
    if (tokenString) {
      const token = tokenString.split('=')[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          connection._id = userData._id;
          connection.username = userData.username;
        });
      }
    }
  }

  // send message to user selected
  connection.on('message', async (message) => {
    const { recipient, text, file } = JSON.parse(message);

    let fileName = null;

    if (file) {
      const parts = file.name.split('.');
      const extension = parts[parts.length - 1];
      fileName = `${Date.now()}.${extension}`;
      const filePath = `${dirname}/uploads/${fileName}`;
      const buffer = new Buffer.from(file.data.split(',')[1], 'base64');
      fs.writeFile(filePath, buffer, (err) => {
        if (err) throw err;
        console.log('file saved', filePath);
      });
    }

    // send message to all users
    if (recipient && (text || file)) {
      // create new message in database
      const messageData = await Message.create({
        sender: connection._id,
        recipient,
        text,
        file: file ? fileName : null,
      });

      [...wss.clients]
        .filter((client) => client._id === recipient)
        .forEach((client) => {
          client.send(
            JSON.stringify({
              _id: messageData._id,
              sender: connection.userId,
              recipient,
              text,
              file: file ? fileName : null,
            })
          );
        });
    }
  });

  // notify every about online people (when someone is online)
  notifyAboutOnlinePeople();
});
