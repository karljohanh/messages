require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const chat = require('./chat');
const connection = require('./db');
const userRoutes = require('./routes/users.js');
const authRoutes = require('./routes/auth.js');

/* LOGIN */
connection(); //anslut till db
chat();

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log('Listening'));
