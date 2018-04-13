const express = require('express');
const passport = require('passport');
const User = require('./server/models/User');
const auth = require('./server/auth');
const path = require('path');

const app = express();
const deadlineDate = new Date('2018-04-14T12:00:00');
const root = path.join(__dirname, '/build');

app.use('/static', express.static(`${__dirname}/build/static`));

app.get('/', (req, res) => {
    res.sendFile('index.html', {root});
});

app.post('/register', (req, res) => {
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
              res.redirect('/');
            });
          }
        });
      }
    });
  });

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

app.post('/submit', (req, res) => {
    if(req.user) {
        User.findOneAndUpdate({ teamName: req.user.teamName }, { $set: { submission: req.body } }, (err, user) => {
            if(err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
    }
});

auth(app);

app.listen(3000, () => console.log('Example app listening on port 3000!'))