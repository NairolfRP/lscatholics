import type { RegisteredRouter, ValidateLinkOptions } from '@tanstack/react-router'

export type RoutePath<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TOptions = unknown,
> = ValidateLinkOptions<TRouter, TOptions>['to']

export type RouteParams<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TOptions = unknown,
> = ValidateLinkOptions<TRouter, TOptions>['params']
