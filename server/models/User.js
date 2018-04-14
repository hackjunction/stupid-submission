const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const submissionSchema = new mongoose.Schema({
  projectName: {
      type: String,
      required: true
  },
  teamMembers: {
      type: [String],
      required: true
  },
  description: {
      type: String,
      required: true
  },
  table: {
      type: String,
      required: true
  },
  link: {
      type: String,
  }
})
const userSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        index: true
    },
    submission: {
        type: submissionSchema,
        required: false
    },
    judgingLink: {
        type: String
    },
    judgingSecret: {
        type: String
    },
    gavelId:{
        type: Number
    }
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'teamName'
});

module.exports = mongoose.model('User', userSchema);
