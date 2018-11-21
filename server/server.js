const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  } , (e) => {
    res.status(400).send(e);
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
       res.status(404).send('Todo not found');
     } else {
       res.send({todo});
     }
   }).catch((e) => {
     if(e.name === 'CastError' && e.kind === 'ObjectId'){
       res.status(404).send('Invalid Id');
     } else {
       res.status(400).send(e);
     }
   });
});

app.listen(port, () => {
  console.log(`Started up on port ${port}`);
})

module.exports = {app};