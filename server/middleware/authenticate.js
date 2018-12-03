const {User} = require('./../models/user');
const bcrypt = require('bcryptjs');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');
  User.findByToken(token).then((user) => {
    if(!user){
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

var logon = (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  User.findByCredentials(email, password).then((user) =>{
    user.generateAuthToken().then((token) => {
      req.user = user;
      req.token = token;
      next();
    });
  }).catch((e) =>{
    res.status(401).send();
  });
};

module.exports = {authenticate, logon};
