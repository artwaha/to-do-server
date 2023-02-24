const { ObjectId } = require('bson')
const express = require('express')
const TodoList = require('../model/TodoList')
const router = express.Router()

router.post('/', async function (req, res) {
    try {
        const todoList = new TodoList(req.body)
        const savedTodoList = await todoList.save()
        res.status(200).json(savedTodoList)
    } catch (error) {
        console.error(error)
        res.status(500).json({ err: "Unable to Add TodoList" })
    }
})

router.get('/:userId', async function (req, res) {

    if (ObjectId.isValid(req.params.userId)) {
        try {
            const todoLists = await TodoList.find({ owner: req.params.userId })
                .select('-owner')
                .populate({
                    path: 'tasks',
                    model: 'Task'
                })
                .exec()


            if (!todoLists) {
                return res.status(404).json({ err: "No Todo lists found" })
            }

            res.status(200).json(todoLists)
        } catch (error) {
            console.error(error)
            res.status(500).json({ err: "Unable to retrieve todo lists" })
        }
    } else {
        res.status(500).json({ err: "Invalid Doc Id" })
    }


})

module.exports = router