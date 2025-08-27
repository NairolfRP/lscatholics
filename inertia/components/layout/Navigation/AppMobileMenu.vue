<template>
  <Sheet v-model:open="mobileMenuOpen">
    <SheetTrigger class="lg:hidden py-5 px-10" as-child>
      <Button variant="ghost" size="icon">
        <Menu class="size-8" />
      </Button>
    </SheetTrigger>
    <SheetContent
      class="bg-primary-500 text-primary-foreground z-100 w-full h-full pb-20 overflow-y-scroll"
    >
      <SheetHeader>
        <SheetTitle><img alt="Logo" :src="Logo" class="w-20 h-20" /></SheetTitle>
        <SheetDescription></SheetDescription>
      </SheetHeader>
      <ul class="flex flex-col gap-10">
        <li>
          <a
            @click="handleNavigate('home')"
            class="mobile-navigation-item-title flex gap-2 items-center"
          >
            <House /> Accueil
          </a>
        </li>
        <li v-for="item in MENU_ITEMS">
          <template v-if="!item.children">
            <a
              v-if="item.route"
              @click="handleNavigate(item.route, item.routeParams)"
              class="mobile-navigation-item-title block"
            >
              {{ item.label }}
            </a>
            <a
              v-else
              :href="item.href"
              :target="item.target"
              class="mobile-navigation-item-title block"
            >
              {{ item.label }}
            </a>
          </template>
          <template v-else-if="item.children">
            <Accordion type="single" collapsible>
              <AccordionItem :value="`mobile-nav-${item.id}-submenu`">
                <AccordionTrigger class="mobile-navigation-item-title">
                  {{ item.label }}
                </AccordionTrigger>
                <AccordionContent class="bg-primary pl-5 flex flex-col gap-5 mt-3 py-4">
                  <template v-for="subItem in item.children">
                    <template v-if="subItem.route || subItem.href">
                      <a
                        v-if="subItem.route"
                        @click="handleNavigate(subItem.route, subItem.routeParams)"
                        class="text-base pl-3"
                      >
                        {{ subItem.label }}
                      </a>
                      <a
                        v-else
                        :href="subItem.href"
                        :target="subItem.target"
                        class="text-base pl-3"
                      >
                        {{ subItem.label }}
                      </a>
                    </template>
                    <template v-else>{{ subItem.label }}</template>
                  </template>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </template>
        </li>
        <li class="px-5">
          <Button
            variant="secondary"
            class="mobile-navigation-item-title w-full"
            @click="handleNavigate('donate.index')"
          >
            <HandHeart /> Faire un don
          </Button>
        </li>
      </ul>
    </SheetContent>
  </Sheet>
</template>

<script lang="ts" setup>
import Logo from '@/assets/images/logo.png'
import { MENU_ITEMS } from '@/constants/menu.constants'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { HandHeart, House, Menu } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useRouter } from '@tuyau/inertia/vue'
import { ref } from 'vue'

const router = useRouter()

const mobileMenuOpen = ref<boolean>(false)
const toggleMobileMenu = () => (mobileMenuOpen.value = !mobileMenuOpen)

const handleNavigate = (route: string, routeParams?: Record<string, any>) => {
  router.visit({ route: route as never, params: routeParams as never })
  toggleMobileMenu()
}
</script>

<style>
.mobile-navigation-item-title {
  text-transform: uppercase;
  font-weight: var(--font-weight-black);
  color: var(--primary-foreground);
  font-size: var(--text-lg);
  margin: 0;
  padding: 0;
  padding-inline: calc(var(--spacing) * 5);
}

.mobile-navigation-item-title > button {
  color: var(--primary-foreground);
}
</style>
