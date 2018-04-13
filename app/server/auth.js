const cookieSession = require('cookie-session');
const passport = require('passport');
const User = require('./models/User');

module.exports = (app) => {
  app.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      secret: 'mySecretKey'
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
