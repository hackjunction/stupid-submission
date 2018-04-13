import express from 'express';
import mongoose from 'mongoose';
import {
  isUserAuthenticated,
  isUserOrganizerOrAdmin,
  isCSRF,
  sendQueriedDataOrError,
  sendUpdateOutcome
} from './routerUtil';
import Event from '../models/Event';
import { IdAndVersionRemoverString } from '../models/modelUtil';

const organizerDataRouter = express.Router();

organizerDataRouter.use(isUserAuthenticated);
organizerDataRouter.use(isUserOrganizerOrAdmin);
organizerDataRouter.use(isCSRF);

organizerDataRouter.get('/get-all-events-for-organizer', (req, res) => {
  Event.find(
    { eventOrganizer: new mongoose.Types.ObjectId(req.user._id) },
    `${IdAndVersionRemoverString} -eventOrganizer`,
    sendQueriedDataOrError(res)
  );
});

organizerDataRouter.post('/save-generated-application-form-config', (req, res) => {
  Event.findOneAndUpdate(
    { eventOrganizer: new mongoose.Types.ObjectId(req.user._id), eventCode: req.body.eventCode },
    { applicationFormConfig: req.body.applicationFormConfig },
    sendUpdateOutcome(res)
  );
});

export default organizerDataRouter;
