<template>
  <NavigationMenu
    class="hidden lg:flex w-full justify-end uppercase leading-none z-99"
    role="navigation"
    aria-label="Main navigation"
    v-model="submenuOpen"
  >
    <NavigationMenuList>
      <NavigationMenuItem v-for="item in MENU_ITEMS" :key="`nav-item-${item.id}`">
        <template v-if="item.children">
          <NavigationMenuTrigger :class="triggerButtonClasses">{{
            item.label
          }}</NavigationMenuTrigger>

          <NavigationMenuContent>
            <div :class="getSubmenuClasses(item.children.length)">
              <template
                v-for="subItem in item.children"
                :key="`nav-item-${item.id}-subitem-${subItem.id}`"
              >
                <NavigationLink
                  v-if="subItem.route"
                  :route="subItem.route"
                  :route-params="subItem.routeParams"
                  :title="subItem.label"
                  @click="closeSubmenus()"
                />
                <NavigationLink
                  v-else-if="subItem.href"
                  :href="subItem.href"
                  :title="subItem.label"
                />
              </template>
            </div>
          </NavigationMenuContent>
        </template>

        <NavigationMenuLink :class="triggerButtonClasses" v-else-if="hasLink(item)" as-child>
          <Link v-if="item.route" :route="item.route as never" :params="item.routeParams as []">
            {{ item.label }}</Link
          >
          <a
            v-else-if="item.href"
            :href="item.href"
            :target="item.target"
            :rel="getRelAttribute(item)"
            >{{ item.label }}</a
          >
        </NavigationMenuLink>

        <NavigationMenuLink v-else>
          {{ item.label }}
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <Button
          variant="secondary"
          class="py-4 laptop:py-7 hover:bg-primary text-sm laptop:text-base font-bold"
          as-child
        >
          <Link route="donate.index" aria-label="Make a donation">
            <HandHeart aria-hidden="true" />
            Donner
          </Link>
        </Button>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>

<script setup lang="ts">
import { MENU_ITEMS, type MenuItem } from '@/shared/constants/menu.constants'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/shared/components/ui/navigation-menu'
import { HandHeart } from 'lucide-vue-next'
import NavigationLink from '@/shared/components/NavigationLink.vue'
import { Link } from '@adonisjs/inertia/vue'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/lib/utils'
import { ref } from 'vue'

const submenuOpen = ref<string | undefined>(undefined)
const closeSubmenus = () => (submenuOpen.value = undefined)

const GRID_CONFIG = {
  BASE_CLASSES: 'gap-3 p-6 grid w-[48rem]',
  SMALL_THRESHOLD: 4,
  MEDIUM_THRESHOLD: 6,
  COLUMNS: 3,
  GRID_ROWS: {
    1: 'grid-rows-1',
    2: 'grid-rows-2',
    3: 'grid-rows-3',
    4: 'grid-rows-4',
    5: 'grid-rows-5',
    6: 'grid-rows-6',
  },
} as const

const triggerButtonClasses = cn(
  navigationMenuTriggerStyle(),
  'nav-trigger-button',
  'bg-transparent text-primary-foreground font-black pb-0 uppercase text-sm laptop:text-base transition-colors duration-200 ease-in-out'
)

const hasLink = (item: MenuItem): boolean => {
  return Boolean(item.route || item.href)
}

const getRelAttribute = (item: MenuItem): string | undefined => {
  if (item.target === '_blank') {
    return 'noopener noreferrer'
  }
  return undefined
}

const getSubmenuClasses = (count: number): string => {
  if (count <= 0) return GRID_CONFIG.BASE_CLASSES

  if (count <= GRID_CONFIG.SMALL_THRESHOLD) {
    return GRID_CONFIG.BASE_CLASSES
  }

  if (count <= GRID_CONFIG.MEDIUM_THRESHOLD) {
    return `${GRID_CONFIG.BASE_CLASSES} grid-flow-col ${GRID_CONFIG.GRID_ROWS[4]}`
  }

  const rows = Math.min(Math.ceil(count / GRID_CONFIG.COLUMNS), 6)
  const gridRowsClass =
    GRID_CONFIG.GRID_ROWS[rows as keyof typeof GRID_CONFIG.GRID_ROWS] || GRID_CONFIG.GRID_ROWS[6]

  return `${GRID_CONFIG.BASE_CLASSES} grid-flow-col ${gridRowsClass}`
}
</script>

<style>
.nav-trigger-button:hover,
.nav-trigger-button:focus,
.nav-trigger-button[data-state='open'],
.nav-trigger-button[data-state='open']:hover,
.nav-trigger-button[data-state='open']:focus {
  background-color: transparent;
  color: var(--accent);
}

.nav-trigger-button:hover:before {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 0.625rem;
  background: var(--primary);
  content: '';
  -webkit-transform: translate(0, -105%);
  -ms-transform: translate(0, -105%);
  transform: translate(0, -105%);
}
</style>
