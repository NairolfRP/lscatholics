import type { ReactNode } from 'react'
import { useState } from 'react'
import { CheckIcon, ChevronDownIcon, MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import {
  GIFT_ORDER_QUANTITY_MAX,
  GIFT_SHOP_CATEGORIES,
  GIFT_SHOP_PRODUCTS,
} from '#/features/gift-shop/constants/gift-shop.constants.ts'
import type { GiftProduct } from '#/features/gift-shop/types/gift-shop.types.ts'
import { cn } from '#/shared/lib/utils'
import { formatNumber } from '#/utils/number.ts'
import { Button } from '#shared/components/ui/button.tsx'
import { Card, CardContent } from '#shared/components/ui/card.tsx'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '#shared/components/ui/responsive-dialog.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#shared/components/ui/tabs.tsx'

interface GiftShopCatalogProps {
  onAdd: (productId: string) => void
  onSetQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  aside?: ReactNode
  cartTrigger?: ReactNode
  quantities: ReadonlyMap<string, number>
}

export function GiftShopCatalog({
  onAdd,
  onSetQuantity,
  onRemove,
  aside,
  cartTrigger,
  quantities,
}: GiftShopCatalogProps) {
  const [activeCategory, setActiveCategory] = useState(GIFT_SHOP_CATEGORIES[0].id)
  const [isCategorySheetOpen, setCategorySheetOpen] = useState(false)

  const activeCategoryLabel =
    GIFT_SHOP_CATEGORIES.find((category) => category.id === activeCategory)?.label ?? ''

  return (
    <>
      <Tabs
        orientation="vertical"
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="flex-col gap-3 md:flex-row md:items-start md:gap-6"
      >
        <div className="sticky top-[var(--header-height)] z-30 mb-4 md:hidden">
          <div className="flex items-center gap-1 rounded-2xl bg-popover p-1 shadow-sm ring-1 ring-foreground/10">
            {cartTrigger}
            <Button
              type="button"
              variant="ghost"
              role="combobox"
              aria-expanded={isCategorySheetOpen}
              aria-controls="gift-shop-category-sheet"
              className="h-10 flex-1 justify-between gap-2 rounded-xl px-3 font-medium"
              onClick={() => setCategorySheetOpen(true)}
            >
              <span className="truncate">{activeCategoryLabel}</span>
              <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <div className="hidden w-full shrink-0 flex-col gap-3 self-start md:sticky md:top-(--header-height) md:flex md:w-56">
          {aside}
          <TabsList variant="line" className="w-full flex-nowrap">
            {GIFT_SHOP_CATEGORIES.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="justify-start">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {GIFT_SHOP_CATEGORIES.map((category) => (
          <TabsContent key={category.id} value={category.id} className="min-w-0 flex-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {GIFT_SHOP_PRODUCTS.filter((product) =>
                product.categoryIds.includes(category.id)
              ).map((product) => (
                <GiftShopCatalogCard
                  key={product.id}
                  product={product}
                  quantity={quantities.get(product.id) ?? 0}
                  onAdd={onAdd}
                  onSetQuantity={onSetQuantity}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <ResponsiveDialog open={isCategorySheetOpen} onOpenChange={setCategorySheetOpen}>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Choisir une catégorie</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Sélectionnez la catégorie d'articles à consulter.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <div
            id="gift-shop-category-sheet"
            className="flex flex-col gap-1 overflow-y-auto px-4 pb-6 sm:px-6"
          >
            {GIFT_SHOP_CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setActiveCategory(category.id)
                    setCategorySheetOpen(false)
                  }}
                  className={cn(
                    'flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-card-foreground hover:bg-muted'
                  )}
                >
                  {category.label}
                  {isActive && <CheckIcon className="size-4 shrink-0" />}
                </button>
              )
            })}
          </div>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  )
}

function GiftShopCatalogCard({
  product,
  quantity,
  onAdd,
  onSetQuantity,
  onRemove,
}: {
  product: GiftProduct
  quantity: number
  onAdd: (productId: string) => void
  onSetQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}) {
  const isAtMax = quantity >= GIFT_ORDER_QUANTITY_MAX

  return (
    <Card className="justify-between rounded-xl">
      <img
        src={product.imageSrc}
        alt={product.name}
        loading="lazy"
        decoding="async"
        className="aspect-square w-full bg-muted object-contain transition duration-500 hover:scale-105"
      />

      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <div className="font-semibold text-card-foreground">{product.name}</div>
          <div className="text-sm text-muted-foreground">{product.description}</div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-base font-semibold text-primary">{formatNumber(product.price)}$</div>
          {quantity === 0 ? (
            <Button type="button" variant="outline" size="sm" onClick={() => onAdd(product.id)}>
              <PlusIcon />
              Ajouter
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className="size-7 text-muted-foreground"
                  aria-label="Retirer un article du panier"
                  onClick={() => onSetQuantity(product.id, quantity - 1)}
                >
                  <MinusIcon />
                </Button>
                <span className="w-7 text-center text-sm font-semibold">{quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className="size-7 text-muted-foreground"
                  aria-label="Ajouter un article au panier"
                  disabled={isAtMax}
                  onClick={() => onSetQuantity(product.id, quantity + 1)}
                >
                  <PlusIcon />
                </Button>
              </div>
              <button
                type="button"
                onClick={() => onRemove(product.id)}
                aria-label={`Retirer ${product.name} du panier`}
                className="text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none"
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
