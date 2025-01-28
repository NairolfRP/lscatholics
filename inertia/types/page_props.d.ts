import type { PageProps as InertiaPageProps } from "@inertiajs/core";
import type { SharedProps } from "@adonisjs/inertia/types";

export type PageProps<T = object> = T & InertiaPageProps & SharedProps;
