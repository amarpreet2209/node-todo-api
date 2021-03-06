require('./config/config');

const {ObjectID} = require('mongodb');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port =  process.env.PORT || 3000;
//returns func
app.use(bodyParser.json());

/////// post ////////
app.post('/todos',authenticate,(req,res) => {

  var todo = new Todo({
    text : req.body.text,
    _creator: req.user._id
  });


  todo.save().then((doc) => {
    res.send(doc);
  },(e) => {
    res.status(400).send(e);
  });
});

/////// get //////
app.get('/todos',authenticate,(req,res) => {
  Todo.find({
    _creator :req.user._id
  }).then((todos) => {
    res.send({todos})
  },(e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id',authenticate , (req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((err) => {res.status(400).send();})


});

//// delete /////

app.delete('/todos/:id' ,authenticate,(req,res) => {
  //get id
  var id = req.params.id;
  //validate id 404
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  //remove by id
  //success if no doc 404 || doc send doc back 200
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send(todo);
    }
    res.status(200).send({todo});
  }).catch((err) => res.status(400).send());

  //error 400

});

////// patch ///////
app.patch('/todos/:id',authenticate, (req,res) => {
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

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body},{new : true}).then((todo) => {

    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});

  }).catch((e) => {
    res.status(400).send();
  });
});

//////   POST /users   ////////////
app.post('/users' ,(req, res) => {
  var body = _.pick(req.body,['email','password']);
  var user = new User(body);


//if we have access to documents

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth',token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });

});


app.get('/users/me', authenticate ,(req,res) => {

  res.send(req.user);
});

app.post('/users/login',(req,res) => {
  var body = _.pick(req.body,['email','password']);

  User.findByCredentials(body.email,body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth',token).send(user);
    });
  }).catch((e) => {
    res.status(400).send({});
  });
});

app.delete('/users/me/token',authenticate,(req,res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  },() => {
    res.status(400).send();
  });
});



app.listen(port,() => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
