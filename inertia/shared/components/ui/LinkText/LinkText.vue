<script lang="ts" setup>
import type { AnchorHTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { type InertiaLinkProps, Link } from '@inertiajs/vue3'
import { urlFor } from '@/client'
import type { InferRoutes, QueryParameters } from '@tuyau/core/types'
import type { registry } from '@generated/registry'

type BaseProps = {
  route?: keyof InferRoutes<typeof registry>
  params?: {
    params: readonly [string | number]
    query?: QueryParameters
  }
  class?: string
}

type ExternalProps = /* @vue-ignore */ AnchorHTMLAttributes & BaseProps & { external: true }
type InternalProps = InertiaLinkProps &
  BaseProps & {
    external?: false | undefined
  }

type Props = ExternalProps | InternalProps
const props = defineProps<Props>()
</script>
<template>
  <component
    :is="props.external ? 'a' : Link"
    v-bind="props"
    :href="!props.external && props.route ? urlFor(props.route as any, props.params) : props.href"
    :class="cn('font-medium text-primary underline underline-offset-4 cursor-pointer', props.class)"
  >
    <slot />
  </component>
</template>
