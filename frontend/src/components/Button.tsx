import { FunctionComponent, memo, useMemo, type CSSProperties } from 'react'

type ButtonType = {
  buttonText?: string

  /** Style props */
  buttonMinWidth?: CSSProperties['minWidth']

  /** Action props */
  onButtonContainerClick?: () => void

  disabled?: boolean
}

const Button: FunctionComponent<ButtonType> = memo(
  ({
    buttonText = 'View Orders',
    onButtonContainerClick,
    buttonMinWidth,
    disabled,
  }) => {
    const buttonStyle: CSSProperties = useMemo(() => {
      return {
        minWidth: buttonMinWidth,
      }
    }, [buttonMinWidth])

    if (disabled) {
      // returns empty div to prevent click event
      return (
        <div
          className='bg-gray-500 flex flex-col items-start justify-start py-2.5 px-[15px] text-sm text-white font-aleo border-[1px] border-solid border-black cursor-not-allowed text-center'
          style={buttonStyle}
        >
          <div className='relative w-full'>{buttonText}</div>
        </div>
      )
    }

    return (
      <div
        className='bg-gray-100 flex flex-col items-start justify-start py-2.5 px-[15px] text-sm text-white font-aleo border-[1px] border-solid border-black cursor-pointer text-center'
        onClick={onButtonContainerClick}
        style={buttonStyle}
      >
        <div className='relative w-full'>{buttonText}</div>
      </div>
    )
  },
)

export default Button
