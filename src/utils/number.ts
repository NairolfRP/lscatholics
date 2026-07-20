export function formatNumber(nb: string | number, locale: string = 'fr-FR') {
  return new Intl.NumberFormat(locale).format(Number(nb))
}
