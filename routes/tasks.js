const { ObjectId } = require("bson");
const express = require("express");
const Collaborator = require("../model/Collaborator");
const Task = require("../model/Task");
const router = express.Router();

// Get All tasks
router.get("/", async function name(req, res) {
  try {
    const tasks = await Task.find()
      .populate("collaborators")
      .populate("owner")
      .exec();

    if (!tasks.length) {
      return res.status(404).json({ message: "Unable to retrieve Tasks" });
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
      const task = await Task.findById(taskId)
        .populate("collaborators", "-password")
        .populate("owner", "-password")
        .exec();

      if (!task) {
        return res
          .status(404)
          .json({ message: "Unable to retrieve task details" });
      }

      res.status(200).json(task);
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
      // This is below code is  incase there's collaborator field.
      // The collaborator field would contain an array of collaborators to remove from the task
      // This code does that
      if (update.collaborators && Array.isArray(update.collaborators)) {
        const task = await Task.findById(taskId);
        update.collaborators = task.collaborators.filter(
          (c) => !update.collaborators.includes(c.toString())
        );
      }

      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { $set: update },
        { new: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ message: "Unable to update Task" });
      }

      res.status(200).json(updatedTask);
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
    const newTask = req.body;

    const task = new Task(newTask);
    const savedTask = await task.save();

    if (!savedTask) {
      return res.status(404).json({ message: "Unable to Add task" });
    }

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
      const tasks = await Task.find({ owner: req.body.userId })
        .populate("collaborators", "-password")
        .populate("owner", "-password")
        .exec();

      // if (!tasks.length) {
      //   return res.status(404).json("No Tasks found");
      // }

      res.status(200).json(tasks);
    } else {
      res.status(400).json({ message: "Invalid User Id" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
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

      //   console.log("Tasks -", !tasks);
      //   console.log("Done -", !done);
      //   console.log("Todo -", !todo);
      // NOTE: This will bring error incase zero is returned

      //   if (!tasks || !done || !todo) {
      //     return res.status(404).json({ message: "Unable to get Tasks counts" });
      //   }

      res.status(200).json({ tasks: tasks, done: done, todo: todo });
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
        .populate("collaborators", "-password")
        .populate("owner", "-password")
        .exec();

      // if (!done.length) {
      //   res.status(404).json({ message: "Unable to get Done Tasks" });
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

// Get All, todo  tasks for user
router.post("/todo-tasks", async function (req, res) {
  try {
    const { userId } = req.body;

    if (ObjectId.isValid(userId)) {
      const todo = await Task.find({
        isCompleted: false,
        owner: req.body.userId,
      })
        .populate("collaborators", "-password")
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
