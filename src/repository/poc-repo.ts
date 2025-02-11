import { Request, Response } from "express";

// import { sequelize } from "./db-connection/db-connect";
import Task from "../models/task";
import User from "../models/user";
// import Task from "./models/task";

// interface ApiResponse {
//   statusCode: number;
//   body: any;
// }

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const result = await User.findAll();

    if (!result || result.length === 0) {
      return res
        .status(404)
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Credentials", "true")
        .json({ error: "No users found" });
    }

    const formattedUsers = result.map((user) => ({
      username: user.username,
      password: user.password,
    }));

    return res
      .status(200)
      .header("Access-Control-Allow-Origin", "*")
      .header("Access-Control-Allow-Credentials", "true")
      .json(formattedUsers);
  } catch (err: any) {
    console.error("Error fetching users:", err);

    return res
      .status(500)
      .header("Access-Control-Allow-Origin", "*")
      .header("Access-Control-Allow-Credentials", "true")
      .json({ error: err.message });
  }
};

export const getTaskByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username } = req.body;
  try {
    if (!username) {
      res.status(400).json({
        message: "username is required.",
      });
      return;
    }

    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      res.status(404).json({
        message: `User with username: ${username} not found`,
      });
      return;
    }

    const result = await Task.findAll({ where: { user_id: user.id } });

    if (!result) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const currentDate = new Date();
    const updatedTasks = result.map((task) => {
      const taskDeadline = new Date(task.task_deadline || currentDate); // Use current date if no deadline
      const remainingDays = Math.ceil(
        (taskDeadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      ); // Calculate difference in days
      return {
        ...task.toJSON(),
        remaining_days: remainingDays > 0 ? remainingDays : "Overdue",
      };
    });

    res.status(200).json({
      message: "Task fetched successfully!",
      task: updatedTasks,
    });
  } catch (err: any) {
    res.status(501).json({
      error: err.message,
    });
  }
};

export const getAllTasks = async (res: Response): Promise<void> => {
  try {
    const result = await Task.findAll();

    if (!result || result.length === 0) {
      res.status(404).json({ error: "No users found" });
      return;
    }

    const formattedUsers = result.map((task) => ({
      name: task.task_name,
      priority: task.task_priority,
      istaskcompleted: task.istaskcompleted,
    }));

    res.status(200).json(formattedUsers);
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      res.status(400).json({
        message: "Both username and password are required.",
      });
      return;
    }

    const newUser = await User.create(
      { username, password },
      { fields: ["username", "password"] }
    );

    res.status(200).json({
      message: "User created successfully!",
      user: newUser,
    });
  } catch (err: any) {
    res.status(501).json({
      error: err.message,
    });
  }
};

export const addTask = async (req: Request, res: Response): Promise<void> => {
  const { username, task_name, task_priority, task_deadline } = req.body;
  try {
    if (!username || !task_name || !task_priority) {
      res.status(400).json({
        message:
          "user name, task name, task priority and task deadline are required.",
      });
      return;
    }

    const user = await User.findOne({ where: { username: username } });
    let user_id = 0;
    if (user != null) {
      user_id = user.id;
    }
    const newTask = await Task.create(
      {
        user_id,
        task_name,
        task_priority,
        istaskcompleted: false,
        task_deadline: task_deadline,
      },
      {
        fields: [
          "user_id",
          "task_name",
          "task_priority",
          "istaskcompleted",
          "task_deadline",
        ],
      }
    );

    res.status(200).json({
      message: "Task created successfully!",
      user: newTask,
    });
  } catch (err: any) {
    res.status(501).json({
      error: err.message,
    });
  }
};

export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.body;
  try {
    if (!id) {
      res.status(400).json({ message: "task id is required." });
      return;
    }

    const result = await Task.findOne({ where: { id: id } });

    if (!result) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json({
      message: "Task fetched successfully!",
      task: result,
    });
  } catch (err: any) {
    console.log("Error getting task", err.message);
    res.status(501).json({ error: err.message });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.body;
  try {
    if (!id) {
      res.status(400).json({ message: "user id is required." });
      return;
    }

    const result = await User.findOne({ where: { id: id } });

    if (!result) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User fetched successfully!",
      user: result,
    });
  } catch (err: any) {
    console.log("Error getting user", err.message);
    res.status(501).json({ error: err.message });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { task_name, task_priority, istaskcompleted, task_deadline } = req.body;

    if (istaskcompleted == null && !task_name && !task_priority &&!task_deadline) {
      res.status(400).json({
        error:
          "At least one field (task name, task priority, isTaskCompleted or task deadline) must be provided.",
      });
      return;
    }

    if (
      task_priority &&
      task_priority != "high" &&
      task_priority != "medium" &&
      task_priority != "low"
    ) {
      res.status(400).json({
        error: "Task priority can be either high, medium or low",
      });
      return;
    }

    const task = await Task.findByPk(id);

    if (!task) {
      res.status(404).json({ error: "Task not found." });
      return;
    }

    const updatedTask = await task.update({
      task_name: task_name,
      task_priority: task_priority,
      istaskcompleted: istaskcompleted,
      task_deadline: task_deadline
    });

    res.status(200).json({
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (error: any) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    if (!username && !password) {
      res.status(400).json({
        error: "At least one field (username or password) must be provided.",
      });
      return;
    }

    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const updatedUser = await user.update({
      username: username,
      password: password,
    });

    res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);

    if (!task) {
      res.status(404).json({ error: "Task not found." });
      return;
    }

    await task.destroy();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    await user.destroy();

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};
