const express = require("express");
const authMiddleware = require("../middlewares/auth");
const Device = require("../models/Devices");
const User = require("../models/users");

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
  const { userID, id, type, estado_atual, estado_desejado } = req.body;

  try {
    if (await !Device.findOne({ userID }))
      return res.status(400).send({ error: "User not found" });

    if (req.body.type === "lampada") {
      const device = await Device.create({
        estado_atual: {
          estado: "desligado"
        },
        estado_desejado: {
          estado: "desligado"
        },
        ...req.body
      });

      return res.send({
        device
      });
    }

    if (req.body.type === "ar condicionado") {
      const device = await Device.create({
        estado_atual: {
          estado: "desligado",
          temperatura: "19"
        },
        estado_desejado: {
          estado: "desligado",
          temperatura: "19"
        },
        ...req.body
      });

      return res.send({
        device
      });
    }

    if (req.body.type === "tv") {
      const device = await Device.create({
        estado_atual: {
          estado: "desligado",
          ultimoBotao: "nenhum"
        },
        estado_desejado: {
          estado: "desligado",
          ultimoBotao: "nenhum"
        },
        ...req.body
      });

      return res.send({
        device
      });
    }
    return res.send({
      device
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Device Registration failed" });
  }
});

module.exports = app => app.use("/devices", router);
