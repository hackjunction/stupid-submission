import express from 'express';
import mongoose from 'mongoose';
import {
  isUserAuthenticated,
  isCSRF,
  sendQueriedDataOrError,
  sendUpdateOutcome
} from './routerUtil';
import Application from '../models/Application';
import Event from '../models/Event';
import User from '../models/User';
import { IdAndVersionRemoverString } from '../models/modelUtil';

const userDataRouter = express.Router();

userDataRouter.use(isUserAuthenticated);
userDataRouter.use(isCSRF);

userDataRouter.get('/get-user-role', (req, res) => {
  res.send(req.user.userRole);
});

userDataRouter.get('/get-all-open-events', (req, res) => {
  Event.find({}, IdAndVersionRemoverString, sendQueriedDataOrError(res));
});

userDataRouter.get('/get-previously-saved-responses', (req, res) => {
  Application.findOne(
    { applicantId: new mongoose.Types.ObjectId(req.user._id) },
    '-_id applicationFormResponses',
    sendQueriedDataOrError(res)
  );
});

userDataRouter.post('/submit-application', (req, res) => {
  Event.findOne({ eventCode: req.body.eventCode }, (err, event) => {
    // An error occurred or no corresponding event was found.
    if (err || !event) {
      res.sendStatus(500);
    } else {
      Application.findOneAndUpdate(
        {
          applicantId: new mongoose.Types.ObjectId(req.user._id),
          eventId: new mongoose.Types.ObjectId(event._id)
        },
        { applicationFormResponses: req.body.responses },
        { upsert: true },
        sendUpdateOutcome(res)
      );
    }
  });
});

export default userDataRouter;
