const winston = require('winston');

module.exports = function (err, req, res, next) {
  // Log the execption
    // winston.log('error', err.message);
    winston.error(err.message,err);
    //error

    //warn

    //info

    //verbose

    //debug

    //silly
  res.status(500).send("Something Failed");
};