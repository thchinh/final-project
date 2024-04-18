import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todoAccess')
export class TodoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE,
    indexName = process.env.INDEX_NAME
  ) {
    this.documentClient = documentClient
    this.todosTable = todosTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
    this.indexName = indexName
  }

  async getTodos(userId) {
    logger.info('Getting all todo items')
    const result = await this.documentClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': {
          S: userId
        }
      }
    })
    return result.Items.map((item) => this.convertItem(item))
  }

  async getTodo(userId, todoId) {
    logger.info(`Getting todo item: ${todoId}`)
    const result = await this.documentClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId and todoId = :todoId',
      ExpressionAttributeValues: {
        ':userId': {
          S: userId
        },
        ':todoId': {
          S: todoId
        }
      }
    })

    if (result.Count == 0) {
      logger.error(
        `Can not find todo item with userId: ${userId} and todoId: ${todoId}`
      )
      return null
    }
    const todoItem = result.Items[0]
    return this.convertItem(todoItem)
  }

  async createTodo(todo) {
    logger.info(`Creating a todo with userId ${todo.userId}`)

    await this.dynamoDbClient.put({
      TableName: this.todosTable,
      Item: todo
    })
    return todo
  }

  async deleteTodo(userId, todoId) {
    logger.info(`Deleting a todo`)
    logger.info(`todoId: ${todoId}, userId: ${userId}`);
    try {
      const params = {
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        }
      };

      const result = await this.dynamoDbClient.delete(params)
      logger.info('Item deleted successfully:', result)
      return result
    } catch (err) {
      logger.error('Error deleting item:', err)
      throw err
    }
  }

  async updateTodo(todo, userId) {
    const params = {
      TableName: this.todosTable,
      Key: {
        userId,
        todoId: todo.todoId
      },
      UpdateExpression: 'SET dueDate = :dueDate, #taskName = :taskName, done = :done ',
      ExpressionAttributeNames: { '#taskName': 'name' },
      ExpressionAttributeValues: {
        ':dueDate': todo.dueDate,
        ':taskName': todo.name,
        ':done': todo.done
      }
    }
    try {
      const data = await this.dynamoDbClient.update(params)
      logger.info('Item updated successfully:', data)
      return data
    } catch (err) {
      logger.error('Error updating item:', err)
      throw err
    }
  }

  convertItem(item) {
    return {
      todoId: item.todoId.S,
      name: item.name.S,
      userId: item.userId.S,
      attachmentUrl: item.attachmentUrl.S,
      dueDate: item.dueDate.S,
      done: item.done.BOOL
    }
  }

  revertItem(item) {
    return {
      todoId: {
        S: item.todoId
      },
      name: {
        S: item.name
      },
      userId: {
        S: item.userId
      },
      attachmentUrl: {
        S: item.attachmentUrl
      },
      dueDate: {
        S: item.dueDate
      },
      done: { BOOL: item.done }
    }
  }
}
