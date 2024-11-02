const NOTAS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function detectKey(audioData) {
  // Por enquanto, retornaremos uma nota aleatória para demonstração
  return NOTAS[Math.floor(Math.random() * NOTAS.length)]
}

export function calculateIdealKey(originalKey) {
  // Lógica simplificada: sugere uma transposição para 3 semitons acima
  const indexAtual = NOTAS.indexOf(originalKey)
  const novoIndex = (indexAtual + 3) % NOTAS.length
  return NOTAS[novoIndex]
}

export function transposeNotes(originalKey, semitones) {
  const indexOriginal = NOTAS.indexOf(originalKey)
  const notasTranspostas = []
  
  // Gera uma escala maior a partir da nota original
  const intervalos = [0, 2, 4, 5, 7, 9, 11] // Intervalos da escala maior
  
  intervalos.forEach(intervalo => {
    const indexNovo = (indexOriginal + intervalo + semitones + 12) % 12
    notasTranspostas.push(NOTAS[indexNovo])
  })
  
  return notasTranspostas
}

export function calcularDiferencaSemitons(tomOriginal, tomDestino) {
  const indexOriginal = NOTAS.indexOf(tomOriginal)
  const indexDestino = NOTAS.indexOf(tomDestino)
  let diferenca = indexDestino - indexOriginal
  
  if (diferenca < -6) diferenca += 12
  if (diferenca > 6) diferenca -= 12
  
  return diferenca
} 