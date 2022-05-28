var express = require('express');

const usersController = require('../controllers/users.controller');
const { isAuth } = require('../services/auth.service');
const handleErrorAsync = require('../services/handleErrorAsync');
var router = express.Router();
// 取得個人資料
router.get('/profile',isAuth, handleErrorAsync(usersController.getQuery));

//更新個人資料
router.patch('/profile',isAuth, handleErrorAsync(usersController.updateProfile));
//註冊
router.post('/sign_up', handleErrorAsync(usersController.sign_up));
//登入
router.post('/sign_in', handleErrorAsync(usersController.singin));
//重設密碼
router.post('/updatePassword',isAuth, handleErrorAsync(usersController.resetPassword));
router.post('/:userID/follow',isAuth, handleErrorAsync(usersController.follow));
router.delete('/:userID/unfollow',isAuth, handleErrorAsync(usersController.unfollow));
//取得個人按讚列表
router.get('/getLikeList',isAuth, handleErrorAsync(usersController.getLikeList));
router.get('/following',isAuth, handleErrorAsync(usersController.getfollowing));

module.exports = router;
