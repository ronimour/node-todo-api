const {MongoClient, ObjectID} = require('mongodb');

var connectTodoApp = (callback) => {

  MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
      console.log('Unable to connect to MongoDB server');
    }

    console.log('Connect to MongoDB server');

    callback(db);

    db.close();
  });
};

module.exports = {
  connectTodoApp
};
