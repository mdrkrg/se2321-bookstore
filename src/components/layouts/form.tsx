import type { ReactNode } from 'react'
import type { ControllerRenderProps, FieldValues, Path, UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export interface FormItemDefinition<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  formLabel: string | ReactNode
  formDescription?: string
  render: (props: { field: ControllerRenderProps<TFieldValues, TName> }) => ReactNode
}

// map over each key in form schema `TFieldValues`
// for each key, create an optional property with FormItemDefinition
export type FormItems<TFieldValues extends FieldValues> = {
  [TName in Path<TFieldValues>]?: FormItemDefinition<TFieldValues, TName>
}

export function BulkFormItems<
  TFieldValues extends FieldValues,
>({
  form,
  formItems,
}: {
  form: UseFormReturn<TFieldValues>
  formItems: FormItems<TFieldValues>
}): React.ReactElement {
  const formItemKeys = Object.keys(formItems) as Path<TFieldValues>[]

  return (
    <>
      {formItemKeys.map((name) => {
        const itemDefinition = formItems[name]

        // should not happen
        if (!itemDefinition) {
          return null
        }

        const { formLabel, formDescription, render: renderComponent } = itemDefinition

        return (
          <FormField
            key={name}
            control={form.control}
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
                  {renderComponent({ field })}
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
