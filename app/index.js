const express = require('express');
const passport = require('passport');
const User = require('./server/models/User');
const auth = require('./server/auth');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const deadlineDate = new Date('2018-04-14T13:00:00');
const currentDate = new Date();
const root = path.join(__dirname, '/build');

const port = process.env.PORT || 3000;
const databaseURI = process.env.MONGODB_URI || 'mongodb://admin:stupidness@ds129906.mlab.com:29906/stupidhack-submission';

mongoose.connect(databaseURI);
auth(app);

app.use('/static', express.static(`${__dirname}/build/static`));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/', (req, res) => {
    res.sendFile('index.html', {root});
});

app.post('/register', (req, res) => {
    console.log(req.body);
    User.findOne({ teamName: req.body.teamName }, (err, user) => {
      /*
      Skip user creation if an error occurred or a
      user for the submitted teamName already exists.
      */
      if (err || user) {
        console.log(err);
        res.sendStatus(500);
      } else {
        // TODO: Inspect password strength, compare the submitted passwords etc.
        User.register(new User({ teamName: req.body.teamName }), req.body.password, (err, user) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            passport.authenticate('local')(req, res, () => {
              res.sendStatus(200);
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
                if(currentDate.getTime() < deadlineDate.getTime()){
                    res.sendStatus(200);
                }
                else {
                    res.sendStatus(500);
                }
            }
        });
    }
});

app.get('/api', (req, res) => {
  console.log(req.user)
    if(req.user) {
        if(currentDate.getTime() >= deadlineDate.getTime()){
            res.send({
                pastDeadline: true,
                submission: req.user.submission,
                user: {
                    teamName: req.user.teamName
                },
                judgingLink: req.user.judgingLink
            })
        } else {
            res.send({
                pastDeadline: false,
                submission: req.user.submission,
                user: {
                    teamName: req.user.teamName
                }
            })
        }
    } else {
        return res.sendStatus(403);
    }
})


app.listen(3000, () => console.log('Example app listening on port 3000!'))
