import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NotificationMsg from '../components/NotificationMsg'
import OrderItem from '../components/OrderItem'
import Button from '../components/Button'
import { DTO } from '../../../backend/src/shared/types'
import { completeOrder, fetchOrder, updateAllOrders } from '../api'

const ViewOrder: FunctionComponent = () => {
  const navigate = useNavigate()
  const order_id = useLocation()?.state?.order_id as string | null

  const [order, setOrder] = useState<DTO.Order | null>(null)

  const onButtonContainerClick = useCallback(async () => {
    if (order && order_id) {
      await completeOrder(order_id)
    }
    navigate('/homepage', { state: { isCompleted: true, order_id: null } })
  }, [navigate, order, order_id])

  const onBackButtonFrameIconClick = useCallback(async () => {
    if (order && order_id) {
      await updateAllOrders(order_id, [
        ...order?.orderItems.filter((item) => item.quantity > 0),
      ])
    }
    navigate('/homepage', { state: { order_id } })
  }, [navigate, order_id, order])

  const refreshOrder = useCallback(async () => {
    if (!order_id) return
    const updatedOrder = await fetchOrder(order_id)
    if (!updatedOrder) return
    setOrder(updatedOrder)
  }, [order_id])

  const calculateTotalPrice = useCallback(() => {
    if (!order) return 0
    return order.orderItems.reduce(
      (acc, item) => acc + (item.menuItem?.price || 0) * (item.quantity || 0),
      0,
    )
  }, [order])

  useEffect(() => {
    refreshOrder()
  }, [order_id])

  const onRemoveItem = useCallback(
    async (itemId: string) => {
      console.log(order_id, '<<< order_id')
      console.log(itemId, '<<< itemId onRemoveItem')
      if (!order_id) return
      console.log('1 <<<')
      if (!order) return
      console.log('2 <<<')
      await updateAllOrders(order_id, [
        ...order?.orderItems.filter((item) => item._id !== itemId),
      ])
      await refreshOrder()
    },
    [order_id, order],
  )

  const onIncrementItem = useCallback(
    (itemId: string) => {
      if (!order) return
      const newOrder = {
        ...order,
        orderItems: order?.orderItems.map((item) =>
          item._id === itemId
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item,
        ),
      }
      setOrder(newOrder)
    },
    [order],
  )

  const onDecrementItem = useCallback(
    (itemId: string) => {
      if (!order) return
      const newOrder = {
        ...order,
        orderItems: order?.orderItems.map((item) =>
          item._id === itemId
            ? {
                ...item,
                quantity:
                  item.quantity > 1 ? (item.quantity || 0) - 1 : item.quantity,
              }
            : item,
        ),
      }
      setOrder(newOrder)
    },
    [order],
  )

  if (!order || order.orderItems.length === 0) {
    return (
      <div className='relative bg-white w-full h-[1024px] flex flex-col items-start justify-start'>
        <main className='self-stretch flex-1 flex flex-col items-center justify-start py-[43px] px-5 gap-[10px] text-left text-base text-gray-300 font-aleo sm:flex-col'>
          <header className='self-stretch flex flex-row items-start justify-start gap-[36px] text-left text-13xl text-gray-100 font-aleo'>
            <img
              className='relative w-[37px] h-[37px] overflow-hidden shrink-0 object-cover cursor-pointer'
              alt=''
              src='/backbuttonframe@2x.png'
              onClick={onBackButtonFrameIconClick}
            />
            <div className='flex flex-row items-start justify-start'>
              <b className='relative'>Order Summary</b>
            </div>
          </header>
          <NotificationMsg
            notificationBackgroundColor='#ffeeaa'
            notificationIconFrame='/notificationiconframe@2x.png'
            notificationMainMessageFrFlex='unset'
            notificationMainMessage='Nothing to display in this order'
            notificationSecondaryMessFlex='unset'
          />
        </main>
      </div>
    )
  }

  return (
    <div className='relative bg-white w-full h-[1024px] flex flex-col items-start justify-start'>
      <main className='self-stretch flex-1 flex flex-col items-center justify-start py-[43px] px-5 gap-[10px] text-left text-base text-gray-300 font-aleo sm:flex-col'>
        <header className='self-stretch flex flex-row items-start justify-start gap-[36px] text-left text-13xl text-gray-100 font-aleo'>
          <img
            className='relative w-[37px] h-[37px] overflow-hidden shrink-0 object-cover cursor-pointer'
            alt=''
            src='/backbuttonframe@2x.png'
            onClick={onBackButtonFrameIconClick}
          />
          <div className='flex flex-row items-start justify-start'>
            <b className='relative'>Order Summary</b>
          </div>
        </header>
        <div className='self-stretch flex flex-col items-start justify-start py-2.5 px-0'>
          <img
            className='self-stretch relative max-w-full overflow-hidden h-px shrink-0 object-cover'
            alt=''
            src='/ordersummarytableheaderseparator@2x.png'
          />
        </div>
        <section className='w-full flex flex-col items-start justify-start pt-[55px] px-0 pb-0 box-border gap-[9px] max-w-[1200px] text-left text-base text-gray-300 font-aleo sm:hidden'>
          <div className='self-stretch flex flex-row items-start justify-start gap-[45px]'>
            <div className='flex-1 flex flex-row items-start justify-start py-0 pr-0 pl-[180px] box-border max-w-[635px]'>
              <div className='relative'>Item</div>
            </div>
            <div className='flex-1 flex flex-row items-start justify-start max-w-[320px]'>
              <div className='relative'>Quantity</div>
            </div>
            <div className='flex flex-row items-center justify-start'>
              <div className='relative'>Total Price</div>
            </div>
          </div>
          <div className='self-stretch h-px flex flex-col items-start justify-start'>
            <img
              className='self-stretch relative max-w-full overflow-hidden h-px shrink-0 object-cover'
              alt=''
              src='/ordersummarytableheaderseparator@2x.png'
            />
          </div>
        </section>
        {order?.orderItems.map((item) => (
          <OrderItem
            itemName={item.menuItem?.name || ''}
            itemPrice={`\$${item.menuItem?.price || 0}`}
            itemQuantity={item.quantity}
            itemSubTotal={`\$${(item.menuItem?.price || 100) * (item.quantity || 0)}`}
            orderItemImage={item.menuItem?.imageUrl || ''}
            orderItemSeparator='/orderitemseparator@2x.png'
            itemId={item._id}
            onRemoveItem={onRemoveItem}
            onIncrementItem={onIncrementItem}
            onDecrementItem={onDecrementItem}
          />
        ))}
        <div className='w-full flex flex-row items-start justify-start gap-[10px] max-w-[1200px] sm:items-start sm:justify-start sm:pr-0 sm:box-border'>
          <div className='flex-1 flex flex-row items-start justify-end p-2.5 box-border max-w-[1025px] sm:max-w-[250px]'>
            <b className='relative inline-block w-[52.1px] h-[26.2px] shrink-0'>
              Total:
            </b>
          </div>
          <div className='flex flex-row items-start justify-center p-2.5'>
            <div className='relative inline-block w-[57.1px] h-[26.2px] shrink-0'>
              ${calculateTotalPrice()}
            </div>
          </div>
        </div>
        <div className='w-full flex flex-col items-end justify-start py-0 pr-[100px] pl-0 box-border max-w-[1200px] sm:pr-[55px] sm:box-border mq350small:pr-[15px] mq350small:box-border'>
          <Button
            buttonText='Place Order'
            onButtonContainerClick={onButtonContainerClick}
            buttonMinWidth='150px'
          />
        </div>
      </main>
    </div>
  )
}

export default ViewOrder
