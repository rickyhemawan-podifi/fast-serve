import { FunctionComponent } from 'react'
import { Input } from '@chakra-ui/react'
import { DTO } from '../../../backend/src/shared/types'
type OrderItemType = {
  itemId?: string
  itemName?: string
  itemPrice?: string
  itemSubTotal?: string
  itemQuantity?: number
  orderItemImage?: string
  orderItemSeparator?: string
  onRemoveItem?: (item: string) => void
  onIncrementItem?: (item: string) => void
  onDecrementItem?: (item: string) => void
}

const OrderItem: FunctionComponent<OrderItemType> = ({
  itemId,
  itemName,
  itemQuantity,
  itemPrice,
  itemSubTotal,
  orderItemImage,
  orderItemSeparator,
  onRemoveItem,
  onIncrementItem,
  onDecrementItem,
}) => {
  console.log(itemQuantity, '<<< itemQuantity')
  console.log(itemPrice, '<<< itemPrice')
  console.log(itemSubTotal, '<<< itemSubTotal')
  return (
    <section className='w-full bg-white flex flex-col items-start justify-center max-w-[1200px] text-left text-base text-gray-300 font-aleo sm:flex-col'>
      <div className='self-stretch flex flex-row items-start justify-start gap-[45px] sm:flex sm:flex-row sm:flex-wrap sm:gap-[10px] sm:items-start sm:justify-center'>
        <div className='w-[135px] flex flex-row items-start justify-center'>
          <img
            className='relative w-32 h-32 object-cover'
            alt=''
            src={orderItemImage}
          />
        </div>
        <div className='self-stretch flex-1 flex flex-col items-start justify-center gap-[4px] max-w-[455px]'>
          <div className='flex flex-row items-start justify-center'>
            <b className='relative'>{itemName}</b>
          </div>
          <div className='w-[43px] flex flex-row items-start justify-center text-sm font-work-sans'>
            <div className='relative'>{itemPrice}</div>
          </div>
        </div>
        <div className='self-stretch flex-1 flex flex-row items-center justify-start gap-[10px] max-w-[320px] lg:max-w-[320px] sm:max-w-[200px]'>
          <img
            className='relative rounded-10xs w-[23px] h-[23px] object-cover'
            alt=''
            src='/orderitemincrementquantityframe@2x.png'
            onClick={() => onIncrementItem?.(itemId || '')}
          />
          <Input
            className='bg-[transparent] font-aleo font-bold text-base text-gray-100'
            placeholder={itemQuantity?.toString() || ''}
            size='sm'
          />
          <img
            className='relative rounded-10xs w-[23px] h-[23px] object-cover'
            alt=''
            src='/orderitemdecrementquantityframe@2x.png'
            onClick={() => onDecrementItem?.(itemId || '')}
          />
          <div className='w-[21px] overflow-hidden shrink-0 flex flex-row items-center justify-start py-0 px-[3px] box-border md:flex-col'>
            <img
              className='relative w-[15px] h-5 object-cover lg:flex lg:w-[15px]'
              alt=''
              src='/orderitemremoveimg@2x.png'
              onClick={() => onRemoveItem?.(itemId || '')}
            />
          </div>
        </div>
        <div className='self-stretch flex flex-row items-center justify-start py-0 pr-0 pl-1.5 md:min-w-[75px]'>
          <div className='relative'>{itemSubTotal}</div>
        </div>
      </div>
      <div className='self-stretch flex flex-row items-center justify-start p-2.5'>
        <img
          className='flex-1 relative max-w-full overflow-hidden h-[1.6px] object-cover'
          alt=''
          src={orderItemSeparator}
        />
      </div>
    </section>
  )
}

export default OrderItem
