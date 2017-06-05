const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '593517964c5ba5bc3638618c11';
// if(!ObjectID.isValid(id)) {
//   console.log('ID not vaLID');
// }

//
// Todo.find({
//   //mongoose converts string to object id
//   _id : id
// }).then((todos) => {
//   console.log('Todos',todos);
// });
//
// Todo.findOne({
//   _id : id
// }).then((todo) => {
//   console.log('Todo',todo);
// });

// Todo.findById(id).then((todo) => {
//   if(!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo By ID',todo);
// }).catch((e) => {
//   console.log(e);
// });

//USERS id find by id
// query works no user//query works/error
User.findById('5932fc53af1fd4240e0ea6d8').then((res) => {
  if(!res) {return console.log('No user');}
  console.log(JSON.stringify(res,undefined,2));
}).catch((err) => {
  console.log(err);
});
