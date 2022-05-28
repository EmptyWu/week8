const express = require('express');
const router = express.Router();
const PostController = require('../controllers/posts.controller');
const { isAuth } = require('../services/auth.service');
const handleErrorAsync = require('../services/handleErrorAsync');

router.get('/',handleErrorAsync(PostController.GetAll));
router.get('/:postID',handleErrorAsync(PostController.GetPostID));
router.post('/',isAuth,handleErrorAsync(PostController.addPost));
router.post('/:postID/like',isAuth,handleErrorAsync(PostController.addlike));
router.delete('/:postID/unlike',isAuth,handleErrorAsync(PostController.unlike));
router.post('/:postID/comment',isAuth,handleErrorAsync(PostController.addcomment));
router.get('/user/:userID',isAuth,handleErrorAsync(PostController.GetPersonPost));

module.exports = router;
