const mongoDBUtils = require('./mongodb-utils');
const {ObjectID} = require('mongodb');

var deleteTodos = (db) => {
  // db.collection('Todos')
  // .deleteMany({text: 'To delete'})
  // .then((result) => {
  //       console.log(result)
  //   });
  //
  // db.collection('Todos')
  // .findOneAndDelete({completed: false})
  // .then((result) => {
  //   console.log(result);
  // });
};

var deleteUsers = (db) => {


  db.collection('Users')
  .deleteMany({name: 'Ronny Moura'})
  .then((result) => {
    console.log('Using deleteMany');
    console.log(result);
  });


  db.collection('Users')
  .deleteOne({_id: new ObjectID('5bef1561640d282284b63dfc')})
  .then((result) => {
    console.log('Using deleteOne');
    console.log(result);
  });


  db.collection('Users')
  .findOneAndDelete({name: 'Roberto Dantas'})
  .then((result) => {
    console.log('Using findOneAndDelete');
    console.log(result);
  });

};

mongoDBUtils.connectTodoApp(deleteUsers);
