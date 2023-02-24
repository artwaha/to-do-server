const { default: mongoose } = require("mongoose");
const Task = require("./Task");
const User = require("./User");

const todoListSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('TodoList', todoListSchema)