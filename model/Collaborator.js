const { default: mongoose } = require("mongoose");

const collaboratorSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  invitationStatus: {
    type: String,
    enum: ["accepted", "rejected", "pending"],
    default: "pending",
    validate: {
      validator: function (v) {
        return ["accepted", "rejected", "pending"].includes(v);
      },
    },
  },
});

module.exports = mongoose.model("Collaborator", collaboratorSchema);
