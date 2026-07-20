import type { PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/shared/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '#/shared/components/ui/drawer'
import { useMediaQuery } from '#/shared/hooks/use-media-query'
import type { PropsWithChildrenAndRender } from '#/shared/lib/types/props'

const ModeCtx = createContext('dialog')

export function ResponsiveDialog({
  open,
  onOpenChange,
  children,
}: PropsWithChildren<{ open?: boolean; onOpenChange?: (open: boolean) => void }>) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <ModeCtx.Provider value="dialog">
        <Dialog open={open} onOpenChange={onOpenChange}>
          {children}
        </Dialog>
      </ModeCtx.Provider>
    )
  }

  return (
    <ModeCtx.Provider value="drawer">
      <Drawer open={open} onOpenChange={onOpenChange}>
        {children}
      </Drawer>
    </ModeCtx.Provider>
  )
}

export function ResponsiveDialogTrigger({ children, render }: PropsWithChildrenAndRender) {
  const mode = useContext(ModeCtx)
  if (mode === 'dialog') {
    return <DialogTrigger render={render}>{children}</DialogTrigger>
  }

  if (render) {
    return <DrawerTrigger render={render}>children</DrawerTrigger>
  }

  return <DrawerTrigger>{children}</DrawerTrigger>
}

export function ResponsiveDialogContent({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const mode = useContext(ModeCtx)
  if (mode === 'dialog') {
    return <DialogContent className={className}>{children}</DialogContent>
  }
  return <DrawerContent className={className}>{children}</DrawerContent>
}

export function ResponsiveDialogHeader({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const mode = useContext(ModeCtx)
  if (mode === 'dialog') {
    return <DialogHeader className={className}>{children}</DialogHeader>
  }
  return <DrawerHeader className={className}>{children}</DrawerHeader>
}

export function ResponsiveDialogTitle({ children }: PropsWithChildren) {
  const mode = useContext(ModeCtx)
  if (mode === 'dialog') {
    return <DialogTitle>{children}</DialogTitle>
  }
  return <DrawerTitle>{children}</DrawerTitle>
}

export function ResponsiveDialogDescription({ children }: PropsWithChildren) {
  const mode = useContext(ModeCtx)
  if (mode === 'dialog') {
    return <DialogDescription>{children}</DialogDescription>
  }
  return <DrawerDescription>{children}</DrawerDescription>
}

export function ResponsiveDialogFooter({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const mode = useContext(ModeCtx)
  if (mode === 'dialog') {
    return <DialogFooter className={className}>{children}</DialogFooter>
  }
  return <DrawerFooter className={className}>{children}</DrawerFooter>
}

export function ResponsiveDialogClose({ children, render }: PropsWithChildrenAndRender) {
  const mode = useContext(ModeCtx)
  if (mode === 'drawer') {
    if (render) {
      return <DrawerClose render={render}>{children}</DrawerClose>
    }

    return <DrawerClose>{children}</DrawerClose>
  }

  return <DialogClose render={render}>{children}</DialogClose>
}
