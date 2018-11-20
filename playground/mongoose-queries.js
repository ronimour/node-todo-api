const {mongoose} = require('./../server/db/mongoose');
const {User} = require('./../server/models/user');

var id = '5bf03ce2d9e92e25a48e6b9e';

User.findById(id).then((user) => {
  if(!user){
    return console.log('Id not found');
  }
  console.log('User By Id',user);
}).catch((e) => console.log(e));
