const { default: mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    requred: true,
  },
  description: {
    type: String,
    default: "",
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
});

module.exports = mongoose.model("Task", taskSchema);
