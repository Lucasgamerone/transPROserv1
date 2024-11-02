import express from 'express'
import multer from 'multer'
import { processAudio, detectKey } from '../services/audioService.js'

const router = express.Router()
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // limite de 10MB
  }
})

// Rota para upload e análise inicial do áudio
router.post('/analyze', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' })
    }

    const audioBuffer = req.file.buffer
    const key = await detectKey(audioBuffer)

    res.json({
      originalKey: key,
      suggestedKeys: getSuggestedKeys(key),
      message: 'Áudio analisado com sucesso'
    })
  } catch (error) {
    console.error('Erro na análise do áudio:', error)
    res.status(500).json({ error: 'Erro ao processar o áudio' })
  }
})

// Rota para transposição do áudio
router.post('/transpose', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' })
    }

    const { semitones } = req.body
    if (semitones === undefined) {
      return res.status(400).json({ error: 'Número de semitons não especificado' })
    }

    const audioBuffer = req.file.buffer
    const transposedAudio = await processAudio(audioBuffer, parseInt(semitones))

    res.set('Content-Type', 'audio/wav')
    res.send(transposedAudio)
  } catch (error) {
    console.error('Erro na transposição:', error)
    res.status(500).json({ error: 'Erro ao transpor o áudio' })
  }
})

export default router 