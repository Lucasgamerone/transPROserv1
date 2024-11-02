import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import planRoutes from './routes/planRoutes.js'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Rotas
app.use('/api/auth', authRoutes)
app.use('/api/plans', planRoutes)

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Erro interno do servidor' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
}) 