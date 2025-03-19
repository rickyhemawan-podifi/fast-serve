import { ObjectId } from 'mongodb'
import e, { Request, Response, NextFunction } from 'express'
import Model from '../models'
import { ServiceError } from '../shared/error'
import { DTO, Schema } from '../shared/types'

export default class {
  static addToOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { menuItemId, quantity } = req.body
      if (!ObjectId.isValid(menuItemId)) throw ServiceError.INVALID_MENU_ITEM_ID
      if (!Number.isInteger(quantity) || quantity <= 0)
        throw ServiceError.QUANTITY_NOT_POSITIVE

      const menuItem = await Model.MenuItem.findById(menuItemId)
      if (!menuItem) throw ServiceError.MENU_ITEM_NOT_FOUND

      const orderItem = new Model.OrderItem({
        menuItemId,
        quantity,
      })
      await orderItem.save()

      const order = new Model.Order({
        orderItems: [orderItem._id],
      })
      await order.save()

      const orderDTO = await this._getOrder(order._id.toString())

      res.status(200).send(orderDTO)
    } catch (err) {
      next(err)
    }
  }

  static _getOrder = async (orderId: string): Promise<DTO.Order> => {
    if (!ObjectId.isValid(orderId)) throw ServiceError.INVALID_ORDER_ID
    const order = await Model.Order.findById(orderId)
    if (!order) throw ServiceError.ORDER_NOT_FOUND
    const orderItems = await Model.OrderItem.find({
      _id: { $in: order.orderItems },
    })
    const orderDTO: DTO.Order = {
      _id: order._id.toString(),
      orderItems: orderItems.map(
        (item: Schema.OrderItem) =>
          ({
            _id: item._id.toString(),
            menuItemId: item.menuItemId.toString(),
            quantity: item.quantity,
          } as DTO.OrderItem),
      ),
    }

    const orderItemsDTO = orderDTO.orderItems.map(
      async (item: DTO.OrderItem) => {
        return await this._getOrderItem(item._id)
      },
    )
    orderDTO.orderItems = await Promise.all(orderItemsDTO)

    return orderDTO
  }

  static getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const orderDTO = await this._getOrder(id)
      res.status(200).send(orderDTO)
    } catch (err) {
      next(err)
    }
  }

  static updateOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params
      const previousOrderDTO = await this._getOrder(id)

      const { orderItems } = req.body
      const order = await Model.Order.findById(id)
      if (!order) throw ServiceError.ORDER_NOT_FOUND

      // create new orderItems
      const newOrderItems = orderItems
        .filter(
          (e: DTO.OrderItem) =>
            Number.isInteger(e?.quantity) && e?.quantity > 0,
        )
        .map(({ menuItemId, quantity }: DTO.OrderItem) => {
          return new Model.OrderItem({
            menuItemId,
            quantity,
          })
        })

      // remove all orderItems from order
      await Model.OrderItem.deleteMany({ _id: { $in: order.orderItems } })
      await Model.OrderItem.insertMany(newOrderItems)

      // add new orderItems to order
      order.orderItems = newOrderItems.map((item: Schema.OrderItem) => item._id)
      await order.save()

      const orderDTO = await this._getOrder(id)
      res.status(200).send({ previous: previousOrderDTO, updated: orderDTO })
    } catch (err) {
      next(err)
    }
  }

  static _getOrderItem = async (
    orderItemId: string,
  ): Promise<DTO.OrderItem> => {
    if (!ObjectId.isValid(orderItemId)) throw ServiceError.INVALID_ORDER_ITEM_ID
    const orderItem = await Model.OrderItem.findById(orderItemId)
    if (!orderItem) throw ServiceError.ORDER_ITEM_NOT_FOUND

    // return error if order item does not exist on any order
    // query all orders and check if orderItemId is in the orderItems array
    const orders = await Model.Order.find()
    const orderItemExists = orders.some((order) =>
      order.orderItems.includes(orderItemId),
    )
    if (!orderItemExists) throw ServiceError.ORDER_ITEM_NOT_FOUND

    const menuItem = await Model.MenuItem.findById(orderItem.menuItemId)
    if (!menuItem) throw ServiceError.MENU_ITEM_NOT_FOUND

    const orderItemDTO: DTO.OrderItem = {
      _id: orderItem._id.toString(),
      menuItemId: orderItem.menuItemId.toString(),
      quantity: orderItem.quantity,
      menuItem: {
        _id: menuItem._id.toString(),
        name: menuItem.name,
        price: menuItem.price,
        description: menuItem.description,
        imageUrl: menuItem.imageUrl,
      },
    }
    return orderItemDTO
  }

  static getOrderItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params
      const orderItemDTO = await this._getOrderItem(id)
      res.status(200).send(orderItemDTO)
    } catch (err) {
      next(err)
    }
  }

  static updateOrderItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params
      const { quantity } = req.body
      const previousOrderItemDTO = await this._getOrderItem(id)
      // check if quantity is integer and positive
      if (!Number.isInteger(quantity) || quantity <= 0)
        throw ServiceError.QUANTITY_NOT_POSITIVE

      const orderItem = await Model.OrderItem.findById(id)
      if (!orderItem) throw ServiceError.ORDER_ITEM_NOT_FOUND

      orderItem.quantity = quantity
      await orderItem.save()
      const updatedOrderItemDTO = await this._getOrderItem(id)
      res
        .status(200)
        .send({ previous: previousOrderItemDTO, updated: updatedOrderItemDTO })
    } catch (err) {
      next(err)
    }
  }

  static removeOrderItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params
      const orderItemDTO = await this._getOrderItem(id)
      await Model.OrderItem.deleteOne({ _id: id })
      res.status(200).send({ removed: orderItemDTO })
    } catch (err) {
      next(err)
    }
  }

  static confirmOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // find order by id
      const { id } = req.params
      const orderDTO = await this._getOrder(id)
      await Model.Order.deleteOne({ _id: id })

      res.status(200).send({ removed: orderDTO })
    } catch (err) {
      next(err)
    }
  }
}
