import type { ConfirmDialogOptions } from '#/shared/components/callable/confirm-dialog'
import { ConfirmDialog } from '#/shared/components/callable/confirm-dialog'
import type { ActionResult } from '#/shared/types/action.types'

export function confirmAction(
  options: ConfirmDialogOptions,
  action: () => ActionResult | Promise<ActionResult>
): Promise<boolean> {
  return ConfirmDialog.call({ ...options, action })
}
