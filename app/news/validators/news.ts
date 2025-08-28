import vine from '@vinejs/vine'

export const createNewsSearchParamsValidator = vine.compile(
  vine.object({
    page: vine
      .number()
      .range([1, 1000])
      .withoutDecimals()
      .parse((v) => v ?? 1),
    category: vine.string().optional(),
  })
)
