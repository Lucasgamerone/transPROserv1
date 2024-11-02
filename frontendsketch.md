import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { convertChords, getSuggestions } from '@/utils/api'

export default function PaginaPrincipal() {
  const [transposicaoValor, setTransposicaoValor] = useState(0)
  const [cifras, setCifras] = useState('')
  const [instrumentoOrigem, setInstrumentoOrigem] = useState('')
  const [instrumentoDestino, setInstrumentoDestino] = useState('')
  const [audioFile, setAudioFile] = useState(null)
  const [isAutoMode, setIsAutoMode] = useState(false)
  const [originalKey, setOriginalKey] = useState('')
  const [suggestedKey, setSuggestedKey] = useState('')
  const [notasAjustadas, setNotasAjustadas] = useState([])
  const [convertedChords, setConvertedChords] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  // Função para processar o arquivo de áudio
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setAudioFile(file)
    // Aqui você adicionaria a lógica para detectar o tom original
    detectarTomOriginal(file)
  }

  // Função para detectar o tom original (simulada)
  const detectarTomOriginal = (file) => {
    // Implementação real necessária
    setOriginalKey('C')
  }

  // Função para sugerir tom ideal (modo automático)
  useEffect(() => {
    if (isAutoMode && originalKey) {
      // Lógica para sugerir tom ideal baseado no tom original
      const novoTom = calcularTomIdeal(originalKey)
      setSuggestedKey(novoTom)
      const diferenca = calcularDiferencaSemitons(originalKey, novoTom)
      setTransposicaoValor(diferenca)
    }
  }, [isAutoMode, originalKey])

  // Atualiza as notas em tempo real conforme a transposição
  useEffect(() => {
    if (originalKey) {
      const novasNotas = calcularNotasTranspostas(originalKey, transposicaoValor)
      setNotasAjustadas(novasNotas)
    }
  }, [transposicaoValor, originalKey])

  const handleChordConversion = async () => {
    if (!cifras || !instrumentoOrigem || !instrumentoDestino) {
      alert('Preencha todos os campos')
      return
    }

    setIsConverting(true)
    try {
      const result = await convertChords(cifras, instrumentoOrigem, instrumentoDestino)
      setConvertedChords(result.convertido)
      
      // Buscar sugestões para cada acorde
      const acordes = result.convertido.split(/\s+/)
      const todasSugestoes = await Promise.all(
        acordes.map(acorde => getSuggestions(acorde, instrumentoDestino))
      )
      setSuggestions(todasSugestoes)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao converter cifras')
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Transposição Musical</h1>
          <div className="space-x-2">
            <Button variant="outline">Entrar</Button>
            <Button>Cadastrar</Button>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <Tabs defaultValue="transposicao" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transposicao">Transposição de Músicas</TabsTrigger>
            <TabsTrigger value="conversao">Conversão de Cifras</TabsTrigger>
          </TabsList>

          <TabsContent value="transposicao">
            <Card>
              <CardHeader>
                <CardTitle>Transposição de Músicas</CardTitle>
                <CardDescription>Mude o tom da sua música de forma dinâmica</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleFileChange}
                />
                
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="auto-mode"
                    checked={isAutoMode}
                    onCheckedChange={setIsAutoMode}
                  />
                  <Label htmlFor="auto-mode">Modo Automático</Label>
                </div>

                {originalKey && (
                  <div className="mb-4">
                    <p>Tom Original: {originalKey}</p>
                    {isAutoMode && <p>Tom Sugerido: {suggestedKey}</p>}
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <span>Transposição:</span>
                  <Slider
                    min={-12}
                    max={12}
                    step={1}
                    value={[transposicaoValor]}
                    onValueChange={(value) => setTransposicaoValor(value[0])}
                  />
                  <span>{transposicaoValor} semitons</span>
                </div>

                {notasAjustadas.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Notas Ajustadas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {notasAjustadas.map((nota, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 rounded">
                          {nota}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  disabled={!audioFile} 
                  onClick={() => handleTransposition()}
                >
                  Transpor Áudio
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversao">
            <Card>
              <CardHeader>
                <CardTitle>Conversão de Cifras</CardTitle>
                <CardDescription>Converta cifras entre diferentes instrumentos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Digite suas cifras aqui..." 
                  value={cifras}
                  onChange={(e) => setCifras(e.target.value)}
                />
                <div className="flex space-x-4">
                  <Select value={instrumentoOrigem} onValueChange={setInstrumentoOrigem}>
                    <SelectTrigger>
                      <SelectValue placeholder="Instrumento de Origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="violao">Violão</SelectItem>
                      <SelectItem value="cavaquinho">Cavaquinho</SelectItem>
                      <SelectItem value="ukulele">Ukulele</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={instrumentoDestino} onValueChange={setInstrumentoDestino}>
                    <SelectTrigger>
                      <SelectValue placeholder="Instrumento de Destino" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="violao">Violão</SelectItem>
                      <SelectItem value="cavaquinho">Cavaquinho</SelectItem>
                      <SelectItem value="ukulele">Ukulele</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleChordConversion}
                  disabled={isConverting}
                >
                  {isConverting ? 'Convertendo...' : 'Converter Cifras'}
                </Button>

                {convertedChords && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Cifras Convertidas:</h4>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      {convertedChords}
                    </div>
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Sugestões de Acordes:</h4>
                    <div className="space-y-2">
                      {suggestions.map((sug, index) => (
                        <div key={index} className="p-2 bg-blue-50 rounded">
                          <p>Para {sug.acorde}:</p>
                          <div className="flex gap-2 mt-1">
                            {sug.alternativas.map((alt, i) => (
                              <span key={i} className="px-2 py-1 bg-white rounded">
                                {alt}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Planos de Assinatura</CardTitle>
            <CardDescription>Escolha o plano ideal para você</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Plano Gratuito</h3>
              <ul className="list-disc list-inside mt-2">
                <li>Acesso limitado às funcionalidades</li>
                <li>Transposição básica</li>
                <li>Conversão de cifras limitada</li>
              </ul>
            </div>
            <div className="border p-4 rounded-lg bg-blue-50">
              <h3 className="text-lg font-semibold">Plano Pago</h3>
              <ul className="list-disc list-inside mt-2">
                <li>Acesso ilimitado a todas as funcionalidades</li>
                <li>Transposição avançada</li>
                <li>Conversão de cifras ilimitada</li>
                <li>Recursos exclusivos</li>
              </ul>
              <Button className="mt-4">Assinar Agora</Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Transposição Musical. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

// Funções auxiliares (precisam ser implementadas)
function calcularTomIdeal(tomOriginal) {
  // Implementar lógica real
  return 'G'
}

function calcularDiferencaSemitons(tomOriginal, tomDestino) {
  // Implementar lógica real
  return 7
}

function calcularNotasTranspostas(tomOriginal, semitons) {
  // Implementar lógica real
  return ['C', 'D', 'E', 'F', 'G', 'A', 'B']
}

function handleTransposition() {
  // Implementar lógica real de transposição do áudio
}