import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  hasVerifiedEmail: {
    type: Boolean,
    default: false
  },
  firstName: {
    type: String
  },
  lastName: {
    lastName: String
  },
  userRole: {
    type: String,
    default: 'PARTICIPANT',
    enum: ['PARTICIPANT', 'PARTNER', 'VOLUNTEER', 'ORGANIZER', 'ADMIN']
  }
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

const User = mongoose.model('User', userSchema);

export default User;
