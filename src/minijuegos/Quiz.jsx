import { useEffect, useState } from 'react'
import { QUIZ } from '../contenido.js'

const TIEMPO = 10, NECESARIAS = 3

export default function Quiz({ onGanar }) {
  const [i, setI] = useState(0)
  const [aciertos, setAciertos] = useState(0)
  const [t, setT] = useState(TIEMPO)
  const [sel, setSel] = useState(null)      // opción elegida (-1 = se acabó el tiempo)
  const [fin, setFin] = useState(false)
  const p = QUIZ[i]

  // Cuenta atrás: un tick por segundo mientras no se haya respondido
  useEffect(() => {
    if (fin || sel !== null) return
    if (t <= 0) { responder(-1); return }
    const id = setTimeout(() => setT(t - 1), 1000)
    return () => clearTimeout(id)
  }, [t, sel, fin])

  function responder(k) {
    setSel(k)
    const nuevos = aciertos + (k === p.correcta ? 1 : 0)
    setTimeout(() => {
      setAciertos(nuevos)
      if (i + 1 >= QUIZ.length) nuevos >= NECESARIAS ? onGanar() : setFin(true)
      else { setI(i + 1); setT(TIEMPO); setSel(null) }
    }, 800)
  }
  const reiniciar = () => { setI(0); setAciertos(0); setT(TIEMPO); setSel(null); setFin(false) }

  if (fin) return (
    <div className="card">
      <h2>{aciertos} de {QUIZ.length}</h2>
      <p className="recuerdo">Necesitas {NECESARIAS}. ¡Tú puedes!</p>
      <button className="btn" onClick={reiniciar}>Reintentar</button>
    </div>
  )
  return (
    <div className="card">
      <div className="barra"><div style={{ width: `${(t / TIEMPO) * 100}%` }} /></div>
      <h2>{p.pregunta}</h2>
      {p.opciones.map((o, k) => {
        const cls = sel === null ? '' : k === p.correcta ? ' bien' : k === sel ? ' mal' : ''
        return <button key={k} className={'op' + cls} disabled={sel !== null} onClick={() => responder(k)}>{o}</button>
      })}
    </div>
  )
}
