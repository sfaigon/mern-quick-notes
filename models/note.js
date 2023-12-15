const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SALT_ROUNDS = 6

const noteSchema = new Schema({
    text: {
        type: String, 
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Note', noteSchema)