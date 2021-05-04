const { Schema, model } = require('../connections/writer');
const userSchema = new Schema({
  "login": {
    "type": "String",
  },
  "password": {
    "type": "String",
  },
},
);	
const Writer = model('User', userSchema);
module.exports = Writer;
