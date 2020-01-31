const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/noderest').then(() => {
    console.log("Connected to mongo db")
}).catch(e => {
    console.log("Erro: ", e)
});
mongoose.Promise = global.Promise;

module.exports = mongoose;