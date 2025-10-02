<template>
  <div :class="cn('relative w-full', props.class)">
    <!-- Toolbar -->
    <div v-if="!disabled" class="flex items-center gap-1 mb-2 p-2 border rounded-md bg-muted/50">
      <Button
        variant="ghost"
        type="button"
        @click="insertMarkdown('**', '**')"
        class="p-1.5 hover:bg-muted rounded text-sm font-semibold"
        title="Gras (Ctrl+B)"
      >
        B
      </Button>
      <Button
        variant="ghost"
        type="button"
        @click="insertMarkdown('_', '_')"
        class="p-1.5 hover:bg-muted rounded text-sm italic"
        title="Italique (Ctrl+I)"
      >
        I
      </Button>
      <Button
        variant="ghost"
        type="button"
        @click="insertMarkdown('# ')"
        class="p-1.5 hover:bg-muted rounded text-sm font-bold"
        title="Titre"
      >
        H
      </Button>
      <Button
        variant="ghost"
        type="button"
        @click="insertMarkdown('- ')"
        class="p-1.5 hover:bg-muted rounded text-sm"
        title="Liste"
      >
        •
      </Button>
      <Button
        variant="ghost"
        type="button"
        @click="insertMarkdown('![Alt text](image-url)')"
        class="p-1.5 hover:bg-muted rounded text-sm"
        title="Image"
      >
        🖼️
      </Button>
      <Button
        variant="ghost"
        type="button"
        @click="insertMarkdown('[](url)')"
        class="p-1.5 hover:bg-muted rounded text-sm"
        title="Lien"
      >
        🔗
      </Button>
      <Button
        variant="ghost"
        type="button"
        @click="insertMarkdown('`', '`')"
        class="p-1.5 hover:bg-muted rounded text-sm font-mono"
        title="Code"
      >
        &lt;/&gt;
      </Button>

      <div class="flex-1"></div>

      <Button
        variant="ghost"
        v-if="preview"
        type="button"
        @click="togglePreview"
        :class="
          cn(
            'p-1.5 rounded text-sm',
            showPreview ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          )
        "
        title="Aperçu"
      >
        👁
      </Button>
    </div>

    <!-- Editor / Preview -->
    <div class="relative">
      <textarea
        v-show="!showPreview"
        ref="textareaRef"
        v-model="localValue"
        :disabled="disabled"
        :placeholder="placeholder"
        :rows="rows"
        @keydown="handleKeyDown"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
        :class="
          cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2',
            'text-sm ring-offset-background placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-y font-mono'
          )
        "
      />

      <div
        v-show="showPreview"
        :class="
          cn(
            'min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2',
            'overflow-auto'
          )
        "
        :style="{ minHeight: `${rows * 1.5}rem` }"
      >
        <MarkdownContent v-if="localValue" :content="localValue" class="max-w-none" />
        <p v-else class="text-muted-foreground text-sm">Aucun contenu à prévisualiser...</p>
      </div>
    </div>

    <!-- Aide Markdown -->
    <div class="mt-2 text-xs text-muted-foreground">
      <span class="font-mono">**gras**</span> • <span class="font-mono">_italique_</span> •
      <span class="font-mono"># titre</span> • <span class="font-mono">- liste</span> •
      <span class="font-mono">`code`</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { MarkdownContent } from '@/components/ui/markdown'
import { Button } from '@/components/ui/button'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  class?: string
  rows?: number
  preview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Écrivez votre contenu en Markdown...',
  disabled: false,
  rows: 10,
  preview: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
}>()

const showPreview = ref(false)
const textareaRef = ref<HTMLTextAreaElement>()

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

const insertMarkdown = (before: string, after = '') => {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = localValue.value
  const selectedText = text.substring(start, end)

  localValue.value = text.substring(0, start) + before + selectedText + after + text.substring(end)

  // Restaurer la sélection
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, end + before.length)
  }, 0)
}

const handleKeyDown = (e: KeyboardEvent) => {
  // Ctrl/Cmd + B pour gras
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault()
    insertMarkdown('**', '**')
  }
  // Ctrl/Cmd + I pour italique
  if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
    e.preventDefault()
    insertMarkdown('_', '_')
  }
  // Tab pour indentation
  if (e.key === 'Tab') {
    e.preventDefault()
    insertMarkdown('  ')
  }
}

defineExpose({
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
})
</script>
