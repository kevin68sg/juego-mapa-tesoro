import { useEffect, useState } from 'react'
import { PALABRA, PISTA_PALABRA } from '../contenido.js'

// Mayúsculas y sin tildes, pero conservando la Ñ
const limpiar = (s) => s.toUpperCase().replace(/Ñ/g, '\u0001').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0001/g, 'Ñ').trim()
const SECRETA = limpiar(PALABRA)
const N = SECRETA.length
const INTENTOS = 6
const TECLAS = ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM']
const RANGO = { x: 1, a: 2, v: 3 }

// 'v' = sitio correcto, 'a' = está en otro sitio, 'x' = no está
function evaluar(g) {
  const res = Array(g.length).fill('x'), resto = {}
  for (let i = 0; i < g.length; i++) g[i] === SECRETA[i] ? (res[i] = 'v') : (resto[SECRETA[i]] = (resto[SECRETA[i]] || 0) + 1)
  for (let i = 0; i < g.length; i++) if (res[i] !== 'v' && resto[g[i]] > 0) { res[i] = 'a'; resto[g[i]]-- }
  return res
}

export default function Palabra({ onGanar }) {
  const [intentos, setIntentos] = useState([])
  const [actual, setActual] = useState('')
  const [aviso, setAviso] = useState('')
  const ganado = intentos.includes(SECRETA)
  const perdio = !ganado && intentos.length >= INTENTOS

  const letra = (l) => { if (ganado || perdio) return; setAviso(''); setActual((a) => (a.length < N ? a + l : a)) }
  const borrar = () => setActual((a) => a.slice(0, -1))
  const enviar = () => {
    if (ganado || perdio) return
    if (actual.length < N) { setAviso(`Son ${N} letras.`); return }
    setIntentos((i) => [...i, actual]); setActual('')
    if (actual === SECRETA) setTimeout(onGanar, 900)
  }

  // También funciona con el teclado del ordenador
  useEffect(() => {
    const f = (e) => {
      if (e.key === 'Enter') enviar()
      else if (e.key === 'Backspace') borrar()
      else if (/^[a-zñ]$/i.test(e.key)) letra(e.key.toUpperCase())
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [actual, intentos])

  // Mejor estado conocido de cada letra, para colorear el teclado
  const estado = {}
  intentos.forEach((g) => evaluar(g).forEach((r, i) => { if (!estado[g[i]] || RANGO[r] > RANGO[estado[g[i]]]) estado[g[i]] = r }))

  return (
    <>
      <p className="ayuda">Pista: {PISTA_PALABRA}</p>
      <div className="palabra" style={{ '--n': N }}>
        {Array.from({ length: INTENTOS }, (_, f) => {
          const g = intentos[f]
          const txt = g ?? (f === intentos.length && !ganado ? actual : '')
          const ev = g ? evaluar(g) : null
          return (
            <div key={f} className="fila">
              {Array.from({ length: N }, (_, i) => <span key={i} className={'letra ' + (ev ? ev[i] : '')}>{txt[i] || ''}</span>)}
            </div>
          )
        })}
      </div>
      <p className="aviso">{perdio ? `Casi. Empieza por ${SECRETA[0]}.` : aviso}</p>

      {perdio ? (
        <button className="btn" onClick={() => { setIntentos([]); setActual('') }}>Otra vez</button>
      ) : (
        <div className="teclado">
          {TECLAS.map((fila, r) => (
            <div key={r} className="fila-t">
              {r === 2 && <button className="tecla ancha" onClick={enviar}>Enviar</button>}
              {[...fila].map((l) => <button key={l} className={'tecla ' + (estado[l] || '')} onClick={() => letra(l)}>{l}</button>)}
              {r === 2 && <button className="tecla ancha" onClick={borrar} aria-label="Borrar">⌫</button>}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
