<template>
  <footer class="bg-catholic-purple text-white px-5 laptop:px-20">
    <!-- Main Footer -->
    <div class="container mx-auto py-12">
      <div class="grid mobile:grid-cols-2 md:grid-cols-4 gap-8">
        <!-- Navigation Links -->
        <div v-for="item in FOOTER_MENU_ITEMS" :key="`footer-menu-link-${item.id}`">
          <h4 class="font-semibold text-lg mb-4">{{ item.label }}</h4>
          <ul class="space-y-3 text-sm">
            <li
              v-for="subItem in item.children"
              :key="`footer-menu-link-${item.id}-subitem-${subItem.id}`"
            >
              <Link
                :route="subItem.route"
                class="opacity-80 hover:opacity-100 hover:text-catholic-gold transition-colors"
              >
                {{ subItem.label }}
              </Link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="font-semibold text-lg mb-4">Contact</h4>
          <div class="space-y-4 text-sm">
            <div class="flex items-start gap-3">
              <MapPin class="w-4 h-4 mt-0.5 text-catholic-gold flex-shrink-0" />
              <div>
                <p class="font-medium">Cathédrale Notre-Dame-des-Saints</p>
                <p class="opacity-80">Ginger Street, Little Seoul</p>
                <p class="opacity-80">Los Santos, SA 90010</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Phone class="w-4 h-4 text-catholic-gold flex-shrink-0" />
              <span class="opacity-80">700</span>
            </div>
          </div>
          <div class="flex justify-center md:justify-start gap-3 mt-7">
            <a
              :href="ARCHDIOCESE_FACEBROWSER_LINK"
              target="_blank"
              class="size-12 md:size-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-catholic-gold transition-colors"
            >
              <Facebrower class="size-8 md:size-4" />
            </a>
            <a
              :href="ARCHDIOCESE_DISCORD_LINK"
              target="_blank"
              class="size-12 md:size-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-catholic-gold transition-colors"
            >
              <Discord class="size-8 md:size-4" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Footer -->
    <div class="border-t border-white/20 mb-10 md:mb-0">
      <div class="container mx-auto md:px-4 py-6">
        <div class="md:flex md:items-center md:justify-between text-sm mb-4">
          <div class="text-center md:text-left opacity-80 mb-4 md:mb-0">
            <p>&copy; 2025 Archidiocèse de Los Santos. Tous droits réservés.</p>
          </div>
          <div class="flex flex-col flex-row gap-4 justify-center text-center md:text-left">
            <Link
              route="privacy"
              class="opacity-80 hover:opacity-100 hover:text-catholic-gold underline transition-colors"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
        <div class="text-center opacity-60 px-2 text-sm">
          (( Le contenu de ce site est entièrement fictif, dans le cadre d'un jeu de rôle. Il n'est
          ni affilié ni un produit officiel de
          <a href="https://gta.world/" target="_blank" class="underline">GTA World</a> ))
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { MapPin, Phone } from 'lucide-vue-next'
import Discord from '@/components/svg/Discord.vue'
import Facebrower from '@/components/svg/Facebrower.vue'
import { Link } from '@tuyau/inertia/vue'
import {
  ARCHDIOCESE_DISCORD_LINK,
  ARCHDIOCESE_FACEBROWSER_LINK,
} from '@/constants/archdiocese.constants'
import { FOOTER_MENU_ITEMS } from '@/constants/menu.constants'
</script>
