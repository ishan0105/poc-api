import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db-connection/db-connect";
import User from "./user";

interface TaskAttributes {
  id: number;
  user_id: number;
  task_name: string;
  task_priority: string;
  istaskcompleted: boolean;
}

type TaskCreationAttributes = Optional<TaskAttributes, "id">;

class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  public id!: number;
  public user_id!: number;
  public task_name!: string;
  public task_priority!: string;
  public istaskcompleted!: boolean;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    task_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    task_priority: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    istaskcompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "tasks",
    timestamps: false,
  }
);

export default Task;