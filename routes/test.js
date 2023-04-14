router.post("/", async function (req, res) {
    try {
      const userId = req.body.userId;
  
      if (ObjectId.isValid(userId)) {
        const tasks = await Task.find({ owner: req.body.userId }).exec();
        // .populate("owner", "-password")
  
        tasks.forEach(async (task) => {
          const fetchedCollaborators = await Collaborator.find({
            taskId: task._id,
            userId: userId,
          }).exec();
  
          task = { ...task, collaborators: fetchedCollaborators };
        });
  
        console.log(tasks);
        // const collaborator = await Collaborator.findOne({tas})
  
        // if (!tasks.length) {
        //   return res.status(200).json([]);
        // }
  
        res.status(200).json(tasks);
      } else {
        res.status(400).json({ message: "Invalid User Id" });
      }
    } catch (error) {
      // console.error(error);
      res.status(500).json({ message: `Server Error - ${error.message}` });
    }
  });
  