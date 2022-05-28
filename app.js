var express = require('express');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./connection')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users.route');
var uploadRouter = require('./routes/upload.route');
var postsRouter = require('./routes/posts.route');

var app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);
app.use('/posts', postsRouter);

// 找不到頁面
app.use((req, res, next) => {
    res.status(404).json({
      status: 'error',
      message: "無此頁面資訊",
    });
})

// 程式錯誤處裡

// production 回應模式：正式環境
const resErrorProd = (err, res) => {
  if(err.isOperational) { // 是預期
    res.status(err.statusCode).json({
      message: err.message,
    })
  } else {
    // 未預期
    console.log('出現重大錯誤', err)
    res.status(err.statusCode).json({
      message: '系統錯誤, 請洽系統管理員',
      status: 'error'
    })
  }
}

// dev 回應模式：開發環境
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack
  })
}

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if(process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res)
  }
  if(err.name === 'ValidationError') {
    err.message = '資料欄位未填寫正確, 請重新輸入!'
    error.isOperational = true;
    return resErrorProd(err, res)
  }
  resErrorProd(err, res)
})

// 未捕捉到的 catch
process.on('unhandledRejection', (reason, promise) => {
  console.log('為捕捉到的 rejection:', promise, '原因:', reason);
  // 紀錄於 log 上
})

module.exports = app;
