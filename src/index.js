const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mqtt = require("mqtt");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("./controllers/authController")(app);
require("./controllers/deviceController")(app);
require("./controllers/userController")(app);

exports.client = mqtt.connect({ host: "18.231.176.98", port: 1883 });

app.listen(3000, "0.0.0.0", () => {
  console.log("Node listening on port 3000");
});
