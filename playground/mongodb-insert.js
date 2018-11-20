const mongoDBUtils = require('./mongodb-utils');
const test = require('assert');
const fs = require('fs');

var usersJson = fs.readFileSync('./playground/users.json');
var users = JSON.parse(usersJson);

var insertUser = (db) => {
  db.collection('Users').insertMany(users, (err, result)  => {
    if(err){
      return console.log('Unable to insert user', err);
    }
    test.equal(null,err);
    test.equal(4, result.insertedCount);

    console.log(JSON.stringify(result.ops, undefined, 2));
  });

};

mongoDBUtils.connectTodoApp(insertUser);
