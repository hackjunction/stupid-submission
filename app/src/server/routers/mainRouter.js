import express from 'express';
import path from 'path';
import passport from 'passport';
import mail from '../mail';
import User from '../models/User';

const mainRouter = express.Router();
const root = path.join(__dirname, '../../../public');
mail.configure();

mainRouter.get('/', (req, res) => {
  if (req.user) res.sendFile('main.html', { root });
  else res.redirect('/login');
});

mainRouter.get('/login', (req, res) => {
  res.sendFile('login.html', { root });
});

mainRouter.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    /*
    Skip user creation if an error occurred or a
    user for the submitted email already exists.
    */
    if (err || user) {
      res.sendStatus(500);
    } else {
      // TODO: Inspect password strength, compare the submitted passwords etc.
      User.register(new User({ email: req.body.email }), req.body.password, (err, user) => {
        if (err) {
          res.sendStatus(500);
        } else {
          //mail.sendVerificationEmail();
          passport.authenticate('local')(req, res, () => {
            res.redirect('/#/dashboard');
          });
        }
      });
    }
  });
});

mainRouter.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/#/dashboard',
    failureRedirect: '/login'
  })
);

mainRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

export default mainRouter;
