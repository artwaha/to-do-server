const { ObjectId } = require('bson')
const express = require('express')
const Collaborator = require('../model/Collaborator')
const TodoList = require('../model/TodoList')
const router = express.Router()


router.post('/', async function (req, res) {
    try {
        const collaborator = new Collaborator(req.body)
        const savedcollaborator = await collaborator.save()
        res.status(200).json(savedcollaborator)
    } catch (error) {
        res.status(500).json({ err: "Unable to Collaborator" })
    }
})

router.get('/', async function (req, res) {
    try {
        const collaborators = await Collaborator.find()
            .populate({
                path: 'todoListId',
                populate: {
                    path: 'tasks',
                    model: 'Task'
                }
            })
            .populate('userId')
            .exec();

        res.status(200).json(collaborators)
    } catch (error) {
        res.status(500).json("Unable to Process your request")
    }
})

router.get('/:id', async function (req, res) {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const collaborator = await Collaborator.findById(req.params.id)
                .populate({
                    path: 'todoListId',
                    populate: {
                        path: 'tasks',
                        model: 'Task'
                    }
                })
                .populate('userId')
                .exec()

            if (!collaborator) {
                return res.status(404).json({ message: 'Collaborator not found' });
            }

            // Populate the collaborators field of the TodoList schema
            const todoList = await TodoList.findById(collaborator.todoListId._id)
                .populate('owner')
                .populate({
                    path: 'tasks',
                    model: 'Task'
                })
                .populate({
                    path: 'collaborators',
                    model: 'Collaborator',
                    populate: {
                        path: 'userId',
                        model: 'User'
                    }
                })
                .exec();

            collaborator.todoListId = todoList;

            res.status(200).json(collaborator)
        } else {
            res.status(500).json({ err: "Invalid Id" })
        }

    } catch (error) {
        res.status(500).json("Unable to Process your request")
        // res.json(req.params.id)
    }
})

module.exports = router