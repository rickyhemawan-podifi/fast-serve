import { ObjectId } from 'mongodb'
import { Request, Response, NextFunction } from 'express'
import Model from '../models'
import { ServiceError } from '../shared/error'
import { DTO, Schema } from '../shared/types'

export default class {
  static getActiveMenu = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const queryTimeInt: string = req?.query?.minutes as string
      const serverTimeInt: number =
        new Date().getMinutes() + new Date().getHours() * 60

      if (queryTimeInt && isNaN(queryTimeInt as unknown as number))
        throw ServiceError.INVALID_INTEGER

      const timeInt: number = queryTimeInt
        ? parseInt(queryTimeInt)
        : serverTimeInt

      const menu = await Model.Menu.findOne({
        startTime: { $lte: timeInt },
        endTime: { $gte: timeInt },
      })
      if (!menu) throw ServiceError.NOT_FOUND

      const menuItems = await Model.MenuItem.find({
        _id: { $in: menu.menuItems },
      })
      if (!menuItems) throw ServiceError.NOT_FOUND

      const menuDTO: DTO.Menu = {
        _id: menu._id.toString(),
        startTime: menu.startTime,
        endTime: menu.endTime,
        menuItems: menuItems.map(
          (item: Schema.MenuItem) =>
            ({
              _id: item?._id?.toString(),
              name: item.name,
              description: item.description,
              price: item.price,
              imageUrl: item.imageUrl,
            } as DTO.MenuItem),
        ),
        type: menu.type,
      }

      res.status(200).send(menuDTO)
    } catch (err) {
      next(err)
    }
  }

  static getMenuItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params
    try {
      if (!ObjectId.isValid(id)) throw ServiceError.NOT_FOUND
      const menuItem = await Model.MenuItem.findById(id)
      if (!menuItem) throw ServiceError.NOT_FOUND

      const menuItemDTO: DTO.MenuItem = {
        _id: menuItem._id.toString(),
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        imageUrl: menuItem.imageUrl,
      }

      res.status(200).send(menuItemDTO)
    } catch (err) {
      next(err)
    }
  }
}
