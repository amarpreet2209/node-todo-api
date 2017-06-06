var env = process.env.NODE_ENV || 'development';
console.log('env **********',env);
if(env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI='mongodb://localhost:27017/TodoApp'
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI='mongodb://localhost:27017/TodoAppTest'

}



const {ObjectID} = require('mongodb');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port =  process.env.PORT || 3000;
//returns func
app.use(bodyParser.json());

app.post('/todos',(req,res) => {

  var todo = new Todo({
    text : req.body.text
  });


  todo.save().then((doc) => {
    res.send(doc);
  },(e) => {
    res.status(400).send(e);
  });
});

app.get('/todos',(req,res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  },(e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id' , (req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((err) => {res.status(400).send();})


});

//// delete /////

app.delete('/todos/:id' ,(req,res) => {
  //get id
  var id = req.params.id;
  //validate id 404
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  //remove by id
  //success if no doc 404 || doc send doc back 200
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send(todo);
    }
    res.status(200).send({todo});
  }).catch((err) => res.status(400).send());

  //error 400

});

////// patch ///////
app.patch('/todos/:id', (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    //returns timestamp
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;

  }

  Todo.findByIdAndUpdate(id, {$set: body},{new : true}).then((todo) => {

    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});

  }).catch((e) => {
    res.status(400).send();
  });
});


app.listen(port,() => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
