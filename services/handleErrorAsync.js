const handleErrorAsync = function handleErrorAsync(fn) {
    return function (req, res, next) {
      fn(req, res, next).catch(function (error) {
        return next(error);
      });
    };
  };
  
  module.exports = handleErrorAsync;