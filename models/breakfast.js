// link to mongoose
var mongoose = require('mongoose');
// create the breakfast SCHEMA
var breakfastSchema = new mongoose.Schema( {
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    content: {
        type: String,
        default: '',
        trim: true
    }
});

// make it public
module.exports = mongoose.model('breakfast', breakfastSchema);