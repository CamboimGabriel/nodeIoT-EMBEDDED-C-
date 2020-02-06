const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://myUserAdmin:Guitarra7762@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false"
  )
  .then(() => {
    console.log("Connected to mongo db");
  })
  .catch(e => {
    console.log("Erro: ", e);
  });
mongoose.Promise = global.Promise;

module.exports = mongoose;
