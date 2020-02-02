const mongoose = require("../database");

const AlarmeSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
    index: true
  },

  name: {
    type: String,
    require: true
  },

  repetir: {
    type: Boolean,
    require: true
  },

  estado: {
    type: Boolean
  },

  horario: {
    hora: {
      type: Number,
      require: true
    },

    minuto: {
      type: Number,
      require: true
    }
  },

  dias: {
    dom: { type: Boolean, require: true },
    seg: { type: Boolean, require: true },
    ter: { type: Boolean, require: true },
    qua: { type: Boolean, require: true },
    qui: { type: Boolean, require: true },
    sex: { type: Boolean, require: true },
    sab: { type: Boolean, require: true }
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

const Alarme = mongoose.model("Alarme", AlarmeSchema);

module.exports = Alarme;
