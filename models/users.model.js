const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '姓名未填寫']
  },
  // email -前端不顯示
  email: {
    type: String,
    required: [true, 'email未填寫'],
    unique: true,
    select: true
  },
  // password -前端不顯示
  password: {
    type: String,
    required: [true, '密碼未填寫'],
    unique: true,    
    select: false,
  }, 
  following:[{ 
    type: mongoose.Schema.ObjectId, 
    ref: 'User' 
  }],
  followers: [{ 
    type: mongoose.Schema.ObjectId, 
    ref: 'User' 
  }],
  // following: [{user:{ 
  //   type: mongoose.Schema.ObjectId, 
  //   ref: 'User' 
  // }}],	 
  // followers: [{user:{ 
  //   type: mongoose.Schema.ObjectId, 
  //   ref: 'User' 
  // }}],	  
},{
  versionKey: false,
  // timestamps:true,
  // toJSON: {virtuals:true},
  // toObject: {virtuals:true},	
});

const users = mongoose.model('User', userSchema);

module.exports = users;