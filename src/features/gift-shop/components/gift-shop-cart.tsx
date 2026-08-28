import { useEffect, useState } from 'react'
import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area'
import {
  MinusIcon,
  PlusIcon,
  RotateCcwIcon,
  ShoppingBagIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react'
import { GiftShopCheckoutForm } from '#/features/gift-shop/components/gift-shop-checkout-form.tsx'
import { GIFT_ORDER_QUANTITY_MAX } from '#/features/gift-shop/constants/gift-shop.constants.ts'
import type { GiftCartLine } from '#/features/gift-shop/hooks/use-gift-shop-cart.ts'
import { useMediaQuery } from '#/shared/hooks/use-media-query'
import { formatNumber } from '#/utils/number.ts'
import { Button } from '#shared/components/ui/button.tsx'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '#shared/components/ui/drawer.tsx'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '#shared/components/ui/responsive-dialog.tsx'
import { ScrollBar } from '#shared/components/ui/scroll-area.tsx'
import { cn } from '#shared/lib/utils.ts'

const QUANTITY_STEPPER_CLASSNAME = 'size-8 text-muted-foreground md:size-7'

interface GiftShopCartProps {
  lines: GiftCartLine[]
  total: number
  className?: string
  onSetQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onClearCart: () => void
}

export function GiftShopCart({
  lines,
  total,
  className,
  onSetQuantity,
  onRemove,
  onClearCart,
}: GiftShopCartProps) {
  const [isCheckoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutIteration, setCheckoutIteration] = useState(0)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const openCheckout = () => {
    setCheckoutIteration((iteration) => iteration + 1)
    setCheckoutOpen(true)
  }

  const entries = lines.map((line) => ({ productId: line.productId, quantity: line.quantity }))
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)

  return (
    <div className={cn('flex flex-col gap-5 overflow-y-auto', className)}>
      {lines.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Votre panier est vide. Ajoutez des articles depuis le catalogue pour commencer.
        </p>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {itemCount} article{itemCount > 1 ? 's' : ''}
            </p>
            <button
              type="button"
              onClick={onClearCart}
              aria-label="Réinitialiser le panier"
              className="flex h-9 items-center gap-1.5 rounded-md border border-input px-2.5 text-sm font-medium text-muted-foreground shadow-xs transition-colors hover:bg-muted hover:text-destructive focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <RotateCcwIcon className="size-4" />
              Réinitialiser
            </button>
          </div>

          <ScrollAreaPrimitive.Root data-slot="scroll-area" className="relative h-72 md:h-64">
            <ScrollAreaPrimitive.Viewport
              data-slot="scroll-area-viewport"
              aria-label="Articles dans le panier"
              className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
            >
              <ScrollAreaPrimitive.Content data-slot="scroll-area-content">
                <ul className="flex flex-col gap-5 pr-3 md:gap-4">
                  {lines.map((line) => (
                    <li key={line.productId} className="flex flex-col gap-3 py-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-medium">{line.product.name}</div>
                        <button
                          type="button"
                          onClick={() => onRemove(line.productId)}
                          aria-label={`Retirer ${line.product.name} du panier`}
                          className="-m-1 flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                          <Trash2Icon className="size-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            className={QUANTITY_STEPPER_CLASSNAME}
                            aria-label="Diminuer la quantité"
                            onClick={() => onSetQuantity(line.productId, line.quantity - 1)}
                          >
                            <MinusIcon />
                          </Button>
                          <QuantityInput
                            value={line.quantity}
                            onCommit={(quantity) => onSetQuantity(line.productId, quantity)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            className={QUANTITY_STEPPER_CLASSNAME}
                            aria-label="Augmenter la quantité"
                            onClick={() => onSetQuantity(line.productId, line.quantity + 1)}
                          >
                            <PlusIcon />
                          </Button>
                        </div>

                        <div className="text-sm font-semibold">{formatNumber(line.lineTotal)}$</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollAreaPrimitive.Content>
            </ScrollAreaPrimitive.Viewport>
            <ScrollBar
              keepMounted
              className="opacity-0 transition data-horizontal:data-[has-overflow-x]:opacity-100 data-vertical:data-[has-overflow-y]:opacity-100"
            />
          </ScrollAreaPrimitive.Root>

          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Total</span>
              <span className="text-lg font-bold">{formatNumber(total)}$</span>
            </div>

            <Button type="button" size="lg" onClick={openCheckout}>
              <ShoppingBagIcon />
              Régler
            </Button>
          </div>
        </>
      )}

      {isDesktop ? (
        <ResponsiveDialog open={isCheckoutOpen} onOpenChange={setCheckoutOpen}>
          <ResponsiveDialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Confirmer votre commande</ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                Indiquez vos informations puis payez l'ensemble de vos articles. Les personnels de
                la Boutique de la Cathédrale seront notifiés pour préparer votre commande. Seuls les
                champs marqués d'un astérisque sont obligatoires.
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>

            <GiftShopCheckoutForm
              key={checkoutIteration}
              cartEntries={entries}
              onClearCart={onClearCart}
              onClose={() => setCheckoutOpen(false)}
            />
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      ) : (
        <Drawer open={isCheckoutOpen} onOpenChange={setCheckoutOpen}>
          <DrawerContent
            className="data-[swipe-direction=down]:rounded-none data-[swipe-direction=down]:border-0"
            style={{
              height: '100dvh',
              maxHeight: '100dvh',
              width: '100vw',
              borderRadius: 0,
              border: 'none',
            }}
          >
            <DrawerHeader className="pr-14 text-left">
              <DrawerTitle>Confirmer votre commande</DrawerTitle>
              <DrawerDescription>
                Indiquez vos informations puis payez l'ensemble de vos articles. Les personnels de
                la Boutique de la Cathédrale seront notifiés pour préparer votre commande. Seuls les
                champs marqués d'un astérisque sont obligatoires.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerClose
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4"
                  aria-label="Fermer la confirmation de commande"
                />
              }
            >
              <XIcon />
            </DrawerClose>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-8 sm:px-6">
              <GiftShopCheckoutForm
                key={checkoutIteration}
                cartEntries={entries}
                onClearCart={onClearCart}
                onClose={() => setCheckoutOpen(false)}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}

function QuantityInput({
  value,
  onCommit,
}: {
  value: number
  onCommit: (quantity: number) => void
}) {
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    setDraft(String(value))
  }, [value])

  const commit = () => {
    const quantity = Number.parseInt(draft, 10)
    if (Number.isInteger(quantity) && quantity >= 1 && quantity <= GIFT_ORDER_QUANTITY_MAX) {
      onCommit(quantity)
    } else {
      setDraft(String(value))
    }
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      value={draft}
      aria-label="Quantité"
      onChange={(event) => {
        const next = event.target.value
        if (/^\d{0,2}$/.test(next)) setDraft(next)
      }}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur()
      }}
      className={cn(
        'h-8 w-14 rounded-md border border-input bg-transparent px-0 text-center font-mono text-sm shadow-xs outline-none md:h-7 md:w-12',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50'
      )}
    />
  )
}
