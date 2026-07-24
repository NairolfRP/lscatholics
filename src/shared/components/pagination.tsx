import { useSearch } from '@tanstack/react-router'
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationRoot,
} from '#/shared/components/ui/pagination'

/**
 * Drop-in pagination, driven entirely by the URL.
 *
 *   <Pagination totalPages={pageCount} />
 *
 * Reads the current page from the active route's search params and writes
 * new page values back the same way, so it works with SSR, the back button,
 * and shareable URLs. Renders nothing when there's only one page.
 *
 * Two paginated lists on the same route? Give each one its own `pageParam`.
 */
export type PaginationProps = {
  /** Total number of pages. */
  totalPages: number
  /** Search param key holding the page number. Default: "page". */
  pageParam?: string
  /** Page links shown on each side of the current page. Default: 1. */
  siblingCount?: number
  /** Page links always shown at the start/end. Default: 1. */
  boundaryCount?: number
  /** Show the Previous/Next controls. Default: true. */
  showPreviousNext?: boolean
  /** Override the "Previous" label (e.g. for i18n/RTL). */
  previousText?: string
  /** Override the "Next" label (e.g. for i18n/RTL). */
  nextText?: string
  /** Replace history instead of pushing a new entry. Default: false. */
  replace?: boolean
  className?: string
}

type PaginationToken = number | 'start-ellipsis' | 'end-ellipsis'

function range(start: number, end: number): number[] {
  if (end < start) return []
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

function getPaginationItems(
  page: number,
  count: number,
  siblingCount: number,
  boundaryCount: number
): PaginationToken[] {
  const startPages = range(1, Math.min(boundaryCount, count))
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count)

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  )
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : count - 1
  )

  return [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? (['start-ellipsis'] as const)
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < count - boundaryCount - 1
      ? (['end-ellipsis'] as const)
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),
    ...endPages,
  ]
}

export function Pagination({
  totalPages,
  pageParam = 'page',
  siblingCount = 1,
  boundaryCount = 1,
  showPreviousNext = true,
  previousText,
  nextText,
  replace = false,
  className,
}: PaginationProps) {
  const search = useSearch({ strict: false })
  const rawPage = Number(search[pageParam as keyof typeof search])
  const currentPage =
    Number.isFinite(rawPage) && rawPage >= 1 ? Math.min(Math.trunc(rawPage), totalPages) : 1

  if (totalPages <= 1) return null

  const items = getPaginationItems(currentPage, totalPages, siblingCount, boundaryCount)
  const previousPage = Math.max(currentPage - 1, 1)
  const nextPage = Math.min(currentPage + 1, totalPages)

  const searchFor = (targetPage: number) => (prev: Record<string, unknown>) => ({
    ...prev,
    [pageParam]: targetPage === 1 ? undefined : targetPage,
  })

  return (
    <PaginationRoot className={className}>
      <PaginationContent>
        {showPreviousNext && (
          <PaginationItem>
            <PaginationPrevious
              to="."
              search={searchFor(previousPage)}
              replace={replace}
              preload={false}
              text={previousText}
              aria-disabled={previousPage === currentPage}
              disabled={previousPage === currentPage}
              className={
                previousPage === currentPage ? 'pointer-events-none opacity-50' : undefined
              }
            />
          </PaginationItem>
        )}

        {items.map((item, index) =>
          typeof item === 'number' ? (
            <PaginationItem key={item}>
              <PaginationLink
                to="."
                search={searchFor(item)}
                replace={replace}
                preload={false}
                isActive={item === currentPage}
                aria-disabled={item === currentPage}
                disabled={item === currentPage}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={`${item}-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}

        {showPreviousNext && (
          <PaginationItem>
            <PaginationNext
              to="."
              search={searchFor(nextPage)}
              replace={replace}
              preload={false}
              text={nextText}
              aria-disabled={nextPage === currentPage}
              disabled={nextPage === currentPage}
              className={nextPage === currentPage ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationRoot>
  )
}
