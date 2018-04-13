const  express = require('express');
const  passport = require('passport');
const  Team = require('./models/Team');

const api = express()
const deadlineDate = new Date('2018-04-14T12:00:00')

api.get('/', (req, res) => {
    if(req.user) {
        const currentDate = new Date()
        if(currentDate.getTime() >= deadlineDate.getTime()){
            res.send("You late boi")
        }
        res.send("Still time boi")
    }
    else {
        res.send("yah");
    }
})

api.listen(3000, () => console.log('Example app listening on port 3000!'))