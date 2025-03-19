// test for order controller

import { NextFunction, Request, Response } from 'express'
import { OrderController } from '../../controllers'
import { ServiceError } from '../../shared/error'
import Model from '../../models'

jest.mock('../../models', () => ({
  Order: Object.assign(
    jest.fn().mockImplementation(() => ({
      _id: '67d8df8bc879223da56b0765',
      orderItems: [],
      save: jest.fn().mockResolvedValue({
        _id: '67d8df8bc879223da56b0765',
        orderItems: ['67d8df8bc879223da56b0765'],
      }),
    })),
    {
      findById: jest.fn().mockResolvedValue({
        _id: '67d8df8bc879223da56b0765',
        orderItems: ['67d8df8bc879223da56b0765'],
        save: jest.fn().mockResolvedValue({
          _id: '67d8df8bc879223da56b0765',
          orderItems: ['67d8df8bc879223da56b0765'],
        }),
      }),
      find: jest.fn().mockResolvedValue([
        {
          _id: '67d8df8bc879223da56b0765',
          orderItems: ['67d8df8bc879223da56b0765'],
        },
      ]),
      deleteMany: jest.fn().mockResolvedValue(true),
      deleteOne: jest.fn().mockResolvedValue(true),
    },
  ),
  OrderItem: Object.assign(
    jest.fn().mockImplementation(() => ({
      _id: '67d8df8bc879223da56b0765',
      menuItemId: '67d8df8bc879223da56b0765',
      quantity: 1,
      save: jest.fn().mockResolvedValue(this),
    })),
    {
      findById: jest.fn().mockResolvedValue({
        _id: '67d8df8bc879223da56b0765',
        menuItemId: '67d8df8bc879223da56b0765',
        quantity: 1,
      }),
      find: jest.fn().mockResolvedValue([
        {
          _id: '67d8df8bc879223da56b0765',
          menuItemId: '67d8df8bc879223da56b0765',
          quantity: 1,
        },
      ]),
      deleteMany: jest.fn().mockResolvedValue(true),
      deleteOne: jest.fn().mockResolvedValue(true),
      insertMany: jest.fn().mockResolvedValue([
        {
          _id: '67d8df8bc879223da56b0765',
          menuItemId: '67d8df8bc879223da56b0765',
          quantity: 1,
        },
      ]),
    },
  ),
  MenuItem: Object.assign(
    jest.fn().mockImplementation(() => ({
      _id: '67d8df8bc879223da56b0765',
      name: 'Burger',
      price: 10,
      save: jest.fn().mockResolvedValue(this),
    })),
    {
      findById: jest.fn().mockResolvedValue({
        _id: '67d8df8bc879223da56b0765',
        name: 'Burger',
        price: 10,
      }),
      find: jest.fn().mockResolvedValue([
        {
          _id: '67d8df8bc879223da56b0765',
          name: 'Burger',
          price: 10,
        },
      ]),
    },
  ),
}))

