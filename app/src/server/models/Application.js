import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  eventCode: {
    type: String,
    isRequired: true
  },
  eventName: {
    type: String,
    isRequired: true
  },
  applicationFormResponses: {
    type: Array,
    isRequired: true,
    default: []
  },
  applicationStatus: {
    type: String,
    isRequired: true,
    default: 'NOT_SUBMITTED',
    enum: ['NOT_SUBMITTED', 'SUBMITTED', 'ADMITTED', 'REJECTED', 'CONFIRMED', 'DECLINED']
  }
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
