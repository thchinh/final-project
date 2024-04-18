import { deleteTodo, getTodoById } from "../../businessLogic/todo.mjs";
import { getUserId } from "../utils.mjs";

export async function handler(event) {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  // Check to do item have in database or no
  const findItems = await getTodoById(userId, todoId);
  if (findItems?.Count == 0) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json'
      },
      body: `Can't find todo item with todoId: ${todoId}`
    }
  };

  await deleteTodo(userId, todoId);
  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      isSuccessDelete: true,
    }),
  };
}

