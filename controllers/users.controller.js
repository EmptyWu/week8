const {errorHandle,successHandle} = require('../services/FinishHandle.service');
const User = require('../models/users.model');
const { generateSendJWT } = require('../services/auth.service');
const bcrypt = require('bcrypt');
const validator = require('validator');
const postsModel = require('../models/posts.model');

const users = {
    // 取得使用者所有資訊
    async get(req, res, next) {
        const data = await User.find();
        successHandle(res,data);
    },
    
    // 新增
    async create(req, res, next) {
        const data = req.body
        const arg = ['name', 'email', 'password']
        const result = await arg.filter(key => data[key] == '' || data[key] == undefined)
        if(result.length > 0) {
            return next(errorHandle(400, `${result.toString()} 欄位不正確`, next));
        }
        const user = await User.create({
            name: data.name,
            email: data.email,
            password: data.password,
            image: data.image,
            createAt: data.createAt,
        });
        successHandle(res,user);    
       
    },
    // 刪除 -全部
    async delete(req, res) {
        await User.deleteMany({});
        const users = await User.find();
        successHandle(res,users);   
        
    },
    // 刪除 -單筆
    async deleteQuery(req, res, next) {
        const id = req.params.id
        // const result = await User.findByIdAndDelete(id);
        const result = await User.deleteOne({user_id: id})
        const users = await User.find();
        if(result==null){
          return next(errorHandle(400, `無此筆id`, next));
        }else{
          successHandle(res,users);   
         
        }
        
    },
    // 編輯 -單筆(暱稱修改)
    async editQuery(req, res, next) {
        const id = req.params.id
        const data = req.body
        const arg = ['name', 'sex']
        const result = await arg.filter(key => data[key] == '' || data[key] == undefined)

        if(result.length > 0) {
            return next(errorHandle(400, `${result.toString()} 欄位不正確`, next));
        }

        const users = await User.findByIdAndUpdate(id, data, { new: true});
        if(users == null) next(errorHandle(400, `${res}`, next))
        else {
          successHandle(res,users);   
        }
    },
    // 編輯 -單筆(重設密碼)
    async resetPassword(req, res, next) {
        const { password, confirmPassword } = req.body;
			if (password !== confirmPassword) {
                return next(errorHandle(400, `密碼不一致`, next));
			}
			newPassword = await bcrypt.hash(password, 12);
     
			const user = await User.findByIdAndUpdate(req.user.id, {
				password: newPassword,
			});
			generateSendJWT(user, 200, res);
    },
    async singin(req,res,next){
           const {email,password}=req.body;
           if(!email||!password){
                return next(errorHandle(400, `帳號密碼不可為空`, next));
           }
           const user = await User.findOne({ email }).select('+password');
           if(!user){
                return next(errorHandle(400, `尚未註冊or已經刪除`, next));
           }
           const auth =await bcrypt.compare(password, user.password);
           if(!auth){
                return next(errorHandle(400, `您的密碼不正確`, next));
           }           
           generateSendJWT(user,200,res);
    },
    async sign_up(req,res,next){                     
            let { email, password,confirmPassword,name  } = req.body;
            if (!email || !password || !confirmPassword || !name) {
                return next(errorHandle('400', '欄位未填寫正確！', next));
              }
              
              // 密碼 8 碼以上
              if (!validator.isLength(password, { min: 8 })) {
                return next(errorHandle('400', '密碼字數低於 8 碼', next));
              }
              // 是否為 Email
              if (!validator.isEmail(email)) {
                return next(errorHandle('400', 'Email 格式不正確', next));
              }
            if(password!=confirmPassword){
                return next(errorHandle(400, `兩次密碼不正確`, next));
            }
            const newpassword = await bcrypt.hash(req.body.password,12);
            const newUser = await User.create({
                email,
                password:newpassword,
                name               
            });
            generateSendJWT(newUser,200,res);    
    },
    // 取得 -單筆
    async getQuery(req, res, next) {        
        const user = await User.findById(req.user.id);
        successHandle(res,user);          
    },
    async updateProfile(req, res, next) {
        const data = req.body
      const editUser = await User.findByIdAndUpdate(req.user.id, data, { new: true});
      if (editUser === null) {
        return next(errorHandle(400, '沒有此user，不可編輯', next));
      }
      return successHandle(res, editUser);
    },
    async follow(req, res, next) {
      const userID=req.params.userID ;      
      if(userID==undefined){
          return next(errorHandle(400, `userID未輸入`, next));
      }
      if (userID === req.user.id) {
        return next(errorHandle(401,'您無法追蹤自己',next));
      }
      await User.updateOne(
        {
          _id: req.user.id,
          following: { $ne: [userID] }
        },
        {
          $addToSet: { following:  userID  }
        }
      );
      await User.updateOne(
        {
          _id: userID,
          followers: { $ne: [req.user.id]}
        },
        {
          $addToSet: { followers:   req.user.id  } 
        }
      );
      successHandle(res,{message: '您已成功追蹤！'});   
     
    },
    async unfollow(req, res, next) {
      const userID=req.params.userID ;      
      if(userID==undefined){
          return next(errorHandle(400, `userID未輸入`, next));
      }
      if (userID === req.user.id) {
        return next(errorHandle(401,'您無法取消追蹤自己',next));
      }
      await User.updateOne(
        {
          _id: req.user.id,
          following: { $in: [userID] }
        },
        {
          $pull: { following:  userID  }
        }
      );
      await User.updateOne(
        {
          _id: userID,
          followers: { $in: [req.user.id]}
        },
        {
          $pull: { followers:   req.user.id  } 
        }
      );
      successHandle(res,{message: '您已成功取消追蹤！'}); 
    },
    async getLikeList(req,res,next){
      const likeList=await postsModel.find({likes:{$in: [req.user.id]}})
      .populate({
        path:"user",
        select:"name _id"
      });
      successHandle(res,likeList);   
    },
    async getfollowing(req,res,next){
      const followingList=await User.find({_id:req.user.id})
      .populate({
        path:"following",
        select:"name _id"
      });;
      successHandle(res,followingList); 
    }

}

module.exports = users;