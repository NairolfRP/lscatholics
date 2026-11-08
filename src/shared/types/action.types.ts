export type ActionResult = { error: true; message?: string } | { error: false }

export type ActionReturnType = Promise<ActionResult>
