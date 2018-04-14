const express = require('express');
const passport = require('passport');
const User = require('./server/models/User');
const auth = require('./server/auth');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fetch = require('node-fetch');

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
        if(currentDate.getTime() < deadlineDate.getTime()){
            User.update({ teamName: req.user.teamName }, { $set: { submission: req.body } }, (err, writeResult) => {
                if(err) {
                    res.sendStatus(500);
                } else {
                  console.log(writeResult);
                  if(writeResult.nUpserted === 1){
                    console.log("upserted")
                    fetch(process.env.GAVEL_URL + '/api/submit-project', {
                      body: {
                        project_name:req.body.projectName,
                        project_location:req.body.table,
                        project_description:req.body.description,
                        team_email:req.body.projectName+"@stupidhack.hackjunction.com"
                      },
                      headers: {
                        'Authorization': 'Basic ' + base64.encode(process.env.GAVEL_USER + ":" + process.env.GAVEL_PASSWORD)
                      }
                    }).then((result) => {
                      User.update({ teamName: req.user.teamName },
                        { $set: {
                          judgingLink: result.data.annotator_link,
                          judgingSecret: result.data.annotator_secret,
                          gavelId: result.data.project_id
                        }}, (err, writeResult) => {
                        if(!err){
                          res.sendStatus(200);
                        } else {
                          res.sendStatus(500);
                        }
                      })
                    }).catch(() => {
                      res.sendStatus(500);
                    })
                  } else {
                    console.log("modified")
                    fetch(process.env.GAVEL_URL + '/admin/item_patch', {
                      body: {
                        item_id: req.user.gavelId,
                        location: req.body.table,
                        name: req.body.projectName,
                        description:req.body.description
                      },
                      headers: {
                        'Authorization': 'Basic ' + base64.encode(process.env.GAVEL_USER + ":" + process.env.GAVEL_PASSWORD)
                      }
                    }).then((result) => {
                      res.sendStatus(200);
                    }).catch(() => {
                      res.sendStatus(500);
                    })
                  }
                }
            })
        }
        else {
            res.sendStatus(500);
        }
    } else {
        res.send(403);
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
