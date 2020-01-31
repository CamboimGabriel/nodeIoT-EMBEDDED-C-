const mongoose = require("../database");

const CenaSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },

  name: {
    type: String,
    requise: true
  },

  cena: [
    {
      deviceID: {
        type: String,
        require: true
      },

      estado_desejado: {
        type: String,
        require: true
      }
    }
  ]
});

const Cenas = mongoose.model("Cenas", CenaSchema);

module.exports = Cenas;