describe('OrderController', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = { status: jest.fn(), send: jest.fn() } as unknown as Request
    res = { status: jest.fn(() => res), send: jest.fn() } as unknown as Response
    next = jest.fn() as NextFunction
    jest.clearAllMocks()
  })

  describe('addToOrder', () => {
    it('should add an item to order successfully', async () => {
      req.body = {
        menuItemId: '67d8df8bc879223da56b0765',
        quantity: 1,
      }

      await OrderController.addToOrder(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({
        _id: '67d8df8bc879223da56b0765',
        orderItems: [
          {
            _id: '67d8df8bc879223da56b0765',
            menuItemId: '67d8df8bc879223da56b0765',
            quantity: 1,
            menuItem: {
              _id: '67d8df8bc879223da56b0765',
              name: 'Burger',
              price: 10,
            },
          },
        ],
      })
    })

    it('should handle invalid menu item ID', async () => {
      req.body = {
        menuItemId: 'invalid-id',
        quantity: 1,
      }

      await OrderController.addToOrder(req, res, next)

      expect(next).toHaveBeenCalledWith(ServiceError.INVALID_MENU_ITEM_ID)
    })

    it('should handle invalid quantity', async () => {
      req.body = {
        menuItemId: '67d8df8bc879223da56b0765',
        quantity: 0,
      }

      await OrderController.addToOrder(req, res, next)

      expect(next).toHaveBeenCalledWith(ServiceError.QUANTITY_NOT_POSITIVE)
    })

    it('should handle menu item not found', async () => {
      req.body = {
        menuItemId: '67d8df8bc879223da56b0765',
        quantity: 1,
      }

      jest.spyOn(Model.MenuItem, 'findById').mockResolvedValueOnce(null)

      await OrderController.addToOrder(req, res, next)

      expect(next).toHaveBeenCalledWith(ServiceError.MENU_ITEM_NOT_FOUND)
    })
  })

  describe('getOrder', () => {
    it('should get an order successfully', async () => {
      req.params = {
        id: '67d8df8bc879223da56b0765',
      }

      await OrderController.getOrder(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({
        _id: '67d8df8bc879223da56b0765',
        orderItems: [
          {
            _id: '67d8df8bc879223da56b0765',
            menuItemId: '67d8df8bc879223da56b0765',
            quantity: 1,
            menuItem: {
              _id: '67d8df8bc879223da56b0765',
              name: 'Burger',
              price: 10,
            },
          },
        ],
      })
    })

    it('should handle invalid order ID', async () => {
      req.params = {
        id: 'invalid-id',
      }

      await OrderController.getOrder(req, res, next)

      expect(next).toHaveBeenCalledWith(ServiceError.INVALID_ORDER_ID)
    })

    it('should handle order not found', async () => {
      req.params = {
        id: '67d8df8bc879223da56b0765',
      }

      jest.spyOn(Model.Order, 'findById').mockResolvedValueOnce(null)

      await OrderController.getOrder(req, res, next)

      expect(next).toHaveBeenCalledWith(ServiceError.ORDER_NOT_FOUND)
    })
  })

  describe('updateOrder', () => {
    it('should update an order successfully', async () => {
      req.params = {
        id: '67d8df8bc879223da56b0765',
      }
      req.body = {
        orderItems: [
          {
            menuItemId: '67d8df8bc879223da56b0765',
            quantity: 2,
          },
        ],
      }

      await OrderController.updateOrder(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({
        previous: {
          _id: '67d8df8bc879223da56b0765',
          orderItems: [
            {
              _id: '67d8df8bc879223da56b0765',
              menuItem: {
                _id: '67d8df8bc879223da56b0765',
                description: undefined,
                imageUrl: undefined,
                name: 'Burger',
                price: 10,
              },
              menuItemId: '67d8df8bc879223da56b0765',
              quantity: 1,
            },
          ],
        },
        updated: {
          _id: '67d8df8bc879223da56b0765',
          orderItems: [
            {
              _id: '67d8df8bc879223da56b0765',
              menuItem: {
                _id: '67d8df8bc879223da56b0765',
                description: undefined,
                imageUrl: undefined,
                name: 'Burger',
                price: 10,
              },
              menuItemId: '67d8df8bc879223da56b0765',
              quantity: 1,
            },
          ],
        },
      })
    })

    it('should throw error when order id is invalid', async () => {
      req.params = {
        id: 'invalid-id',
      }
      req.body = {
        orderItems: [
          {
            menuItemId: '67d8df8bc879223da56b0765',
            quantity: 2,
          },
        ],
      }

      await OrderController.updateOrder(req, res, next)

      expect(next).toHaveBeenCalledWith(ServiceError.INVALID_ORDER_ID)
    })
  })

  describe('removeOrderItem', () => {
    it('should remove an order item successfully', async () => {
      req.params = {
        id: '67d8df8bc879223da56b0765',
      }

      await OrderController.removeOrderItem(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({
        removed: {
          _id: '67d8df8bc879223da56b0765',
          menuItem: {
            _id: '67d8df8bc879223da56b0765',
            description: undefined,
            imageUrl: undefined,
            name: 'Burger',
            price: 10,
          },
          menuItemId: '67d8df8bc879223da56b0765',
          quantity: 1,
        },
      })
    })

    it('should throw error when order item id is invalid', async () => {
      req.params = {
        id: 'invalid-id',
      }

      await OrderController.removeOrderItem(req, res, next)

      expect(next).toHaveBeenCalledWith(ServiceError.INVALID_ORDER_ITEM_ID)
    })

    it('should throw error when order item is not found', async () => {
      req.params = {
        id: '67d8df8bc879223da56b0765',
      }

      const findByIdSpy = jest.spyOn(Model.OrderItem, 'findById')
      const originalFindById = findByIdSpy.getMockImplementation()
      findByIdSpy.mockResolvedValueOnce(null)

      await OrderController.removeOrderItem(req, res, next)

      expect(next).toHaveBeenCalledWith(ServiceError.ORDER_ITEM_NOT_FOUND)
      findByIdSpy.mockImplementation(originalFindById)
    })

    it('should throw error when delete operation fails', async () => {
      req.params = {
        id: '67d8df8bc879223da56b0765',
      }

      const deleteOneSpy = jest.spyOn(Model.OrderItem, 'deleteOne')
      const originalDeleteOne = deleteOneSpy.getMockImplementation()
      deleteOneSpy.mockRejectedValueOnce(ServiceError.ORDER_ITEM_NOT_FOUND)

      await OrderController.removeOrderItem(req, res, next)

      expect(next).toHaveBeenCalledWith(ServiceError.ORDER_ITEM_NOT_FOUND)
      deleteOneSpy.mockImplementation(originalDeleteOne)
    })
  })

  describe('confirmOrder', () => {
    it('should confirm and remove an order successfully', async () => {
      req.params = {
        id: '67d8df8bc879223da56b0765',
      }

      await OrderController.confirmOrder(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({
        removed: {
          _id: '67d8df8bc879223da56b0765',
          orderItems: [
            {
              _id: '67d8df8bc879223da56b0765',
              menuItemId: '67d8df8bc879223da56b0765',
              quantity: 1,
              menuItem: {
                _id: '67d8df8bc879223da56b0765',
                name: 'Burger',
                price: 10,
              },
            },
          ],
        },
      })
    })
  })
})
