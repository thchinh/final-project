import * as uuid from 'uuid'
import { TodoAccess } from "../dataLayer/todoAccess.mjs";
import { AttachmentFile } from '../fileStorage/attachmentUtils.mjs';

const todoAccess = new TodoAccess();
const attachmentFile = new AttachmentFile();
const bucketName = process.env.IMAGES_TODO_S3_BUCKET

export async function generateUploadUrl(todoId) {
    return await attachmentFile.generateUploadUrl(todoId)
}

export async function getTodos(userId) {
    return await todoAccess.getTodos(userId);
}

export async function getTodoById(userId, todoId) {
    return await todoAccess.getTodo(userId, todoId);
}

export async function deleteTodo(userId, todoId) {
    return await todoAccess.deleteTodo(userId, todoId);
}

export async function createTodo(body, userId) {
    const id = uuid.v4();
    const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${id}`;
    const todo = {
        id: id,
        userId: userId,
        attachmentUrl,
        dueDate: body.dueDate,
        createdAt: new Date().toUTCString(),
        name: body.name,
        done: false
    };
    await todoAccess.createTodo(todo);
    return todo;
}

export async function updateTodo(body, todoId) {
    const todoUpdate = {
        ...body,
        todoId
    }
    return todoAccess.updateTodo(todoUpdate);
}