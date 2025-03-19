import { Request, Response, NextFunction } from 'express'
import { ServiceError } from '../shared/error'

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  let status, message
  message = err.name != err?.message ? err.message : undefined
  switch (err.name) {
    // Generic errors
    case ServiceError.INVALID_UUID.name:
      status = 400
      message = message || 'Invalid UUID'
      break
    case ServiceError.BAD_REQUEST.name:
      status = 400
      message = message || 'Bad request'
      break
    case ServiceError.NOT_FOUND.name:
      status = 404
      message = message || 'Data not found'
      break
    case ServiceError.INVALID_INTEGER.name:
      status = 400
      message = message || 'Invalid integer'
      break
    case ServiceError.NON_POSITIVE_INTEGER.name:
      status = 400
      message = message || 'Non-positive integer'
      break
    case ServiceError.DATABASE_CONNECTION_FAILED.name:
      status = 500
      message = message || 'Database connection failed'
      break

    // Business errors
    case ServiceError.QUANTITY_NOT_POSITIVE.name:
      status = 400
      message = message || 'Quantity must be positive'
      break
    case ServiceError.INVALID_ORDER_ID.name:
      status = 400
      message = message || 'Invalid order id'
      break
    case ServiceError.INVALID_ORDER_ITEM_ID.name:
      status = 400
      message = message || 'Invalid order item id'
      break
    case ServiceError.INVALID_MENU_ITEM_ID.name:
      status = 400
      message = message || 'Invalid menu item id'
      break
    case ServiceError.INVALID_MENU_ID.name:
      status = 400
      message = message || 'Invalid menu id'
      break
    case ServiceError.ORDER_NOT_FOUND.name:
      status = 404
      message = message || 'Order not found'
      break
    case ServiceError.ORDER_ITEM_NOT_FOUND.name:
      status = 404
      message = message || 'Order item not found'
      break
    case ServiceError.MENU_ITEM_NOT_FOUND.name:
      status = 404
      message = message || 'Menu item not found'
      break
    case ServiceError.MENU_NOT_FOUND.name:
      status = 404
      message = message || 'Menu not found'
      break
    default:
      status = 500
      message = 'Internal server error'
  }
  res.status(status).json({ name: err.name, message })
}
