import { useEffect } from 'react'
import { ShoppingBagIcon } from 'lucide-react'
import { GiftShopFormSkeleton } from '#/features/gift-shop/components/gift-shop-form-skeleton.tsx'
import { GiftShopDetailsSection } from '#/features/gift-shop/components/sections/gift-shop-details-section.tsx'
import { GiftShopIdentitySection } from '#/features/gift-shop/components/sections/gift-shop-identity-section.tsx'
import { GiftShopOptionsSection } from '#/features/gift-shop/components/sections/gift-shop-options-section.tsx'
import { getGiftOrderDefaults } from '#/features/gift-shop/constants/gift-shop-defaults.ts'
import { GIFT_SHOP_PRODUCT_BY_ID } from '#/features/gift-shop/constants/gift-shop.constants.ts'
import type { GiftOrderInput } from '#/features/gift-shop/schemas/gift-shop.schema.ts'
import { giftOrderSchema } from '#/features/gift-shop/schemas/gift-shop.schema.ts'
import { createGiftOrderFn } from '#/features/gift-shop/server-fn/gift-shop.functions.ts'
import type { GiftShopCartEntry } from '#/features/gift-shop/types/gift-shop.types.ts'
import { formatNumber } from '#/utils/number.ts'
import { FieldGroup } from '#shared/components/ui/field.tsx'
import { toast } from '#shared/components/ui/toast.tsx'
import { useGameContext } from '#shared/hooks/use-game-context.ts'
import { usePaymentPopup } from '#shared/hooks/use-payment-popup.ts'
import { useAppForm } from '#shared/integrations/form/form-hook.ts'

interface GiftShopCheckoutFormProps {
  cartEntries: GiftShopCartEntry[]
  onClearCart: () => void
  onClose: () => void
}

export function GiftShopCheckoutForm({
  cartEntries,
  onClearCart,
  onClose,
}: GiftShopCheckoutFormProps) {
  const { currentCharacter, isLoading } = useGameContext()
  const { openPayment, preparePaymentPopup, disposePaymentPopup } = usePaymentPopup()

  const form = useAppForm({
    formId: 'gift-shop-checkout-form',
    validators: {
      onChange: giftOrderSchema,
      onSubmit: giftOrderSchema,
    },
    defaultValues: getGiftOrderDefaults(currentCharacter),
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = await createGiftOrderFn({ data: value })

        if (!result.success) {
          if (result.validationErrors) {
            disposePaymentPopup()
            return formApi.setErrorMap({
              onServer: {
                fields: result.validationErrors,
              },
            } as unknown as Parameters<typeof formApi.setErrorMap>[0])
          }

          disposePaymentPopup()
          return toast.add({
            type: 'error',
            title: result.error || 'Une erreur est survenue',
          })
        }

        if (!result.paymentUrl) {
          disposePaymentPopup()
          return toast.add({
            type: 'error',
            title: 'Échec',
            description: "Impossible de récupérer l'URL pour le paiement",
          })
        }

        openPayment(result.paymentUrl, () => {
          formApi.reset()
          onClearCart()
          onClose()
        })
      } catch {
        disposePaymentPopup()
        toast.add({ type: 'error', title: 'Une erreur est survenue' })
      }
    },
  })

  useEffect(() => {
    form.setFieldValue('items', cartEntries)
  }, [form, cartEntries])

  if (isLoading) {
    return <GiftShopFormSkeleton />
  }

  return (
    <form
      id={form.formId}
      onSubmit={(e) => {
        e.preventDefault()
        preparePaymentPopup()
        void form.handleSubmit().catch(() => disposePaymentPopup())
      }}
      className="contents"
    >
      <FieldGroup>
        <GiftShopIdentitySection form={form} currentCharacter={currentCharacter} />
        <GiftShopDetailsSection form={form} />
        <GiftShopOptionsSection form={form} />
      </FieldGroup>

      <div className="flex flex-col-reverse gap-2 pt-5 sm:flex-row sm:justify-end">
        <form.AppForm>
          <form.SubmitButton
            label={(state) => {
              const { values } = state as { values: GiftOrderInput }
              const total = values.items.reduce((sum, item) => {
                const product = GIFT_SHOP_PRODUCT_BY_ID.get(item.productId)
                return product ? sum + product.price * item.quantity : sum
              }, 0)

              return total > 0 ? (
                <>
                  <ShoppingBagIcon /> Régler {formatNumber(total)}$
                </>
              ) : (
                <>
                  <ShoppingBagIcon /> Commander
                </>
              )
            }}
            submittingLabel="Attente du paiement..."
            size="lg"
            className="w-full sm:w-auto"
          />
        </form.AppForm>
      </div>
    </form>
  )
}
