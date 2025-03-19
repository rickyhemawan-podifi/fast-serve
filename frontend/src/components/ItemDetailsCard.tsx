import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Input } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import Button from './Button'
import { createFirstOrder, fetchOrder, updateAllOrders } from '../api'
import { DTO } from '../../../backend/src/shared/types'

type ItemDetailsCardType = {
  itemDetailsCardOrderId?: string
  itemDetailsCardMenuItemId?: string
  itemDetailsCardItemImage?: string
  itemDetailsCardItemName?: string
  itemDetailsCardItemPrice?: string
  itemDetailsCardDescription?: string
}

const ItemDetailsCard: FunctionComponent<ItemDetailsCardType> = ({
  itemDetailsCardOrderId,
  itemDetailsCardMenuItemId,
  itemDetailsCardItemImage,
  itemDetailsCardItemName,
  itemDetailsCardItemPrice,
  itemDetailsCardDescription,
}) => {
  const navigate = useNavigate()

  const [quantity, setQuantity] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [order, setOrder] = useState<DTO.Order | null>(null)

  const countUp = useCallback(() => {
    setQuantity(quantity + 1)
    console.log(quantity, '<<< quantity')
  }, [quantity])

  const countDown = useCallback(() => {
    if (quantity > 0) {
      setQuantity(quantity - 1)
    }
  }, [quantity])

  useEffect(() => {
    const fn = async () => {
      if (!itemDetailsCardOrderId) return
      const order = await fetchOrder(itemDetailsCardOrderId)
      if (!order) return
      setOrder(order)
      const quantity = order.orderItems.find(
        (item) => item.menuItemId === itemDetailsCardMenuItemId,
      )?.quantity
      setQuantity(quantity || 0)
    }
    fn()
  }, [itemDetailsCardOrderId])

  const onButtonContainerClick = useCallback(async () => {
    if (!itemDetailsCardMenuItemId) {
      return navigate('/homepage', {
        state: { order_id: itemDetailsCardOrderId },
      })
    }
    setLoading(true)
    let orderId = itemDetailsCardOrderId
    if (itemDetailsCardOrderId) {
      const order = await fetchOrder(itemDetailsCardOrderId)
      if (!order) return
      const items = order.orderItems.filter(
        (item) => item.menuItemId !== itemDetailsCardMenuItemId,
      )
      const result = await updateAllOrders(itemDetailsCardOrderId, [
        ...items,
        { menuItemId: itemDetailsCardMenuItemId, quantity, _id: '' },
      ])
      console.log(result, '<<< result')
    } else {
      console.log(quantity, '<<< quantity right before createFirstOrder')
      const result = await createFirstOrder({
        menuItemId: itemDetailsCardMenuItemId,
        quantity,
      })
      if (!result) return
      orderId = result._id
    }
    setLoading(false)
    console.log(orderId, '<<< orderId')
    navigate('/homepage', {
      state: { order_id: orderId },
    })
  }, [navigate, quantity])

  return (
    <div className='bg-white flex flex-row items-start justify-start gap-[41px] text-left text-3xl text-gray-300 font-aleo sm:flex-col sm:gap-[41px] sm:items-center sm:justify-start'>
      <img
        className='relative w-[238px] h-[227px] object-cover sm:flex'
        alt=''
        src={itemDetailsCardItemImage}
      />
      <div className='self-stretch flex flex-col items-start justify-start gap-[10px] sm:items-start sm:justify-start'>
        <div className='flex-1 flex flex-row items-center justify-start gap-[50px] sm:flex-col'>
          <div className='flex flex-col items-start justify-start gap-[5px] md:flex-col md:gap-[15px] md:pb-0 md:box-border sm:flex-col sm:items-center sm:justify-start'>
            <div className='flex flex-row items-start justify-start md:h-auto md:flex-row sm:flex-col'>
              <b className='relative'>{itemDetailsCardItemName}</b>
            </div>
            <div className='flex flex-col items-start justify-start text-base md:flex-row'>
              <b className='relative'>{itemDetailsCardItemPrice}</b>
            </div>
          </div>
          <div className='w-[539px] flex flex-row items-start justify-start text-base sm:w-auto sm:[align-self:unset]'>
            <div className='flex-1 relative sm:flex'>
              {itemDetailsCardDescription}
            </div>
          </div>
        </div>
        <div className='self-stretch flex flex-row items-center justify-end gap-[50px] sm:flex-col sm:gap-[20px] sm:items-end sm:justify-start'>
          <div className='flex flex-row items-center justify-start gap-[10px]'>
            <img
              className='relative rounded-10xs w-[23px] h-[23px] object-cover'
              alt=''
              src='/itemdetailscardincrementquantityframe@2x.png'
              onClick={countUp}
            />
            <Input
              className='bg-[transparent] font-aleo font-bold text-base text-gray-100'
              placeholder={quantity.toString()}
              size='sm'
            />
            <img
              className='relative rounded-10xs w-[23px] h-[23px] object-cover'
              alt=''
              src='/itemdetailscarddecrementquantityframe@2x.png'
              onClick={countDown}
            />
          </div>
          <Button
            buttonText='Add To Order'
            onButtonContainerClick={onButtonContainerClick}
            buttonMinWidth='unset'
            disabled={quantity === 0}
          />
        </div>
      </div>
    </div>
  )
}

export default ItemDetailsCard
