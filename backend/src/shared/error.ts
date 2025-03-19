const namedError = (name: string) => {
  const error = new Error(name)
  error.name = name
  return error
}

export const ServiceError = {
  // generic errors
  INVALID_UUID: namedError('InvalidUUID'),
  BAD_REQUEST: namedError('BadRequest'),
  NOT_FOUND: namedError('NotFound'),
  INVALID_INTEGER: namedError('InvalidInteger'),
  NON_POSITIVE_INTEGER: namedError('NonPositiveInteger'),
  INTERNAL_SERVER_ERROR: namedError('InternalServerError'),
  DATABASE_CONNECTION_FAILED: namedError('DatabaseConnectionFailed'),

  // business errors
  QUANTITY_NOT_POSITIVE: namedError('QuantityNotPositive'),
  INVALID_ORDER_ID: namedError('InvalidOrderId'),
  INVALID_ORDER_ITEM_ID: namedError('InvalidOrderItemId'),
  INVALID_MENU_ITEM_ID: namedError('InvalidMenuItemId'),
  INVALID_MENU_ID: namedError('InvalidMenuId'),
  ORDER_NOT_FOUND: namedError('OrderNotFound'),
  ORDER_ITEM_NOT_FOUND: namedError('OrderItemNotFound'),
  MENU_ITEM_NOT_FOUND: namedError('MenuItemNotFound'),
  MENU_NOT_FOUND: namedError('MenuNotFound'),
}
