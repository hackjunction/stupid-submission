const express = require('express');
const passport = require('passport');
const User = require('./server/models/User');
const auth = require('./server/auth');

const app = express();
const deadlineDate = new Date('2018-04-14T12:00:00');
const staticPath = path.join(__dirname, '../../');

const api = express.Router();

api.get('/', (req, res) => {
    if(req.user) {
        const currentDate = new Date()
        if(currentDate.getTime() >= deadlineDate.getTime()){
            res.send("You late boi")
        }
        res.send("Still time boi")
    }
    else {
        res.redirect('/login');
    }
});

api.get('/login', (req, res) => {
    res.send("LOGIN");
});

api.post('/register', (req, res) => {
    User.findOne({ teamName: req.body.teamName }, (err, user) => {
      /*
      Skip user creation if an error occurred or a
      user for the submitted teamName already exists.
      */
      if (err || user) {
        res.sendStatus(500);
      } else {
        // TODO: Inspect password strength, compare the submitted passwords etc.
        User.register(new User({ teamName: req.body.teamName }), req.body.password, (err, user) => {
          if (err) {
            res.sendStatus(500);
          } else {
            passport.authenticate('local')(req, res, () => {
              res.redirect('/#/dashboard');
            });
          }
        });
      }
    });
  });

api.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);

api.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
})

api.post('/submit', (req, res) => {
        // TODO
});

auth(app);
app.use('/api', api);

api.listen(3000, () => console.log('Example app listening on port 3000!'))