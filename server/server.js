require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate, logon} = require('./middleware/authenticate');
var app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());

debugger;

//Todos Routes
app.post('/todos', authenticate,(req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  } , (e) => {
    res.status(400).send();
  });
});

app.get('/todos', authenticate, (req, res) => {
   Todo.find({
     _creator: req.user._id
   }).then((todos) => {
     res.send({todos});
   }, (e) => {
     res.status(400).send(e);
   });
});

app.get('/todos/:id', authenticate, (req, res) => {
   var id = req.params.id;
   Todo.findOne({
       _id: id,
       _creator: req.user._id
     }).then((todo) => {
     if(!todo){
       return res.status(404).send();
     }
     res.send({todo});
   }).catch((e) => {
       res.status(400).send();
   });
});

app.delete('/todos/:id', authenticate, (req, res) => {
   var id = req.params.id;
   Todo.findOneAndRemove({
       _id: id,
       _creator: req.user._id
     }).then((todo) => {
     if(!todo){
       return res.status(404).send();
     }
     res.send({todo});
   }).catch((e) => {
     res.status(400).send();
   });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
      }, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) =>{
    res.status(400).send();
  });
})

//Users Routes
app.post('/users', async (req, res) => {
  try{
    var body = _.pick(req.body, ['email','password']);
    var user = new User(body);
    await user.save();
    var token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch(e){
    res.status(400).send(e);
  }
});

app.get('/users/me', authenticate , (req, res) => {
  res.send(req.user);
});

app.post('/users/login', logon, (req, res) => {
  res.header('x-auth', req.token).send(req.user);
});

app.delete('/users/me/token', authenticate , (req, res) => {
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


app.listen(port, () => {
  console.log(`Started up on port ${port}`);
})

module.exports = {app};
