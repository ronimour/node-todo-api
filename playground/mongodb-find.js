const mongoDBUtils = require('./mongodb-utils');

var findUsers = (db) => {
  db.collection('Users')
  .find({name: "Barbara Tathyane"})
  .toArray()
  .then((docs) => {
      console.log('Users');
      console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch users', err);
  });
};

mongoDBUtils.connectTodoApp(findUsers);
