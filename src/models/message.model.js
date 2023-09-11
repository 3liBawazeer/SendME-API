const mongoose = require('mongoose')

const mesg = new mongoose.Schema({
   chat : { type: mongoose.Schema.Types.ObjectId , ref:'chat'},
   content : String ,
   sender : { type: mongoose.Schema.Types.ObjectId , ref:'user'} ,
   timestamp: String ,
})

const Messages = mongoose.model('message', mesg );

exports.Messages = Messages ;