import type { RouteParams, RoutePath } from '#/shared/types/route.types.ts'

export type InternalOrExternalPath<
  TRoute extends RoutePath = RoutePath,
  TRouteParams extends RouteParams = RouteParams,
> =
  | { href: string; to?: never; params?: never }
  | { to: TRoute; params?: TRouteParams; href?: never }
