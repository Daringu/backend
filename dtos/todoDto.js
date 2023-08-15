class TodoDto{
    status;
    text;
    id;
    userId;
    constructor({_id,status,text,user_id}) {
        this.status=status;
        this.id=_id;
        this.text=text;
        this.userId=user_id;
    }
}

export default TodoDto