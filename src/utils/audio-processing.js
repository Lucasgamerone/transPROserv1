import * as Tone from 'tone'

export async function transposeAudio(audioFile, semitones) {
  try {
    // Criar um buffer de áudio
    const buffer = new Tone.Buffer(audioFile)
    
    // Criar um player
    const player = new Tone.Player(buffer).toDestination()
    
    // Aplicar o pitch shift
    const pitchShift = new Tone.PitchShift({
      pitch: semitones,
      windowSize: 0.1,
      delayTime: 0
    }).toDestination()
    
    // Conectar o player ao pitch shift
    player.connect(pitchShift)
    
    // Retornar o player para controle externo
    return player
    
  } catch (error) {
    console.error('Erro ao processar áudio:', error)
    throw error
  }
} 