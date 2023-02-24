const { ObjectId } = require('bson')
const express = require('express')
const Task = require('../model/Task')
const router = express.Router()


// URL: http://localhost:3001/tasks

// Get All tasks
router.get('/', async function name(req, res) {
    try {
        const tasks = await Task.find()
            .exec()
        // .count()
        res.status(200).json(tasks)
    } catch (error) {
        console.error(error)
        res.status(500).json({ err: 'Unable to add task' })
    }
})

// Add new Task
router.post('/new-task', async function name(req, res) {
    try {
        const task = new Task(req.body.newTask)
        const savedTask = await task.save()

        const tasks = await Task.find({ owner: req.body.userId }).
            populate('owner', '-password').
            populate('collaborators', '-password')
            .exec()
        // .count()

        res.status(200).json(tasks)
    } catch (error) {
        console.error(error)
        res.status(500).json({ err: 'Unable to add task' })
    }
})

// Get tasks for a given user - POST method
router.post('/', async function (req, res) {
    if (ObjectId.isValid(req.body.userId)) {
        try {
            const tasks = await Task.find({ owner: req.body.userId })
                .populate('collaborators', '-password')
                .populate('owner', '-password')
                .exec()
            // .count()

            if (!tasks) {
                return res.status(404).json("No Tasks found")
            }

            res.status(200).json(tasks)
            // res.status(200).json(req.body.userId)
        } catch (error) {
            console.error(error)
            res.status(500).json({ err: 'Unable to retrieve task' })
        }
    } else {
        res.status(500).json({ error: "Invalid Id" })
    }

})



// Count All, done, and todo tasks count
router.post('/count-tasks', async function (req, res) {
    try {
        const tasks = await Task.find({ owner: req.body.userId }).count().exec()
        const done = await Task.find({ isCompleted: true, owner: req.body.userId }).count().exec()
        const todo = await Task.find({ isCompleted: false, owner: req.body.userId }).count().exec()

        res.status(200).json({ tasks, done, todo })
    } catch (error) {
        console.error(error)
        res.status(500).json({ err: 'Unable to get task' })
    }

})

// Get All done  tasks for user
router.post('/done-tasks', async function (req, res) {
    try {
        const done = await Task.find({ isCompleted: true, owner: req.body.userId })
            .populate('collaborators', '-password')
            .populate('owner', '-password')
            .exec()

        res.status(200).json(done)
    } catch (error) {
        console.error(error)
        res.status(500).json({ err: 'Unable to get task' })
    }

})

// Get All, todo  tasks for user
router.post('/todo-tasks', async function (req, res) {
    try {

        const todo = await Task.find({ isCompleted: false, owner: req.body.userId })
            .populate('collaborators', '-password')
            .populate('owner', '-password')
            .exec()

        res.status(200).json(todo)
    } catch (error) {
        console.error(error)
        res.status(500).json({ err: 'Unable to get task' })
    }

})

// Delete all but the firts 5 Tasks
router.delete('/', async (req, res) => {
    try {
        const numTasksToKeep = 5;
        const tasksToDelete = await Task.find()
            .sort({ _id: 1 })
            .skip(numTasksToKeep)
            .exec()

        const idsToDelete = tasksToDelete.map(task => task._id);
        await Task.deleteMany({ _id: { $in: idsToDelete } });
        res.status(200).send(`Deleted all but the first ${numTasksToKeep} tasks.`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router