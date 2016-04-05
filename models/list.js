// link to mongoose
var mongoose = require('mongoose');
var listSchema = new mongoose.Schema({
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
        default: ''
    },
    userPhoto:{ 
        fieldname: 'String',
    },
    ingredient:{
        type: String,
        default: ''
    },
    time:{
        type: String,
        default: ''
    }
});

// make it public
module.exports = mongoose.model('List', listSchema);
