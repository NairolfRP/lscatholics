import type { PropsWithChildren } from 'react'

export type PropsWithRender<P = unknown> = P & { render?: React.ReactElement }

export type PropsWithChildrenAndRender<P = unknown> = PropsWithChildren<PropsWithRender<P>>
