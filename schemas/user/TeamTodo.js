import { Todo } from "./Todo";
import { Schema,model } from "mongoose";

const teamTodo=new Schema({
    ...Todo.obj,
    users:[{ type: Schema.Types.ObjectId,
        ref: "User"}],
        admins:[{type: Schema.Types.ObjectId,
            ref: "User"}]
})

