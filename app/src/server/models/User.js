const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    members: {
        type: [String],
        required: true
    },
    submission: {
        projectName: {
            type: String,
            required: true
        },
        tableNumber: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
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
