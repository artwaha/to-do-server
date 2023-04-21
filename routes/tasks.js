const { ObjectId } = require("bson");
const express = require("express");
const Collaborator = require("../model/Collaborator");
const Task = require("../model/Task");
const User = require("../model/User");
const router = express.Router();

// Get All tasks
router.get("/", async function name(req, res) {
  try {
    const tasks = await Task.find().populate("owner").exec();

    if (!tasks.length) {
      return res.status(404).json({ message: "No Tasks Found", tasks });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get task details
router.get("/:taskId", async function (req, res) {
  try {
    const taskId = req.params.taskId;

    if (ObjectId.isValid(taskId)) {
      const task = await Task.findOne({
        _id: taskId,
      })
        .populate("owner", "name")
        .exec();

      const collaborators = await Collaborator.find({
        taskId: taskId,
        userId: { $ne: task.owner._id },
        invitationStatus: { $ne: "rejected" },
      })
        .populate("userId", "-password")
        .exec();

      const taskWithCollaborators = {
        ...task.toJSON(),
        collaborators,
      };

      const collaboratorIds = collaborators.map((col) => col.userId._id);

      const usersToInvite = await User.find({
        _id: { $nin: [task.owner, ...collaboratorIds] },
      });

      res.status(200).json({ ...taskWithCollaborators, usersToInvite });
      // res.status(200).json(task);
    } else {
      res.status(400).json({ message: "Invalid Task Id" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update Task
router.patch("/:taskId", async function (req, res) {
  try {
    const update = req.body;
    const taskId = req.params.taskId;

    if (ObjectId.isValid(taskId)) {
      if (update.collaborators && Array.isArray(update.collaborators)) {
        await Collaborator.updateMany(
          {
            userId: { $in: update.collaborators },
            taskId,
          },
          { $set: { invitationStatus: "rejected" } }
        ).exec();

        delete update.collaborators;
      }

      const response = await Task.findByIdAndUpdate(taskId, {
        $set: update,
      });

      res.status(200).json(response);
    } else {
      res.status(400).json({ message: "Invalid Task Id" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: "Server Error" });
  }
});

// Delete Task
router.delete("/:taskId", async function (req, res) {
  try {
    const taskId = req.params.taskId;
    if (ObjectId.isValid(taskId)) {
      const deletedTask = await Task.findByIdAndDelete(taskId);

      if (!deletedTask) {
        return res
          .status(404)
          .json({ message: `Task with id ${taskId} not found` });
      }

      return res
        .status(200)
        .json({ message: "Task deleted successfully", data: deletedTask });
    } else {
      res.status(400).json({ message: "Invalid Task Id" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Add new Task
router.post("/new-task", async function name(req, res) {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    // if (!savedTask) {
    //   return res.status(404).json({ message: "Unable to Add task" });
    // }

    res.status(200).json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get tasks for a given user - POST method
router.post("/", async function (req, res) {
  try {
    const userId = req.body.userId;

    if (ObjectId.isValid(userId)) {
      const tasks = await Task.find({ owner: userId })
        .select("title isCompleted")
        .exec();

      res.status(200).json(tasks);
    } else {
      res.status(400).json({ message: "Invalid User Id" });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: `Server Error - ${error.message}` });
  }
});

// Count All, done, and todo tasks count
router.post("/count-tasks", async function (req, res) {
  try {
    const { userId } = req.body;

    if (ObjectId.isValid(userId)) {
      const tasks = await Task.find({ owner: userId }).count().exec();
      const done = await Task.find({ isCompleted: true, owner: userId })
        .count()
        .exec();
      const todo = await Task.find({ isCompleted: false, owner: userId })
        .count()
        .exec();

      // NOTE: Okay with warning
      // if (!tasks || !done || !todo) {
      //   return res
      //     .status(200)
      //     .json({ message: "No tasks found", tasks, done, todo });
      // }

      res.status(200).json({ tasks, done, todo });
    } else {
      res.status(400).json({ message: "Invalid User Id" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get All done  tasks for user
router.post("/done-tasks", async function (req, res) {
  try {
    const { userId } = req.body;

    if (ObjectId.isValid(userId)) {
      const done = await Task.find({ isCompleted: true, owner: userId })
        .populate("owner", "-password")
        .exec();

      // if (!done.length) {
      //   res.status(200).json({ message: "No tasks found", done });
      // }

      res.status(200).json(done);
    } else {
      res.status(400).json({ message: "Invalid User Id" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get All, todo tasks for user
router.post("/todo-tasks", async function (req, res) {
  try {
    const { userId } = req.body;

    if (ObjectId.isValid(userId)) {
      const todo = await Task.find({
        isCompleted: false,
        owner: req.body.userId,
      })
        .populate("owner", "-password")
        .exec();

      // console.log(todo);

      //   if (!todo.length) {
      //     return res.status(404).json({ message: "Unable to get Todo tasks" });
      //   }

      res.status(200).json(todo);
    } else {
      res.status(400).json({ message: "Invalid User Id" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: "Unable to get task" });
  }
});

module.exports = router;
