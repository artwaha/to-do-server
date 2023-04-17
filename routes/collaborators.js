const { ObjectId } = require("bson");
const express = require("express");
const Collaborator = require("../model/Collaborator");
const router = express.Router();

router.post("/new-collaborator", async function (req, res) {
  try {
    const newCollaborator = new Collaborator(req.body);
    const savedcollaborator = await newCollaborator.save();

    res.status(200).json(savedcollaborator);
  } catch (error) {
    res.status(500).json({ message: `Server Error - ${error.message}` });
  }
});

router.get("/", async function (req, res) {
  try {
    const collaborators = await Collaborator.find()
      .populate("taskId")
      .populate("userId")
      .exec();

    if (!collaborators) {
      return res.status(404).json({ message: "Unable to get Collaborators" });
    }

    res.status(200).json(collaborators);
  } catch (error) {
    res.status(500).json("Server Error");
  }
});

module.exports = router;
