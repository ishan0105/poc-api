/* eslint-disable */
import express, { Request, Response} from "express";
import { addTask, addUser, deleteTask, deleteUser, getAllTasks, getAllUsers, getTaskById, getTaskByUsername, getUserById, updateTask, updateUser } from "../repository/poc-repo";

const router: express.Router = express.Router();

router.get("/details", (req: Request, res: Response) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Documentation</title>
      <link rel="stylesheet" type="text/css" href="/swagger/swagger-ui/swagger-ui.css" />
    </head>
    <body>
      Hello from serverless
    </body>
    </html>`;
  // console.log('This is Html File:', html);
  res.send(html);
});

router.get("/get-all-users", async (req: Request, res: Response) => {
  return await getAllUsers(req, res);
});

router.post(
  "/get-tasks-by-username",
  async (req: Request, res: Response) => {
    return await getTaskByUsername(req, res);
  }
);

router.get(
  "/get-all-tasks",
  async (req: Request, res: Response) => {
    return await getAllTasks(res);
  }
);

router.post("/add-user", async (req: Request, res: Response) => {
  return await addUser(req, res);
});

router.post("/add-task", async (req: Request, res: Response) => {
  return await addTask(req, res);
});

router.post(
  "/get-single-task",
  async (req: Request, res: Response) => {
    return await getTaskById(req, res);
  }
);

router.post(
  "/get-single-user",
  async (req: Request, res: Response) => {
    return await getUserById(req, res);
  }
);

router.put(
  "/update-task/:id",
  async (req: Request, res: Response) => {
    return await updateTask(req, res);
  }
);

router.put(
  "/update-user/:id",
  async (req: Request, res: Response) => {
    return await updateUser(req, res);
  }
);

router.delete(
  "/delete-task/:id",
  async (req: Request, res: Response) => {
    return await deleteTask(req, res);
  }
);

router.delete(
  "/delete-user/:id",
  async (req: Request, res: Response) => {
    return await deleteUser(req, res);
  }
);

export = router;
