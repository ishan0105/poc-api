import { Request } from "express";

// import { sequelize } from "./db-connection/db-connect";
import Task from "../models/task";
import User from "../models/user";
// import Task from "./models/task";

interface ApiResponse {
  statusCode: number;
  body: any;
}

export const getAllUsers = async (): Promise<ApiResponse> => {
  try {
    const result = await User.findAll();

    if (!result || result.length === 0) {
      return {
        statusCode: 404,
        body: { error: "No users found" },
      };
    }

    const formattedUsers = result.map((user) => ({
      username: user.username,
      password: user.password,
    }));

    return {
      statusCode: 200,
      body: formattedUsers,
    };
  } catch (err: any) {
    console.error("Error fetching users:", err);
    return {
      statusCode: 500,
      body: { error: err.message },
    };
  }
};

export const getTaskByUsername = async (req: Request): Promise<ApiResponse> => {
  console.log(req.body);
  const { username } = req.body;
  try {
    if (!username) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "username is required.",
        }),
      };
    }

    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `User with username: ${username} not found`,
        }),
      };
    }

    const result = await Task.findAll({ where: { user_id: user.id } });

    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Task not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Task fetched successfully!",
        task: result,
      }),
    };
  } catch (err: any) {
    console.log("Error getting task", err.message);
    return {
      statusCode: 501,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

export const getAllTasks = async (): Promise<ApiResponse> => {
  try {
    const result = await Task.findAll();

    if (!result || result.length === 0) {
      return {
        statusCode: 404,
        body: { error: "No users found" },
      };
    }

    const formattedUsers = result.map((task) => ({
      name: task.task_name,
      priority: task.task_priority,
      istaskcompleted: task.istaskcompleted,
    }));

    return {
      statusCode: 200,
      body: formattedUsers,
    };
  } catch (err: any) {
    console.error("Error fetching users:", err);
    return {
      statusCode: 500,
      body: { error: err.message },
    };
  }
};

export const addUser = async (req: Request): Promise<ApiResponse> => {
  console.log("addUser called");
  console.log(req.body);
  const { username, password } = req.body;
  console.log("Username: " + username);
  console.log("Password: " + password);
  try {
    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Both username and password are required.",
        }),
      };
    }

    const newUser = await User.create(
      { username, password },
      { fields: ["username", "password"] }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User created successfully!",
        user: newUser,
      }),
    };
  } catch (err: any) {
    console.error("Error creating user:", err.message);
    return {
      statusCode: 501,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

export const addTask = async (req: Request): Promise<ApiResponse> => {
  const { username, task_name, task_priority } = req.body;
  console.log("Username: " + username);
  try {
    if (!username || !task_name || !task_priority) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "user name, task name and task priority are required.",
        }),
      };
    }

    const user = await User.findOne({ where: { username: username } });
    let user_id = 0;
    if (user != null) {
      user_id = user.id;
    }
    console.log("User ID: " + user_id);
    const newTask = await Task.create(
      { user_id, task_name, task_priority, istaskcompleted: false },
      { fields: ["user_id", "task_name", "task_priority", "istaskcompleted"] }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Task created successfully!",
        user: newTask,
      }),
    };
  } catch (err: any) {
    console.error("Error creating task:", err.message);
    return {
      statusCode: 501,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

export const getTaskById = async (req: Request): Promise<ApiResponse> => {
  const { id } = req.body;
  try {
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "task id is required.",
        }),
      };
    }

    const result = await Task.findOne({ where: { id: id } });

    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Task not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Task fetched successfully!",
        task: result,
      }),
    };
  } catch (err: any) {
    console.log("Error getting task", err.message);
    return {
      statusCode: 501,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

export const getUserById = async (req: Request): Promise<ApiResponse> => {
  const { id } = req.body;
  try {
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "user id is required.",
        }),
      };
    }

    const result = await User.findOne({ where: { id: id } });

    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User fetched successfully!",
        user: result,
      }),
    };
  } catch (err: any) {
    console.log("Error getting user", err.message);
    return {
      statusCode: 501,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

export const updateTask = async (req: Request): Promise<ApiResponse> => {
  try {
    const { id } = req.params;
    const { task_name, task_priority, istaskcompleted } = req.body;

    console.log("Body: ", task_name, task_priority, istaskcompleted);

    if (istaskcompleted == null && !task_name && !task_priority) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "At least one field (task name, task priority, or isTaskCompleted) must be provided.",
        }),
      };
    }

    const task = await Task.findByPk(id);

    if (!task) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Task not found." }),
      };
    }

    const updatedTask = await task.update({
      task_name: task_name,
      task_priority: task_priority,
      istaskcompleted: istaskcompleted,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Task updated successfully.",
        task: updatedTask,
      }),
    };
  } catch (error: any) {
    console.error("Error updating task:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};

export const updateUser = async (req: Request): Promise<ApiResponse> => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    if (!username && !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "At least one field (username or password) must be provided.",
        }),
      };
    }

    const user = await User.findByPk(id);

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found." }),
      };
    }

    const updatedUser = await user.update({
      username: username,
      password: password,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User updated successfully.",
        task: updatedUser,
      }),
    };
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};

export const deleteTask = async (req: Request): Promise<ApiResponse> => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);

    if (!task) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Task not found." }),
      };
    }

    await task.destroy();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Task deleted successfully",
      }),
    };
  } catch (error: any) {
    console.error("Error deleting task:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};

export const deleteUser = async (req: Request): Promise<ApiResponse> => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found." }),
      };
    }

    await user.destroy();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User deleted successfully",
      }),
    };
  } catch (error: any) {
    console.error("Error deleting user:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};
