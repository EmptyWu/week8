const {errorHandle,successHandle} = require('../services/FinishHandle.service');
const Post = require('../models/posts.model');
const Comment = require('../models/comments.model');

module.exports = {
	addPost:async (req, res, next) => {
        const{content}=req.body;
		if(content==undefined){
			return next(errorHandle(400,"你沒有填寫 content 資料",next));
		}
		const newPost = await Post.create({
			user: req.user.id,
			tags: req.body.tags,			
			image: req.body.image,
			content: req.body.content
		});
		successHandle(res,newPost);
    },
    GetAll:async (req,res,next)=>{       
		const getPost = await Post.find({});
		successHandle(res,getPost);
    },
    GetPostID:async (req,res,next)=>{     
        const postID=req.params.postID ;
        if(postID==undefined){
            return next(errorHandle(400, `postID未輸入`, next));
        }
		const getPost = await Post.findOne({_id:postID});
		successHandle(res,getPost);
    },
    addlike:async (req,res,next)=>{
        const postID=req.params.postID ;
        if(postID==undefined){
            return next(errorHandle(400, `postID未輸入`, next));
        }
        const getPost = await Post.findOneAndUpdate(
            {_id:postID},
            {$addToSet:{likes:req.user.id}}
            ,{new:true}
            );
		successHandle(res,getPost);
    },
    unlike:async (req,res,next)=>{
        const postID=req.params.postID ;
        if(postID==undefined){
            return next(errorHandle(400, `postID未輸入`, next));
        }
        const getPost = await Post.findOneAndUpdate(
            {_id:postID},
            {$pull:{likes:req.user.id}}
            ,{new:true}
            );
		successHandle(res,getPost);
    },
    addcomment:async (req,res,next)=>{
        const postID=req.params.postID ;
        const {comment} = req.body;
        if(postID==undefined){
            return next(errorHandle(400, `postID未輸入`, next));
        }
        if(comment==undefined){
            return next(errorHandle(400, `留言內容有誤`, next));
        }
        const addComment = await Comment.create({
            post: postID,
            user: req.user.id,
            comment
        });
        const getPost = await Post.findOne({_id:postID});
		successHandle(res,getPost);
    },
    GetPersonPost:async (req,res,next)=>{
        const userID=req.params.userID ;
        if(userID==undefined){
            return next(errorHandle(400, `userID未輸入`, next));
        }
        const getPost = await Post.find({user:userID});
        successHandle(res,getPost);
        }
};
