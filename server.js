const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const bodyParser = require('body-parser');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const passport = require('passport');
const app = express();

// Body Parser middle
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// DB Config
const db = require('./config/keys').mongoURI;

// Connect o MongoDB
mongoose.connect(db).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

// Passport Middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Use routes
app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Running on port ${port}`));
