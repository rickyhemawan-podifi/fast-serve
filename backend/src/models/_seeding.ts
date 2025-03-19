import 'dotenv/config'
import { connect, disconnect, MONGO_URI } from '../utilities/mongo-connection'
import MenuItem from './menu-item'
import Menu from './menu'
import { EnumMenuTypes, Schema } from '../shared/types'

const menuItems: Schema.MenuItem[] = [
  // Breakfast and Lunch
  {
    name: 'French Fries',
    price: 9,
    description: 'Highly Greasy Heavenly Fries',
    imageUrl: '/itemcarditemimage2@2x.png',
  },
  // Lunch and Dinner
  {
    name: 'Burger',
    price: 12,
    description: 'Maybe a delicious burger',
    imageUrl: '/itemcarditemimage@2x.png',
  },
]

const menus: Schema.Menu[] = [
  {
    startTime: 480, // 8:00
    endTime: 719, // 11:59
    menuItems: [],
    type: EnumMenuTypes.BREAKFAST,
  },
  {
    startTime: 720, // 12:00
    endTime: 1139, // 16:59
    menuItems: [],
    type: EnumMenuTypes.LUNCH,
  },
  {
    startTime: 1140, // 19:00
    endTime: 1320, // 22:00
    menuItems: [],
    type: EnumMenuTypes.DINNER,
  },
]

const seed = async () => {
  // lazy non dynamic seeding
  try {
    await connect()
    const frenchFries = await MenuItem.create(menuItems[0])
    const burger = await MenuItem.create(menuItems[1])
    await Menu.create({
      ...menus[0],
      menuItems: [frenchFries._id],
    })
    await Menu.create({
      ...menus[1],
      menuItems: [frenchFries._id, burger._id],
    })
    await Menu.create({
      ...menus[2],
      menuItems: [burger._id],
    })
    await disconnect()
    console.log('[v] Seeding successful at ', MONGO_URI)
  } catch (err) {
    console.error('[x] Seeding failed at ', MONGO_URI, err)
  }
}

seed()
