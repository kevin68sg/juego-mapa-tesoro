import { useEffect, useRef, useState } from 'react'
import { CARTA, DESPEDIDA } from './contenido.js'

export default function Tesoro({ alMapa, alReiniciar }) {
  const [paso, setPaso] = useState('cofre')    // cofre -> abriendo -> carta
  const [n, setN] = useState(0)                // caracteres escritos
  const [dijoSi, setDijoSi] = useState(false)
  const [pos, setPos] = useState(null)         // posición del "No" cuando huye
  const card = useRef(null), zona = useRef(null), no = useRef(null), si = useRef(null)

  const abrir = () => { setPaso('abriendo'); setTimeout(() => setPaso('carta'), 1600) }

  useEffect(() => {
    if (paso !== 'carta' || n >= CARTA.length) return
    const t = setTimeout(() => setN((x) => x + 1), 28)
    return () => clearTimeout(t)
  }, [paso, n])

  // La carta siempre se queda con lo último escrito a la vista
  useEffect(() => { if (card.current) card.current.scrollTop = card.current.scrollHeight }, [n, dijoSi])

  // El "No" salta a un punto aleatorio de su zona, evitando solaparse con el "Sí"
  const huir = (e) => {
    e.preventDefault()
    const z = zona.current, b = no.current, s = si.current
    if (!z || !b || !s) return
    const zr = z.getBoundingClientRect(), sr = s.getBoundingClientRect()
    const W = z.clientWidth - b.offsetWidth, H = z.clientHeight - b.offsetHeight
    let x, y, k = 0
    do {
      x = Math.random() * W; y = Math.random() * H; k++
    } while (k < 15 && x + zr.left < sr.right + 8 && x + zr.left + b.offsetWidth > sr.left - 8 &&
             y + zr.top < sr.bottom + 8 && y + zr.top + b.offsetHeight > sr.top - 8)
    setPos({ x, y })
  }

  if (paso !== 'carta') {
    return (
      <div className="pantalla centro">
        <button className={'cofre' + (paso === 'abriendo' ? ' abre' : '')} onClick={paso === 'cofre' ? abrir : undefined} aria-label="Abrir el cofre">
          {paso === 'cofre' ? '🧰' : '✨'}
        </button>
        <p className="ayuda">{paso === 'cofre' ? 'Toca el cofre para abrirlo' : 'Se abre…'}</p>
      </div>
    )
  }
  return (
    <div className="pantalla centro">
      <div className="card" ref={card} onClick={() => n < CARTA.length && setN(CARTA.length)}>
        <div className="carta">{CARTA.slice(0, n)}{dijoSi && '\n\n' + DESPEDIDA}</div>
        {dijoSi && (
          <div className="fin">
            <button className="btn sec" onClick={alMapa}>Ver el mapa</button>
            <button className="btn sec" onClick={alReiniciar}>Empezar de nuevo</button>
          </div>
        )}
        {n >= CARTA.length && !dijoSi && (
          <div className="resp" ref={zona}>
            <button ref={si} className="btn si" onClick={() => setDijoSi(true)}>Sí</button>
            <button ref={no} className="btn no" style={pos ? { left: pos.x, top: pos.y } : undefined}
                    onPointerEnter={huir} onPointerDown={huir}>No</button>
          </div>
        )}
      </div>
    </div>
  )
}
