const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
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
    usernameField: 'teamName'
});

const User = mongoose.model('User', userSchema);
