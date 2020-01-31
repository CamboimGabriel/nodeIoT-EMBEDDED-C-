const express = require("express");
const authMiddleware = require("../middlewares/auth");
const User = require("../models/users");
const Device = require("../models/Devices");
const mqtt = require("mqtt");
const client = require("../index.js");
const Cenas = require("../models/Cenas");

const router = express.Router();

router.use(authMiddleware);

function diff(obj1, obj2) {
  const result = {};
  if (Object.is(obj1, obj2)) {
    return undefined;
  }
  if (!obj2 || typeof obj2 !== "object") {
    return obj2;
  }
  Object.keys(obj1 || {})
    .concat(Object.keys(obj2 || {}))
    .forEach(key => {
      if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
        result[key] = obj2[key];
      }
      if (typeof obj2[key] === "object" && typeof obj1[key] === "object") {
        const value = diff(obj1[key], obj2[key]);
        if (value !== undefined) {
          result[key] = value;
        }
      }
    });
  return result;
}

router.get("/:id/devices", async (req, res) => {
  try {
    const dev = await Device.find({ userID: req.params.id });

    res.send(dev);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "error" });
  }
});

router.get("/devices/:deviceID/shadow", async (req, res) => {
  try {
    const dev = await Device.findOne({ _id: req.params.deviceID });

    res.send({
      id: dev.id,
      _id: dev._id,
      estado_atual: dev.estado_atual,
      estado_desejado: dev.estado_desejado
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "error" });
  }
});

router.post("/devices/:deviceID/shadow", async (req, res) => {
  const { estado_desejado } = req.body;

  try {
    const shadow = await Device.findOne({
      _id: req.params.deviceID
    }).lean();

    if (await !shadow) return res.status(400).send({ error: "id not found" });

    shadow.estado_desejado = { ...shadow.estado_atual, ...req.body };
    Device.updateOne(
      { _id: shadow._id },
      {
        estado_desejado: { ...shadow.estado_atual, ...req.body }
      },
      function(err) {
        console.log(err);
      }
    );
    const dif = diff(shadow.estado_atual, shadow.estado_desejado);

    Object.size = function(obj) {
      var size = 0,
        key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    };

    // Get the size of an object
    const size = Object.size(dif);

    if (size > 0) {
      client.client.publish(
        shadow._id.toString() + "/delta",
        JSON.stringify(dif)
      );
    }

    if (
      size === 0 &&
      shadow.type === "tv" &&
      req.body.estado_desejado !== undefined &&
      req.body.estado_desejado.estado === undefined
    ) {
      client.client.publish(
        shadow._id.toString() + "/delta",
        JSON.stringify(req.body)
      );
    }

    client.client.subscribe("+/+/update");
    client.client.on("message", function(topic, message) {
      Device.updateOne(
        { _id: topic.split("/")[1] },
        {
          estado_atual: JSON.parse(message.toString())
        },
        function(err) {
          console.log(err);
        }
      );
    });

    res.send(shadow.estado_desejado);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "error" });
  }
});

router.post("/:id/scenes/create/:name", async (req, res) => {
  console.log(req.body);
  try {
    if (!(await User.findOne({ _id: req.params.id })))
      return res.status(400).send({ error: "id not found" });

    const cena = await Cenas.create({
      userID: req.params.id,
      name: req.params.name,
      cena: req.body
    });

    res.send(cena);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "error" });
  }
});

router.post("/scenes/:idCena/delete", async (req, res) => {
  try {
    if (!(await Cenas.findOne({ _id: req.params.idCena })))
      return res.status(400).send({ error: "id not found" });

    const test = await Cenas.deleteOne({ _id: req.params.idCena }, function(
      err
    ) {
      if (err) return handleError(err);
    });

    console.log(test);
    res.send("sucess deleted");
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "error" });
  }
});

router.get("/:id/scenes", async (req, res) => {
  try {
    if (!(await User.findOne({ _id: req.params.id })))
      return res.status(400).send({ error: "id not found" });

    const test = await Cenas.find({ userID: req.params.id });

    res.send(test);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "error" });
  }
});

module.exports = app => app.use("/users", router);
