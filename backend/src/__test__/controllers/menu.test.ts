import { NextFunction, Request, Response } from 'express'
import { MenuController } from '../../controllers'
import { ServiceError } from '../../shared/error'
import Model from '../../models'

jest.mock('../../models', () => ({
  Menu: Object.assign(
    jest.fn().mockImplementation(() => ({
      _id: '67d8df8bc879223da56b0765',
      menuItems: [],
      type: 'breakfast',
      startTime: 0,
      endTime: 1439,
      save: jest.fn().mockResolvedValue(this),
    })),
    {
      findOne: jest.fn().mockResolvedValue({
        _id: '67d8df8bc879223da56b0765',
        menuItems: ['67d8df8bc879223da56b0765'],
        type: 'breakfast',
        startTime: 0,
        endTime: 1439,
      }),
      findById: jest.fn().mockResolvedValue({
        _id: '67d8df8bc879223da56b0765',
        menuItems: ['67d8df8bc879223da56b0765'],
        type: 'breakfast',
        startTime: 0,
        endTime: 1439,
      }),
    },
  ),
  MenuItem: Object.assign(
    jest.fn().mockImplementation(() => ({
      _id: '67d8df8bc879223da56b0765',
      name: 'Item 1',
      description: 'Item 1 description',
      price: 10,
      imageUrl: 'Item 1 image',
      save: jest.fn().mockResolvedValue(this),
    })),
    {
      findById: jest.fn().mockResolvedValue({
        _id: '67d8df8bc879223da56b0765',
        name: 'Item 1',
        description: 'Item 1 description',
        price: 10,
        imageUrl: 'Item 1 image',
      }),
      find: jest.fn().mockResolvedValue([
        {
          _id: '67d8df8bc879223da56b0765',
          name: 'Item 1',
          description: 'Item 1 description',
          price: 10,
          imageUrl: 'Item 1 image',
        },
      ]),
    },
  ),
}))

describe('MenuController', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = { status: jest.fn(), send: jest.fn() } as unknown as Request
    res = { status: jest.fn(() => res), send: jest.fn() } as unknown as Response
    next = jest.fn() as NextFunction
    jest.clearAllMocks()
  })

  describe('getActiveMenu', () => {
    it('should return the active menu', async () => {
      await MenuController.getActiveMenu(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({
        _id: '67d8df8bc879223da56b0765',
        endTime: 1439,
        menuItems: [
          {
            _id: '67d8df8bc879223da56b0765',
            description: 'Item 1 description',
            imageUrl: 'Item 1 image',
            name: 'Item 1',
            price: 10,
          },
        ],
        startTime: 0,
        type: 'breakfast',
      })
    })

    it('should handle invalid time parameter', async () => {
      req.query = {
        minutes: 'invalid',
      }

      await MenuController.getActiveMenu(req, res, next)

      expect(next).toHaveBeenCalledWith(ServiceError.INVALID_INTEGER)
    })

    it('should handle menu not found', async () => {
      jest.spyOn(Model.Menu, 'findOne').mockResolvedValueOnce(null)

      await MenuController.getActiveMenu(req, res, next)

      expect(next).toHaveBeenCalledWith(ServiceError.NOT_FOUND)
    })
  })

  describe('getMenuItem', () => {
    it('should return the menu item', async () => {
      req.params = {
        id: '67d8df8bc879223da56b0765',
      }

      await MenuController.getMenuItem(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith({
        _id: '67d8df8bc879223da56b0765',
        description: 'Item 1 description',
        imageUrl: 'Item 1 image',
        name: 'Item 1',
        price: 10,
      })
    })

    it('should handle invalid menu item ID', async () => {
      req.params = {
        id: 'invalid-id',
      }

      await MenuController.getMenuItem(req, res, next)

      expect(next).toHaveBeenCalledWith(ServiceError.NOT_FOUND)
    })

    it('should handle menu item not found', async () => {
      req.params = {
        id: '67d8df8bc879223da56b0765',
      }

      jest.spyOn(Model.MenuItem, 'findById').mockResolvedValueOnce(null)

      await MenuController.getMenuItem(req, res, next)

      expect(next).toHaveBeenCalledWith(ServiceError.NOT_FOUND)
    })
  })
})
