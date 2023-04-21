const { ObjectId } = require("bson");
const express = require("express");
const Collaborator = require("../model/Collaborator");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../model/User");

// Add Collaborator
router.post("/new-collaborator", async function (req, res) {
  try {
    const newCollaborator = new Collaborator(req.body);
    const savedcollaborator = await newCollaborator.save();

    const usr = await User.findById(savedcollaborator.userId, "email name");

    // console.log("Email: ", usr.email);

    // let testAccount = await nodemailer.createTestAccount();

    // let transporter = nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: testAccount.user,
    //     pass: testAccount.pass,
    //   },
    // });

    // const mailOptions = {
    //   // from: '"Abdul-razak Twaha" <zaaktwaha@gmail.com>',
    //   from: '"Fred Foo 👻" <foo@example.com>',
    //   // to: usr.email,
    //   to: "abdul-razak.twaha@outlook.com, zaaktwaha@gmail.com",
    //   subject: "You've been invited to collaborate on a task!",
    //   text: "Please log in to the system to accept or reject the invitation",
    // };

    // let info = await transporter.sendMail(mailOptions);

    // console.log(info);

    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(200).json({
      message: `Invitation email has been sent to ${usr.name}(${usr.email})`,
    });
  } catch (error) {
    res.status(500).json({ message: `Server Error - ${error.message}` });
  }
});

// Get All collaborators
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

// Get all Tasks to which user is collaborating
router.post("/collaborating-tasks", async function (req, res) {
  try {
    const { userId } = req.body;

    if (ObjectId.isValid(userId)) {
      const collaboratingTasks = await Collaborator.find(
        {
          userId: userId,
          invitationStatus: "accepted",
        },
        "taskId -_id"
      )
        .populate("taskId")
        .exec();

      res.status(200).json(collaboratingTasks);
    } else {
      res.status(400).json({ message: "Invalid User Id" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get All tasks to which user is invited
router.post("/invitations", async (req, res) => {
  try {
    const { userId } = req.body;
    if (ObjectId.isValid(userId)) {
      const invitations = await Collaborator.find(
        {
          userId: userId,
          invitationStatus: { $ne: "accepted" },
        },
        "-_id"
      )
        .populate({
          path: "taskId",
          populate: {
            path: "owner",
          },
        })
        .exec();

      res.json(invitations);
    } else {
      res.status(400).json({ message: "Invalid User Id" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server Error - ${error}` });
  }
});

// Update Invitation
router.patch("/invitation", async (req, res) => {
  try {
    const update = req.body;

    const updatedInvite = await Collaborator.findOneAndUpdate(
      {
        userId: update.userId,
        taskId: update.taskId,
      },
      { $set: { invitationStatus: update.invitationStatus } }
    );

    res.status(200).json(updatedInvite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server Error - ${error}` });
  }
});

module.exports = router;
