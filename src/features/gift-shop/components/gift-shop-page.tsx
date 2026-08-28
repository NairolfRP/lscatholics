import { useState } from 'react'
import { ShoppingCartIcon } from 'lucide-react'
import { GiftShopCart } from '#/features/gift-shop/components/gift-shop-cart.tsx'
import { GiftShopCatalog } from '#/features/gift-shop/components/gift-shop-catalog.tsx'
import { useGiftShopCart } from '#/features/gift-shop/hooks/use-gift-shop-cart.ts'
import { Button } from '#shared/components/ui/button.tsx'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '#shared/components/ui/responsive-dialog.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import Hero from '#shared/layouts/app/components/hero.tsx'

export function GiftShopPage() {
  const cart = useGiftShopCart()
  const [isCartOpen, setCartOpen] = useState(false)

  const quantities = new Map(cart.lines.map((line) => [line.productId, line.quantity]))

  return (
    <>
      <Hero
        variant="minimal"
        title={<Typography variant="h1">Boutique de la Cathédrale</Typography>}
        subtitle="La Boutique de la Cathédrale Notre-Dame-des-Saints propose des objets religieux et des produits des monastères, mais aussi des souvenirs de vos visites à la Cathédrale Notre-Dame-des-Saints."
        backgroundColor="bg-[#577CAD] dark:bg-[#233552]"
      />

      <div className="bg-[#F4AE2A] px-4 py-2.5 text-center text-lg font-semibold text-black dark:bg-[#aa791e] dark:text-white/90">
        100% des achats sont au profit de l'Église catholique, de sa mission et de la préservation
        de ses édifices
      </div>

      <section className="container mx-auto max-w-screen-2xl px-4 pt-12 pb-16 sm:px-6 lg:px-8">
        <GiftShopCatalog
          onAdd={cart.addItem}
          onSetQuantity={cart.setQuantity}
          onRemove={cart.removeItem}
          quantities={quantities}
          cartTrigger={
            cart.totalQuantity > 0 ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="relative shrink-0"
                aria-label="Voir le panier"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCartIcon />
                <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {cart.totalQuantity}
                </span>
              </Button>
            ) : undefined
          }
          aside={
            cart.totalQuantity > 0 ? (
              <Button type="button" size="lg" className="w-full" onClick={() => setCartOpen(true)}>
                <ShoppingCartIcon />
                Voir le panier
                <span className="ml-auto grid size-6 place-items-center rounded-full bg-background text-sm font-bold text-primary">
                  {cart.totalQuantity}
                </span>
              </Button>
            ) : undefined
          }
        />

        <ResponsiveDialog open={isCartOpen} onOpenChange={setCartOpen}>
          <ResponsiveDialogContent className="sm:max-w-lg">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Votre panier</ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                Révisez vos articles puis payez l'ensemble de votre commande.
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>

            <GiftShopCart
              lines={cart.lines}
              total={cart.total}
              className="px-4 pt-4 pb-6 sm:px-6 md:px-0 md:pt-0 md:pb-0"
              onSetQuantity={cart.setQuantity}
              onRemove={cart.removeItem}
              onClearCart={cart.clearCart}
            />
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      </section>
    </>
  )
}
