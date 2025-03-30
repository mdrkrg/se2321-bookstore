import type { OrderItem } from '@/lib/models/user'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { ConfirmOrder } from './confirm-order'

interface OrderPopupProps extends React.ComponentProps<'div'> {
  orderList: OrderItem[]
}

export function OrderPopup({ children, orderList }: OrderPopupProps) {
  const meta = {
    title: '确认订单',
    description: '请确认订单物品、数量及收货地址是否正确。',
  }

  const [open, setOpen] = useState(false)
  const [useDialog, setUseDialog] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 640px)')

  useEffect(() => {
    if (!open) {
      setUseDialog(isDesktop)
    }
  }, [open])

  const dialog = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{meta.title}</DialogTitle>
          <DialogDescription>
            {meta.description}
          </DialogDescription>
        </DialogHeader>
        <ConfirmOrder orderList={orderList} />
      </DialogContent>
    </Dialog>
  )

  const drawer = (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="w-[100vw]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{meta.title}</DrawerTitle>
          <DrawerDescription>
            {meta.description}
          </DrawerDescription>
        </DrawerHeader>
        <ConfirmOrder className="px-4" orderList={orderList} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">取消</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )

  return useDialog ? dialog : drawer
}
