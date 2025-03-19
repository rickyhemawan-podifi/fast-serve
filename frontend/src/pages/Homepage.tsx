import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import NotificationMsg from '../components/NotificationMsg'
import ItemCard from '../components/ItemCard'

import { DTO } from '../../../backend/src/shared/types'
import { fetchActiveMenu, updateAllOrders } from '../api'

const Homepage: FunctionComponent = () => {
  const navigate = useNavigate()
  const order_id = useLocation()?.state?.order_id as string | null
  const isCompleted = useLocation()?.state?.isCompleted as boolean | null

  const [menu, setMenu] = useState<DTO.Menu | null>(null)

  const refreshMenu = async () => {
    const menu = await fetchActiveMenu()
    setMenu(menu)
  }

  const removeAllOrders = async () => {
    if (!order_id) return
    await updateAllOrders(order_id, [])
  }

  useEffect(() => {
    console.log(order_id, '<<< order_id')
    refreshMenu()
  }, [])

  const onButtonContainerClick = useCallback(() => {
    navigate('/view-order', { state: { order_id } })
  }, [navigate])

  const onItemCardContainerClick = useCallback(
    (item: DTO.MenuItem) => {
      navigate('/item-detail', { state: { item, order_id } })
    },
    [navigate],
  )

  const onRefreshButtonFrameIconClick = useCallback(() => {
    removeAllOrders()
    refreshMenu()
    // remove isCompleted from location state
    navigate('/homepage', { state: { order_id } })
  }, [refreshMenu])

  return (
    <div className='relative bg-white w-full h-[1024px] flex flex-col items-start justify-start'>
      <main className='self-stretch bg-white flex flex-col items-start justify-start py-[43px] px-5 gap-[20px]'>
        <header className='self-stretch flex flex-row items-start justify-start gap-[36px] text-left text-13xl text-gray-100 font-aleo sm:flex-row sm:gap-[1px] sm:items-start sm:justify-start'>
          <div className='flex flex-row items-start justify-between'>
            <b className='relative'>Lunch Time Menu</b>
          </div>
          <img
            className='relative w-[37px] h-[37px] overflow-hidden shrink-0 object-cover cursor-pointer'
            alt=''
            src='/refreshbuttonframe@2x.png'
            onClick={onRefreshButtonFrameIconClick}
          />
          <div className='self-stretch flex-1 flex flex-col items-end justify-start py-0.5 px-3.5'>
            <Button
              buttonText='View Order'
              onButtonContainerClick={onButtonContainerClick}
              buttonMinWidth='unset'
            />
          </div>
        </header>
        <div className='self-stretch flex flex-col items-start justify-start'>
          <img
            className='self-stretch relative max-w-full overflow-hidden h-0.5 shrink-0 object-cover'
            alt=''
            src='/separator@2x.png'
          />
        </div>
        {isCompleted && (
          <NotificationMsg
            notificationIconFrame='/notificationiconsuccess.png'
            notificationMainMessage='Order successfully placed'
          />
        )}
        <section className='self-stretch flex flex-row flex-wrap items-start justify-start py-6 px-px gap-[30px]'>
          {menu?.menuItems.map((item) => (
            <div key={menu._id + item._id}>
              {/* <span>{JSON.stringify(item, null, 2)}</span> */}
              <ItemCard
                menuItemCode={item.imageUrl}
                itemName={item.name}
                itemPrice={`\$${item.price}`}
                itemCardItemImageFrameWidth='238px'
                itemCardItemImageIconWidth='unset'
                itemCardItemImageIconAlignSelf='stretch'
                itemCardItemImageIconOverflow='hidden'
                onItemCardContainerClick={() => onItemCardContainerClick(item)}
              />
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default Homepage
