<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
    :width="width"
    :height="height"
    :aria-labelledby="iconName"
    role="img"
    v-bind="$attrs"
    @click="handleClick"
  >
    <!-- <title :id="iconName" lang="en">{{ iconName }} icon</title> -->
    <g :style="{ fill: iconColor }">
      <slot />
    </g>
  </svg>
</template>
<script lang="ts" setup>
import { defaultIconProps, type IconProps } from '@/composables/use_icon_props'

const props = withDefaults(defineProps<IconProps>(), defaultIconProps)

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const handleClick = (e: MouseEvent) => {
  if (props.clickable) {
    emit('click', e)
  }
}
</script>
