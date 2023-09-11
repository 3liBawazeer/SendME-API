const mongoose = require('mongoose')

const chat = new mongoose.Schema({
   users : [String]
})

const Chat = mongoose.model('chat',chat);

exports.Chat = Chat;