const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

// var countGlobal = 0;
//
Todo.count({}, (err, count) => {
  if(err){
    console.log(err);
  } else {
    console.log(`Total of todos ${count}`);
  }
});

app.use(bodyParser.json());

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
     return res.send({todo});
   }).catch((e) => {
       res.status(400).send();
   });
});
//
// app.delete('/todos/all/', (req, res) => {
//    Todo.remove({}).then((result) => {
//      console.log(`${result.result.n} todos deleted`);
//      res.status(200).send();
//    }).catch((e) => {
//       res.status(404).send();
//    });
// });

app.delete('/todos/:id', (req, res) => {
   var id = req.params.id;
   Todo.findByIdAndRemove(id).then((todo) => {
     if(!todo){
       return res.status(404).send();
     }
     return res.send({todo});
   }).catch((e) => {
     res.status(400).send();
   });
});

app.listen(port, () => {
  console.log(`Started up on port ${port}`);
})

module.exports = {app};
