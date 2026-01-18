<template>
  <Head>
    <title>{{ title }}</title>

    <link rel="icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="manifest" href="/site.webmanifest" />

    <meta head-key="description" name="description" :content="props.description" />
    <meta head-key="author" name="author" content="NairolfRP" />

    <meta head-key="og:title" property="og:title" :content="fullPageTitle" />
    <meta head-key="og:description" property="og:description" :content="props.description" />
    <meta head-key="og:image" property="og:image" :content="imageUrl" />
    <meta head-key="og:url" property="og:url" :content="pageProps.url as string" />
    <meta head-key="og:type" property="og:type" content="website" />
    <meta property="og:site_name" content="Archidiocèse de Los Santos" />
    <meta head-key="og:locale" property="og:locale" content="fr_FR" />

    <meta head-key="twitter:card" property="twitter:card" content="summary" />
    <meta head-key="twitter:title" property="twitter:card" :content="fullPageTitle" />
    <meta
      head-key="twitter:description"
      property="twitter:description"
      :content="props.description"
    />
    <meta head-key="twitter:image" property="twitter:image" :content="imageUrl" />
    <meta head-key="twitter:creator" property="twitter:creator" content="NairolfRP" />
    <slot />
  </Head>
</template>
<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import Logo from '@/assets/images/logo.png'
import { usePageProps } from '@/shared/composables/use_page_props'
import { computed } from 'vue'

type Props = {
  title?: string
  description?: string
  image?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description:
    "Site internet fictif de l'Archidiocèse catholique romain de Los Santos, une faction roleplay sur le serveur GTA World France qui incarne l'Église catholique",
  image: Logo,
})

const pageProps = usePageProps()

const fullPageTitle = computed(() =>
  props.title ? `${props.title} - Archidiocèse de Los Santos` : 'Archidiocèse de Los Santos'
)

const imageUrl = computed(() =>
  props.image.startsWith('https://') || props.image.startsWith('http')
    ? props.image
    : `https://archls.infos.st` + props.image
)
</script>
