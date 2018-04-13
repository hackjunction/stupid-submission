import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventOrganizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  eventCode: {
    type: String,
    required: true,
    unique: true
  },
  eventName: {
    type: String,
    required: true
  },
  eventDescription: {
    type: String,
    required: true
  },
  /*
  applicationOpens: {
    required: true,
    type: Date
  },
  applicationCloses: {
    required: true,
    type: Date
  },
  */
  applicationFormConfig: {
    required: true,
    default: [],
    type: Array
  }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
