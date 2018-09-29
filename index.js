const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
//register modules
require('./models/User');
require('./models/Blog');
require('./services/passport');//auth
//setup mongose instance 
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
//create express app
const app = express();
//settup middleware
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());
//register event handlers
require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);
//setup prodouction file serving
if (['production'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}
//app start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});
