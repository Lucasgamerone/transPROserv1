import express from 'express'
import { converterAcordes, sugerirAlternativas } from '../services/chordService.js'

const router = express.Router()

router.post('/convert', async (req, res) => {
  try {
    const { cifras, instrumentoOrigem, instrumentoDestino } = req.body
    
    if (!cifras || !instrumentoOrigem || !instrumentoDestino) {
      return res.status(400).json({ 
        error: 'Cifras, instrumento de origem e destino são obrigatórios' 
      })
    }

    const cifrasConvertidas = await converterAcordes(
      cifras,
      instrumentoOrigem,
      instrumentoDestino
    )

    res.json({
      original: cifras,
      convertido: cifrasConvertidas,
      instrumentoOrigem,
      instrumentoDestino
    })
  } catch (error) {
    console.error('Erro na conversão:', error)
    res.status(500).json({ error: 'Erro ao converter cifras' })
  }
})

router.post('/suggest', async (req, res) => {
  try {
    const { acorde, instrumento } = req.body
    
    if (!acorde || !instrumento) {
      return res.status(400).json({ 
        error: 'Acorde e instrumento são obrigatórios' 
      })
    }

    const alternativas = await sugerirAlternativas(acorde, instrumento)

    res.json({
      acorde,
      instrumento,
      alternativas
    })
  } catch (error) {
    console.error('Erro ao sugerir alternativas:', error)
    res.status(500).json({ error: 'Erro ao buscar sugestões' })
  }
})

export default router 