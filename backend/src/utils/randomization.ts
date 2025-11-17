export function randomizeArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getRandomElements<T>(array: T[], count: number): T[] {
  if (count >= array.length) return array
  const shuffled = randomizeArray(array)
  return shuffled.slice(0, count)
}
