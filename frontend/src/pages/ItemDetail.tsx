import { FunctionComponent, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ItemDetailsCard from '../components/ItemDetailsCard'

import { DTO } from '../../../backend/src/shared/types'

const ItemDetail: FunctionComponent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const item = (useLocation()?.state?.item as DTO.MenuItem) || null
  const order_id = useLocation()?.state?.order_id || null
  const onBackButtonFrameIconClick = useCallback(() => {
    navigate('/homepage', location)
  }, [navigate])

  const onAddItem = useCallback(() => {
    console.log('add item')
  }, [])

  return (
    <div className='relative bg-white w-full h-[1024px] overflow-hidden flex flex-col items-start justify-start sm:flex-col'>
      <section className='self-stretch flex flex-col items-start justify-start py-[43px] px-5 gap-[20px]'>
        <header className='self-stretch flex flex-row items-start justify-start gap-[36px] text-left text-13xl text-gray-100 font-aleo'>
          <img
            className='relative w-[37px] h-[37px] overflow-hidden shrink-0 object-cover cursor-pointer'
            alt=''
            src='/backbuttonframe@2x.png'
            onClick={onBackButtonFrameIconClick}
          />
          <div className='flex flex-row items-start justify-start'>
            <b className='relative'>Item Detail</b>
          </div>
        </header>
        <div className='self-stretch h-[1.1px] flex flex-col items-start justify-start'>
          <img
            className='self-stretch relative max-w-full overflow-hidden h-0.5 shrink-0 object-cover'
            alt=''
            src='/separator@2x.png'
          />
        </div>
        <div className='self-stretch flex flex-row items-start justify-center py-5 px-0'>
          <ItemDetailsCard
            itemDetailsCardOrderId={order_id}
            itemDetailsCardMenuItemId={item._id}
            itemDetailsCardItemImage={item.imageUrl}
            itemDetailsCardItemName={item.name}
            itemDetailsCardItemPrice={`\$${item.price}`}
            itemDetailsCardDescription={item.description}
          />
        </div>
      </section>
    </div>
  )
}

export default ItemDetail
