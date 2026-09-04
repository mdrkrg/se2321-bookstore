import type { ReactNode } from '@tanstack/react-router'
import type { Control, FieldValues, Path, UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export interface InputFormItemProps extends React.ComponentProps<'input'> {
  formLabel: string | ReactNode
  formDescription?: string
  type?: React.HTMLInputTypeAttribute
}

export interface InputFormItems { [key: string]: InputFormItemProps }

interface RenderInputFormItemsProps<
  TFieldValues extends FieldValues,
  TFormItemKey extends Path<TFieldValues> & string,
  TItems extends Readonly<Record<TFormItemKey, InputFormItemProps>>,
> {
  form: UseFormReturn<TFieldValues>
  formItems: TItems
}

export function BulkInputFormItems<
  const TItems extends Record<string, InputFormItemProps>,
  TFormItemKey extends Path<TFieldValues> & string,
  TFieldValues extends FieldValues & { [K in Extract<keyof TItems, string>]?: any },
>({
  form,
  formItems,
}: RenderInputFormItemsProps<TFieldValues, TFormItemKey, TItems>): React.ReactElement {
  type FormItemName = Extract<keyof TItems, string>
  return (
    <>
      {(Object.entries(formItems) as [TFormItemKey, TItems[FormItemName]][]).map(([
        name,
        { formLabel, formDescription, ...inputProps },
      ]) => {
        return (
          <FormField
            key={name}
            control={form.control as Control<TFieldValues>}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex leading-[normal]!">{formLabel}</FormLabel>
                {formDescription && (
                  <FormDescription>
                    {formDescription}
                  </FormDescription>
                )}
                <FormControl>
                  <Input {...inputProps} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      })}
    </>
  )
}
