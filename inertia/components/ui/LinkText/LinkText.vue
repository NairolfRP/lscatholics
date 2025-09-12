<script lang="ts" setup>
import type { AnchorHTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { type InertiaLinkProps, Link } from '@inertiajs/vue3'
import { tuyau } from '@/lib/tuyau'
import type { Api } from '@tuyau/inertia/types'
import type { QueryParameters } from '@tuyau/client'

type BaseProps = {
  route?: Api['routes'][number]['name']
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
    :href="!props.external && props.route ? tuyau.$url(props.route, props.params) : props.href"
    :class="cn('font-medium text-primary underline underline-offset-4 cursor-pointer', props.class)"
  >
    <slot />
  </component>
</template>
