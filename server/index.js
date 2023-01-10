require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const chat = require('./chat');

const loginRouter = require('./routes/loginRoutes');

const app = express();
const MAX_AGE = 1000 * 60 * 60 * 3;
const port = process.env.PORT || 5001;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

//Initial connection to db
mongoose.set('strictQuery', false);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
});

// setting up connect-mongodb-session store
const mongoDBstore = new MongoDBStore({
  uri: process.env.MONGODB,
  collection: 'mySessions',
});

app.use(
  session({
    secret: 'a1s2d3f4g5h6',
    name: 'session-id', // cookies name to be put in "key" field in postman
    store: mongoDBstore,
    cookie: {
      maxAge: MAX_AGE, // this is when our cookies will expired and the session will not be valid anymore (user will be log out)
      sameSite: false,
      secure: false, // to turn on just in production
    },
    resave: true,
    saveUninitialized: false,
  })
);

app.use(cors(corsOptions));
app.use(express.json());

//ROUTERS
app.use('/api', loginRouter);

//START SERVER
app.listen(port, () => {
  console.log(`Auth is listening on port ${port}.`);
});

chat();
