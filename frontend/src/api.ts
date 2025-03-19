import axios from 'axios'
import { DTO } from '../../backend/src/shared/types'

export const fetchActiveMenu = async (): Promise<DTO.Menu | null> => {
  try {
    const response = await axios.get(
      'http://localhost:3000/menu/active?minutes=721',
    )
    const menu = response.data as DTO.Menu
    return menu
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return null
  }
}

export const createFirstOrder = async ({
  menuItemId,
  quantity,
}: {
  menuItemId: string
  quantity: number
}): Promise<DTO.Order | null> => {
  try {
    console.log(menuItemId, quantity, '<<< menuItemId, quantity')
    const response = await axios.post('http://localhost:3000/order', {
      menuItemId,
      quantity,
    })
    const order = response.data as DTO.Order
    return order
  } catch (error) {
    console.error('Error creating order:', error)
    return null
  }
}

export const fetchOrder = async (
  orderId: string,
): Promise<DTO.Order | null> => {
  try {
    const response = await axios.get(`http://localhost:3000/order/${orderId}`)
    const order = response.data as DTO.Order
    return order
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

export const updateAllOrders = async (
  orderId: string,
  items: DTO.OrderItem[],
): Promise<DTO.Order | null> => {
  try {
    const order = await fetchOrder(orderId)
    if (!order) return null
    const response = await axios.put(`http://localhost:3000/order/${orderId}`, {
      orderItems: [...items],
    })
    const updatedOrder = response.data as DTO.Order
    console.log(updatedOrder, '<<< updatedOrder')
    return updatedOrder
  } catch (error) {
    console.error('Error updating order:', error)
    return null
  }
}

export const completeOrder = async (
  orderId: string,
): Promise<DTO.Order | null> => {
  try {
    const response = await axios.put(
      `http://localhost:3000/order/${orderId}/complete`,
    )
    const updatedOrder = response.data as DTO.Order
    return updatedOrder
  } catch (error) {
    console.error('Error completing order:', error)
    return null
  }
}
