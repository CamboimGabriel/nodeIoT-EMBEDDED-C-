const mongoose = require("../database");

const DeviceSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
    index: true
  },

  id: {
    type: String,
    require: true
  },

  type: {
    type: String,
    require: true
  },

  estado_atual: {
    type: mongoose.Schema.Types.Map,
    of: "string"
  },

  estado_desejado: {
    type: mongoose.Schema.Types.Map,
    of: "string"
  }
});

const Device = mongoose.model("Device", DeviceSchema);

module.exports = Device;
