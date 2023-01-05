require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const chat = require('./chat');
// const connection = require('./db');
// const userRoutes = require('./routes/users.js');
// const authRoutes = require('./routes/auth.js');

const loginRouter = require('./routes/loginRoutes');

const app = express();
const MAX_AGE = 1000 * 60 * 60 * 3;
const port = process.env.PORT || 5001;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

//Initial connection to db
mongoose.set('strictQuery', false);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
});

//connect-mongodb-session store
const mongoDBstore = new MongoDBStore({
  uri: process.env.MONGODB,
  collection: 'mySessions',
});

app.use(
  session({
    secret: 'a1s2d3f4g5h6',
    name: 'session-id', // name of cookie
    store: mongoDBstore,
    cookie: {
      maxAge: MAX_AGE, // when the cookie will expire
      sameSite: false,
      secure: false, // turn on for production
    },
    resave: true,
    saveUninitialized: false,
  })
);

//ROUTERS
app.use('/api', loginRouter);

//START SERVER
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});

chat();

/* LOGIN */
// connection(); //anslut till db

// //middlewares
// app.use(express.json());
// app.use(cors());

// //routes
// app.use('/api/users', userRoutes);
// app.use('/api/auth', authRoutes);
