import * as Pitchfinder from 'pitchfinder'
import { Lame } from 'node-lame'
import { Readable } from 'stream'
import * as mm from 'music-metadata'

const NOTAS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export async function detectKey(audioBuffer) {
  try {
    // Analisa os metadados do áudio
    const metadata = await mm.parseBuffer(audioBuffer)
    
    // Usa Pitchfinder para detectar frequências fundamentais
    const detector = new Pitchfinder.YIN()
    
    // Converte o buffer em um array de samples
    const audioData = await convertBufferToAudioData(audioBuffer)
    
    // Detecta as frequências predominantes
    const frequencies = detector(audioData)
    
    // Converte a frequência mais comum em uma nota musical
    const dominantNote = frequencyToNote(getMostCommonFrequency(frequencies))
    
    return dominantNote
  } catch (error) {
    console.error('Erro na detecção de tom:', error)
    throw error
  }
}

export async function processAudio(audioBuffer, semitones) {
  try {
    // Converte o buffer em um stream
    const inputStream = Readable.from(audioBuffer)
    
    // Configura o processamento do áudio
    const encoder = new Lame({
      output: 'buffer',
      bitrate: 192,
      scale: 1.0,
      pitch: calculatePitchFactor(semitones)
    })
    
    // Processa o áudio
    const processedBuffer = await new Promise((resolve, reject) => {
      encoder
        .setBuffer(audioBuffer)
        .encode()
        .then(() => {
          const buffer = encoder.getBuffer()
          resolve(buffer)
        })
        .catch(reject)
    })
    
    return processedBuffer
  } catch (error) {
    console.error('Erro no processamento do áudio:', error)
    throw error
  }
}

// Funções auxiliares
function convertBufferToAudioData(buffer) {
  // Implementar conversão do buffer para array de samples
  // Esta é uma implementação simplificada
  return new Float32Array(buffer)
}

function getMostCommonFrequency(frequencies) {
  // Implementar lógica para encontrar a frequência mais comum
  return frequencies[0] || 440 // A4 como fallback
}

function frequencyToNote(frequency) {
  // Converte frequência em nota musical
  const noteNum = 12 * (Math.log2(frequency / 440)) + 69
  const note = NOTAS[Math.round(noteNum) % 12]
  return note
}

function calculatePitchFactor(semitones) {
  // Calcula o fator de pitch shift baseado nos semitons
  return Math.pow(2, semitones / 12)
} 