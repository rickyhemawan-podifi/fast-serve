import axios from 'axios'
import { DTO } from '../../../backend/src/shared/types'

const API_BASE_URL = 'http://localhost:3000'

export const fetchActiveMenu = async (): Promise<DTO.Menu> => {
  const response = await axios.get(`${API_BASE_URL}/menu/active`)
  return response.data
}

export const fetchOrder = async (orderId: string): Promise<DTO.Order> => {
  const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`)
  return response.data
}

export const addItemToOrder = async (
  orderId: string,
  menuItemId: string,
  quantity: number,
): Promise<DTO.Order> => {
  const response = await axios.post(`${API_BASE_URL}/orders/${orderId}/items`, {
    menuItemId,
    quantity,
  })
  return response.data
}
