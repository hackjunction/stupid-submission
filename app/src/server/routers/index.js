import mainRouter from './mainRouter';
import userDataRouter from './userDataRouter';
import organizerDataRouter from './organizerDataRouter';
import adminDataRouter from './adminDataRouter';

export default function configureRouters(app) {
  app.use(mainRouter);
  app.use('/userdata', userDataRouter);
  app.use('/organizerdata', organizerDataRouter);
  app.use('/admindata', adminDataRouter);
}
