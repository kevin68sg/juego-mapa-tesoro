import { useEffect, useRef, useState } from 'react'

const COLORES = ['#ff9ec7', '#ffe08a', '#8fd3ff', '#b9a6ff']
const RONDAS = 5
const azar = () => Math.floor(Math.random() * 4)

export default function Simon({ onGanar }) {
  const [seq, setSeq] = useState([])
  const [luz, setLuz] = useState(null)       // pad encendido
  const [turno, setTurno] = useState(false)  // ¿le toca a la jugadora?
  const [pos, setPos] = useState(0)
  const [msg, setMsg] = useState('Mira…')
  const timers = useRef([])

  // Todos los setTimeout se guardan para cancelarlos si sales del minijuego
  const prog = (fn, ms) => timers.current.push(setTimeout(fn, ms))
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const reproducir = (s) => {
    setTurno(false); setPos(0); setMsg('Mira…')
    s.forEach((c, k) => {
      prog(() => setLuz(c), 700 + k * 700)
      prog(() => setLuz(null), 700 + k * 700 + 450)
    })
    prog(() => { setTurno(true); setMsg('Tu turno') }, 700 + s.length * 700)
  }
  const empezar = (s) => { setSeq(s); reproducir(s) }
  useEffect(() => { empezar([azar()]) }, [])

  const tocar = (c) => {
    if (!turno) return
    setLuz(c); prog(() => setLuz(null), 180)
    if (c !== seq[pos]) {
      setTurno(false); setMsg('Uy, desde el principio')
      navigator.vibrate?.(80)
      prog(() => empezar([azar()]), 1100); return
    }
    if (pos + 1 < seq.length) { setPos(pos + 1); return }
    setTurno(false)
    if (seq.length === RONDAS) { setMsg('¡Perfecto!'); prog(onGanar, 700) }
    else prog(() => empezar([...seq, azar()]), 800)
  }
  return (
    <>
      <p className="ayuda">Ronda {seq.length}/{RONDAS} · {msg}</p>
      <div className="rejilla simon">
        {COLORES.map((col, c) => (
          <button key={c} className={'pad' + (luz === c ? ' on' : '')} style={{ background: col }}
                  onPointerDown={(e) => { e.preventDefault(); tocar(c) }} aria-label={`Pad ${c + 1}`} />
        ))}
      </div>
    </>
  )
}
