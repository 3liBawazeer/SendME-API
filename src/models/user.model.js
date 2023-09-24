const mongoose = require('mongoose')

const user = new mongoose.Schema({
    username:{type:String,require:false,default:"بدون إسم" },
    phoneNumber:{type:Number,require:true},
    countryKey:{type:String,require:true},
    FCMtoken:{type:String,default:""},
    image:{ type: String, default:"image-user.png" },
    friends:{
        type : [{ name : String , image : String , id:String, chatId : String }],
        default: [],
    },
    groups:{
        type : [{ name : String , image : String ,  groupId : String }],
        default: [],
    },
    unReadMessages:{
        type:[{
            id:String,
            chat : { type: mongoose.Schema.Types.ObjectId , ref:'chat'},
            content : String ,
            sender : { type:String , require: true } ,
            timestamp: String ,
            isRead:String,
         }],
         default:[],
    },
    messagesStatus:{
        type:[{
            messagesIds:[String],
            status:{type:String,default:"1"}
         }],
        default:[]
    },
    messagesDeleted:[String],
})

const User = mongoose.model('user',user);

exports.User = User;