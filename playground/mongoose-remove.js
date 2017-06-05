const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//Todo.remove({}) not empty {} everything
//doesnt return
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

//to get object back
// Todo.findOneAndRemove({id:''})
Todo.findByIdAndRemove('59357eb795e683db08cb88df').then((todo) => {
  console.log(todo);
});
