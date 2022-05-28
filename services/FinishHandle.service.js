const successHandle =(res, data)=> {
    res.send({
      "status": "success",
      data,
    });
    res.end();
  }

 const errorHandle= (httpStatus, errMessage, next)=> {
    const error = new Error(errMessage);
    error.statusCode = httpStatus;
    error.isOperational = true;
    next(error);
  }
  
  module.exports = {successHandle,errorHandle};