import { generateUploadUrl } from "../../businessLogic/todo.mjs";
import { createLogger } from "../../utils/logger.mjs";

const logger = createLogger("generateUploadUrl");
export async function handler(event) {
  logger.info('Processing GenerateUploadUrl event...');
  const todoId = event.pathParameters.todoId;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  };

  try {
    const signedUrl = await generateUploadUrl(todoId);
    logger.info('Successfully created signed url.');
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ uploadUrl: signedUrl })
    };
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error })
    };
  }
}

