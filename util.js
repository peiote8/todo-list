const mongoose = require("mongoose");
const config = require('./config.json');


module.exports = {
  connectToMongo,
  getMongoose
};


function getMongoose() {
  return mongoose;
}

function connectToMongo() {
  return mongoose.connect(config.MONGO_CONNECTION, { useNewUrlParser: true , useUnifiedTopology: true});
}


