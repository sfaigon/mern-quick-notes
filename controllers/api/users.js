const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcrypt')

//"create" function here is kalesoup
async function create(req, res) {
    // baby steps, this was used to test our frontend form
    // api call functionality
    // res.json({
    //     user: {
    //         name: req.body.name,
    //         email: req.body.email
    //     }
    // })
    try {
        //"create" here adds user to the db
        //https://mongoosejs.com/docs/api/model.html#Model.create()
        const user = await User.create(req.body)

        const token = createJWT(user)
        console.log('this is the token in signup', token)
        // Yes, we can use res.json to send back just a string
        // The client code needs to take this into consideration
        res.json(token);
    } catch (err) {
        res.status(400).json(err)
    }
}

// function to login a user
async function login(req, res) {
    try {
        // find the user in the db
        const user = await User.findOne({ email: req.body.email })
        //throw an error if they're not found
        if(!user) throw new Error()
        //compare the password (using decrypt)
        const match = await bcrypt.compare(req.body.password, user.password)
        //log them in if there's a match (create the token)
        if(match) {
            const token = createJWT(user)
            res.json(token)
        } else {
            throw new Error()
        }
        //throw an error if there is no match
    } catch {
        res.status(400).json('Bad Credentials')
    }
}

// Helper Functions //
//this is called whenever we need to create a web token
function createJWT(user) {
    console.log('this is secret', process.env.SECRET)
    return jwt.sign(
        // data payload
        {user},
        process.env.SECRET,
        {expiresIn: '24h'}
    )
}

function checkToken(req, res) {
    console.log('req.user', req.user);
    res.json(req.exp);
}

module.exports = {
    create, 
    login, 
    checkToken
}