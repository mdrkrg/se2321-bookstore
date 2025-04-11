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
import { ScrollArea } from '@/components/ui/scroll-area'
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

  // set whether use dialog or not only when it's out of view
  useEffect(() => {
    if (!open) {
      setUseDialog(isDesktop)
    }
  }, [open, isDesktop])

  if (orderList.length === 0)
    return children

  const dialog = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="md:max-w-[75vw] lg:max-w-[50vw]">
        <DialogHeader>
          <DialogTitle>{meta.title}</DialogTitle>
          <DialogDescription>
            {meta.description}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <ConfirmOrder orderList={orderList} />
        </ScrollArea>
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
        <ScrollArea>
          <ConfirmOrder
            className="px-4 text-sm max-h-[75vh]"
            orderList={orderList}
          />
        </ScrollArea>
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
