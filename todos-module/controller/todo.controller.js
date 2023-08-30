import todoService from "../service/todoService.js";

class TodoController{
    constructor() {
    }

    async getTodos(req,res,next){
        try {
            const userId=req.user.id;
            const todos=await todoService.getTodos(userId)
            return res.status(200).json(todos)
        }catch (e) {
            next(e)
        }
    }

    async addTodo(req,res,next){
        try {
            const userId=req.user.id;
            const todoBody=req.body.todo;
            const todo=await todoService.addTodo(userId,todoBody);
            return res.status(200).json(todo)
        }catch (e){
            next(e)
        }
    }

    async updateTodo(req,res,next){
            try {
                const todo=await todoService.updateTodo(req.body.todo)

                return res.status(200).json(todo)
            }catch (e) {
                next(e)
            }
    }

    async deleteTodo(req,res,next){
        try {
            const id=await todoService.deleteTodo(req.user.id,req.body.todo.id)
            return  res.status(200).json({id})
        }catch (e) {
            next(e)
        }
    }
}


export default new TodoController()