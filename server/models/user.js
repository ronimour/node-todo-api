var mongoose = require('mongoose');

var User = mongoose.model('User',{
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  age: {
    type: Number,
    min: 18
  },
  location: {
    type: String,
    default: 'BR',
    minlength: 2,
    trim: true
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
});

module.exports = {User};
