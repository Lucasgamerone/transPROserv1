const ACORDES_VIOLAO = {
  'C': ['C', 'E', 'G'],
  'Am': ['A', 'C', 'E'],
  'F': ['F', 'A', 'C'],
  'G': ['G', 'B', 'D'],
  // ... outros acordes
}

const ACORDES_CAVAQUINHO = {
  'C': ['C', 'E', 'G'],
  'Am': ['A', 'C', 'E'],
  'F': ['F', 'A', 'C'],
  'G': ['G', 'B', 'D'],
  // ... outros acordes com posições específicas do cavaquinho
}

const POSICOES_VIOLAO = {
  'C': '(x32010)',
  'Am': '(x02210)',
  'F': '(133211)',
  'G': '(320003)',
  // ... outras posições
}

const POSICOES_CAVAQUINHO = {
  'C': '(0012)',
  'Am': '(2000)',
  'F': '(2010)',
  'G': '(0232)',
  // ... outras posições
}

export function converterAcordes(cifra, instrumentoOrigem, instrumentoDestino) {
  try {
    // Separa a cifra em acordes individuais
    const acordes = cifra.split(/\s+/)
    
    // Converte cada acorde
    const acordesConvertidos = acordes.map(acorde => {
      const posicaoOriginal = obterPosicao(acorde, instrumentoOrigem)
      const acordeBase = identificarAcordeBase(acorde, posicaoOriginal)
      return converterParaInstrumento(acordeBase, instrumentoDestino)
    })
    
    return acordesConvertidos.join(' ')
  } catch (error) {
    console.error('Erro na conversão de acordes:', error)
    throw error
  }
}

export function identificarAcordeBase(cifra, posicao) {
  // Identifica o acorde base a partir da cifra e posição
  // Retorna o acorde em formato universal
  return cifra // Simplificado para exemplo
}

export function converterParaInstrumento(acordeBase, instrumento) {
  // Converte o acorde base para o formato do instrumento destino
  const posicoes = instrumento === 'cavaquinho' ? POSICOES_CAVAQUINHO : POSICOES_VIOLAO
  return `${acordeBase}${posicoes[acordeBase] || ''}`
}

export function obterPosicao(acorde, instrumento) {
  const posicoes = instrumento === 'cavaquinho' ? POSICOES_CAVAQUINHO : POSICOES_VIOLAO
  return posicoes[acorde] || ''
}

export function sugerirAlternativas(acorde, instrumento) {
  // Sugere acordes alternativos mais fáceis de tocar
  const alternativas = []
  // Implementar lógica de sugestão
  return alternativas
} 