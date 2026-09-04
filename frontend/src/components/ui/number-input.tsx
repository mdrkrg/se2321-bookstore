import { ChevronDown, ChevronUp } from 'lucide-react'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { Button } from './button'
import { Input } from './input'
import { cn } from '@/lib/utils/cn'

export interface NumberInputProps
  extends Omit<NumericFormatProps, 'value' | 'onValueChange'> {
  stepper?: number
  thousandSeparator?: string
  placeholder?: string
  defaultValue?: number
  min?: number
  max?: number
  value?: number // Controlled value
  suffix?: string
  prefix?: string
  onValueChange?: (value: number | undefined) => void
  fixedDecimalScale?: boolean
  decimalScale?: number
  inputStyle?: string
}

// eslint-disable-next-line react/display-name
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      stepper,
      thousandSeparator,
      placeholder,
      defaultValue,
      min = -Infinity,
      max = Infinity,
      onValueChange,
      fixedDecimalScale = false,
      decimalScale = 0,
      suffix,
      prefix,
      value: controlledValue,
      inputStyle,
      disabled,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState<number | undefined>(
      controlledValue ?? defaultValue
    )

    const handleIncrement = useCallback(() => {
      setValue((prev) =>
        prev === undefined ? stepper ?? 1 : Math.min(prev + (stepper ?? 1), max)
      )
    }, [stepper, max])

    const handleDecrement = useCallback(() => {
      setValue((prev) =>
        prev === undefined
          ? -(stepper ?? 1)
          : Math.max(prev - (stepper ?? 1), min)
      )
    }, [stepper, min])

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          ref && document.activeElement ===
          (ref as React.RefObject<HTMLInputElement>).current
        ) {
          if (e.key === 'ArrowUp') {
            handleIncrement()
          } else if (e.key === 'ArrowDown') {
            handleDecrement()
          }
        }
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }, [handleIncrement, handleDecrement, ref])

    useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue)
      }
    }, [controlledValue])

    const handleChange = (values: {
      value: string
      floatValue: number | undefined
    }) => {
      const newValue =
        values.floatValue === undefined ? undefined : values.floatValue
      setValue(newValue)
      if (onValueChange) {
        onValueChange(newValue)
      }
    }

    const handleBlur = () => {
      if (value !== undefined) {
        if (value < min) {
          setValue(min)
            (ref as React.RefObject<HTMLInputElement>).current!.value =
            String(min)
        } else if (value > max) {
          setValue(max)
            (ref as React.RefObject<HTMLInputElement>).current!.value =
            String(max)
        }
      }
    }

    const {
      className: containerClassName,
      ...propsRest
    } = props

    const containerStyle = cn(
      "flex items-center",
      containerClassName,
    )

    const numberInputStyle = cn(
      `[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
      rounded-r-none relative ring-0 focus-visible:ring-offset-0 focus-visible:ring-0`,
      inputStyle,
    )

    return (
      <div className={containerStyle}>
        <NumericFormat
          value={value}
          onValueChange={handleChange}
          thousandSeparator={thousandSeparator}
          decimalScale={decimalScale}
          fixedDecimalScale={fixedDecimalScale}
          allowNegative={min < 0}
          valueIsNumericString
          onBlur={handleBlur}
          max={max}
          min={min}
          disabled={disabled}
          suffix={suffix}
          prefix={prefix}
          customInput={Input}
          placeholder={placeholder}
          className={numberInputStyle}
          getInputRef={ref}
          {...propsRest}
        />

        <div className="flex flex-col">
          <Button
            type="button"
            aria-label="Increase value"
            className="px-2 h-5 rounded-l-none rounded-br-none border-input border-l-0 border-b-[0.5px] focus-visible:relative"
            variant="outline"
            onClick={handleIncrement}
            disabled={disabled || value === max}
          >
            <ChevronUp size={15} />
          </Button>
          <Button
            type="button"
            aria-label="Decrease value"
            className="px-2 h-5 rounded-l-none rounded-tr-none border-input border-l-0 border-t-[0.5px] focus-visible:relative"
            variant="outline"
            onClick={handleDecrement}
            disabled={disabled || value === min}
          >
            <ChevronDown size={15} />
          </Button>
        </div>
      </div>
    )
  }
)
