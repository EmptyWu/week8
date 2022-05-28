var express = require('express');
const uploadImg = require('../controllers/upload.controller');

const { isAuth } = require('../services/auth.service');
const handleErrorAsync = require('../services/handleErrorAsync');
const image = require('../services/image.service');
var router = express.Router();

/* GET users listing. */
router.post('/',isAuth,image, handleErrorAsync(uploadImg.upload));

module.exports = router;