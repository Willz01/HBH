const mongoose = require('mongoose')
const user = require('user')

const storySchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    poster:{
        type: String,
        required: true
    },
    comments:{
        type: Array,
        default: [],  // {commenter, comment}
        required: false
    }
})


module.exports = mongoose.model('stories', storySchema)