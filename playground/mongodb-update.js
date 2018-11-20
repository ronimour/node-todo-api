const mongoDBUtils = require('./mongodb-utils');
const {ObjectID} = require('mongodb');
// const test = require('assert');

var updateUsers = (db) => {
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5bf03ce2d9e92e25a48e6ba0')
  },{
    $set: {name: "Roberto Anrafel"},
    $inc: {age: 1}
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
    // test.equal(26, result.value.age);
    // test.equal("Roberto Anrafel", result.value.name);
  });

};

mongoDBUtils.connectTodoApp(updateUsers);
