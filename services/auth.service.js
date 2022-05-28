const jwt = require('jsonwebtoken');
const {errorHandle,successHandle} = require('./FinishHandle.service'); 


const User = require('../models/users.model');



  const isAuth = async (req, res, next) => {
    // 確認 token 是否存在
    let token;
    if (req.headers.authorization ){
      token = req.headers.authorization;
    
    if(req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization?.split(' ')[1];
    }
  }
    if (!token) {
      return next(errorHandle(401,'你尚未登入！',next));
    }    
    
    // 驗證 token 正確性
    const decoded = await new Promise((resolve,reject)=>{
      jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
        if(err){
          //next(err)
          return next(errorHandle(400,'尚未授權!',next));          
          //res.send({msg:"尚未授權!"})
        }else{
          resolve(payload)
        }
      })
    })
  
    const currentUser = await User.findById(decoded.id);
    req.user = currentUser;
    next();
  };
  const generateSendJWT= (user,statusCode,res)=>{
    // 產生 JWT token
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
      expiresIn: process.env.JWT_EXPIRES_DAY
    });
    user.password = undefined;       
    successHandle(res,{user:{
        token,
        name: user.name        
      }});
   
  }
  module.exports ={
    isAuth,
    generateSendJWT
}
