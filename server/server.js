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
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  } , (e) => {
    res.status(400).send();
  });
});

app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
     res.send({todos});
   }, (e) => {
     res.status(400).send(e);
   });
});

app.get('/todos/:id', (req, res) => {
   var id = req.params.id;
   Todo.findById(id).then((todo) => {
     if(!todo){
       return res.status(404).send();
     }
     res.send({todo});
   }).catch((e) => {
       res.status(400).send();
   });
});

app.delete('/todos/:id', (req, res) => {
   var id = req.params.id;
   Todo.findByIdAndRemove(id).then((todo) => {
     if(!todo){
       return res.status(404).send();
     }
     res.send({todo});
   }).catch((e) => {
     res.status(400).send();
   });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) =>{
    res.status(400).send();
  });
})

//Users Routes
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email','password']);
  var user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    console.log(token);
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.post('/users/login', logon, (req, res) => {
  res.header('x-auth', req.token).send(req.user);
});

app.get('/users/me', authenticate , (req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Started up on port ${port}`);
})

module.exports = {app};
