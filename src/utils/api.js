const API_URL = 'http://localhost:3001/api'

export async function analyzeAudio(file) {
  const formData = new FormData()
  formData.append('audio', file)

  const response = await fetch(`${API_URL}/transposition/analyze`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) throw new Error('Erro na análise do áudio')
  return response.json()
}

export async function transposeAudio(file, semitones) {
  const formData = new FormData()
  formData.append('audio', file)
  formData.append('semitones', semitones)

  const response = await fetch(`${API_URL}/transposition/transpose`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) throw new Error('Erro na transposição do áudio')
  return response.blob()
}

export async function convertChords(cifras, instrumentoOrigem, instrumentoDestino) {
  const response = await fetch(`${API_URL}/chords/convert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cifras,
      instrumentoOrigem,
      instrumentoDestino
    })
  })

  if (!response.ok) throw new Error('Erro na conversão de cifras')
  return response.json()
}

export async function getSuggestions(acorde, instrumento) {
  const response = await fetch(`${API_URL}/chords/suggest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      acorde,
      instrumento
    })
  })

  if (!response.ok) throw new Error('Erro ao buscar sugestões')
  return response.json()
} 