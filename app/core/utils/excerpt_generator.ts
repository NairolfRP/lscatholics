export class ExcerptGenerator {
  /**
   * Cleans up the Markdown and generates an excerpt
   * @param markdown - The Markdown content
   * @param maxLength - Maximum length of the excerpt (default: 160 characters)
   * @returns The cleaned excerpt
   */
  static generate(markdown: string, maxLength: number = 160): string {
    if (!markdown || markdown.trim() === '') {
      return ''
    }

    let cleaned = markdown.replace(/```[\s\S]*?```/g, '')

    cleaned = cleaned.replace(/!\[.*?\]\(.*?\)/g, '')

    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

    cleaned = cleaned.replace(/^#{1,6}\s+/gm, '')

    cleaned = cleaned.replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1')
    cleaned = cleaned.replace(/\*(.+?)\*/g, '$1')
    cleaned = cleaned.replace(/___(.+?)___/g, '$1')
    cleaned = cleaned.replace(/__(.+?)__/g, '$1')
    cleaned = cleaned.replace(/_(.+?)_/g, '$1')

    cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, '')
    cleaned = cleaned.replace(/^[\s]*\d+\.\s+/gm, '')

    cleaned = cleaned.replace(/^>\s+/gm, '')

    cleaned = cleaned.replace(/^[-*_]{3,}$/gm, '')

    cleaned = cleaned.replace(/[<>]/g, '')

    cleaned = cleaned.replace(/\n\s*\n/g, '\n')
    cleaned = cleaned.replace(/\s+/g, ' ')

    cleaned = cleaned.trim()

    if (cleaned === '' || cleaned.length < 10) {
      return ''
    }

    if (cleaned.length <= maxLength) {
      return cleaned
    }

    const truncated = cleaned.substring(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')

    if (lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex) + '...'
    }

    return truncated + '...'
  }

  /**
   * Check if the Markdown contains usable text
   * @param markdown - The Markdown content
   * @returns true if the content has usable text
   */
  static hasValidContent(markdown: string): boolean {
    const cleaned = this.generate(markdown, 10)
    return cleaned !== ''
  }
}
