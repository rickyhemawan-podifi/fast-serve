import { ObjectId } from 'mongodb'

export enum EnumMenuTypes {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
}

export namespace Schema {
  /**
   * @property {number} startTime number from 0 to 1439 which represents the minutes of the day.
   * @property {number} endTime number from 0 to 1439 which represents the minutes of the day.
   * @property {string[]} items represents the {MenuItem} ids
   */
  export interface Menu {
    _id?: ObjectId
    startTime: number
    endTime: number
    menuItems: string[]
    type: EnumMenuTypes
  }

  export interface MenuItem {
    _id?: ObjectId
    name: string
    description: string
    price: number
    imageUrl: string
  }

  /**
   * @property {string[]} items represents the {MenuItem} ids
   */
  export interface Order {
    _id: ObjectId
    orderItems: string[]
  }

  export interface OrderItem {
    _id: ObjectId
    menuItemId: string
    quantity: number
  }
}

export namespace DTO {
  export interface Menu {
    _id: string
    startTime: number
    endTime: number
    menuItems: DTO.MenuItem[]
    type: EnumMenuTypes
  }
  export interface MenuItem {
    _id: string
    name: string
    description: string
    price: number
    imageUrl: string
  }
  export interface Order {
    _id: string
    orderItems: DTO.OrderItem[]
  }
  export interface OrderItem {
    _id: string
    menuItemId: string
    quantity: number
    menuItem?: DTO.MenuItem
  }
}
