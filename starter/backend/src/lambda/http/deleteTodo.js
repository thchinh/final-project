import { deleteTodo, getTodoById } from "../../businessLogic/todo.mjs";
import { createLogger } from "../../utils/logger.mjs";
import { getUserId } from "../utils.mjs";

const logger = createLogger("deleteTodo");

export async function handler(event) {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  // Check to do item have in database or no
  logger.info("Starting check item in database");
  const findItems = await getTodoById(userId, todoId);
  logger.info("Item has existed");
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

