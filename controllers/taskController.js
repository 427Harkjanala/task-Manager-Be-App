const Task = require('../models/Task');

// ✅ Get all tasks
const getTasks = async (req, res) => {
  const { status, sort } = req.query;
  const query = { userId: req.user._id };

  // Filter tasks by status dynamically
  if (status) query.status = status;

  try {
    let tasks = Task.find(query);

    // Sorting by due date if requested
    if (sort === 'dueDate') tasks = tasks.sort({ dueDate: 1 });

    const results = await tasks;
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // If dueDate is not provided, set current date automatically
    const task = new Task({
      userId: req.user._id,
      title,
      description,
      dueDate: dueDate || new Date(), // ✅ Auto current date
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Update task (status or any field)
const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    // Find task by ID and userId, update dynamically
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete a task
// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID exists and belongs to the logged-in user
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully", id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
