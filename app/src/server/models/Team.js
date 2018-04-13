import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const teamSchema = new mongoose.Schema({
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

teamSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

const Team = mongoose.model('Team', teamSchema);

export default Team;