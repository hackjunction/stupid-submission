const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    teamName: {
        type: String
    },
    members: {
        type: [String]
    },
    submission: {
        projectName: {
            type: String
        },
        tableNumber: {
            type: String
        },
        description: {
            type: String
        }
    },
    judgingLink: {
        type: String
    }
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

const User = mongoose.model('User', userSchema);
