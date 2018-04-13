import express from 'express';
import {
  isUserAuthenticated,
  isUserAdmin,
  isCSRF,
  sendQueriedDataOrError,
  sendUpdateOutcome
} from './routerUtil';
import Event from '../models/Event';
import User from '../models/User';
import { IdAndVersionRemoverString } from '../models/modelUtil';

const adminDataRouter = express.Router();

adminDataRouter.use(isUserAuthenticated);
adminDataRouter.use(isUserAdmin);
adminDataRouter.use(isCSRF);

adminDataRouter.post('/create-event', (req, res) => {
  Event.create(req.body, sendUpdateOutcome(res));
});

adminDataRouter.get('/get-all-events', (req, res) => {
  Event.find(
    {},
    `${IdAndVersionRemoverString} -applicationFormConfig`,
    sendQueriedDataOrError(res)
  );
});

adminDataRouter.get('/get-all-organizer-users', (req, res) => {
  // NOTE: This is currently returning the ObjectId and version fields as well.
  User.find({ userRole: 'ORGANIZER' }, sendQueriedDataOrError(res));
});

export default adminDataRouter;
