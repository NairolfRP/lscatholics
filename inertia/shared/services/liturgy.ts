export function liturgicalColor(color: string | null): string {
  switch (color?.toLowerCase()) {
    case 'white':
    case 'blanc':
      return '#ffffff'
    case 'green':
    case 'vert':
      return '#10b981'
    case 'red':
    case 'rouge':
      return '#ef4444'
    case 'purple':
    case 'violet':
      return '#8b5cf6'
    case 'pink':
    case 'rose':
      return '#f9a8d4'
    case 'black':
    case 'noir':
      return '#000000'
    default:
      return '#d1d5db'
  }
}

export function getReadingTypeLabel(type: string) {
  switch (type) {
    case 'lecture_1':
      return 'Première lecture'
    case 'psaume':
      return 'Psaume'
    case 'lecture_2':
      return 'Deuxième lecture'
    case 'evangile':
      return 'Évangile'
    default:
      return null
  }
}
