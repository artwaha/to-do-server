const { default: mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        requred: true
    },
    description: String,
    isCompleted: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborators: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

module.exports = mongoose.model('Task', taskSchema)
