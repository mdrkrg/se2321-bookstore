import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import type { ControllerRenderProps } from 'react-hook-form'

interface ImageUploadPreviewProps {
  // field object from react-hook-form
  field: ControllerRenderProps<any, any>
  initialImageUrl?: string
}

export function ImageUploadPreview({ field, initialImageUrl }: ImageUploadPreviewProps) {
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null)

  // cleans up the blob URL to prevent memory leaks
  useEffect(() => {
    // If the field value is a File, create a preview URL.
    if (field.value instanceof File) {
      const objectUrl = URL.createObjectURL(field.value)
      setPreview(objectUrl)
      // When the component unmounts, revoke the blob URL.
      return () => URL.revokeObjectURL(objectUrl)
    }
    // If the field value is cleared or is not a file, show the initial image.
    setPreview(initialImageUrl || null)
  }, [field.value, initialImageUrl])

  return (
    <div className="flex flex-col gap-4">
      {/* current preview image */}
      {preview ? (
        <img
          src={preview}
          alt="Book cover preview"
          className="h-48 w-auto self-start rounded-md border object-contain"
        />
      ) : (
        <div className="flex h-48 w-32 items-center justify-center self-start rounded-md border bg-muted text-sm text-muted-foreground">
          暂无封面
        </div>
      )}
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          field.onChange(file)
        }}
        onBlur={field.onBlur}
        name={field.name}
        ref={field.ref}
      />
    </div>
  )
}
