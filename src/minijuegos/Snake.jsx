import { useEffect, useRef, useState } from 'react'

const G = 15            // tablero de 15x15 casillas
const OBJETIVO = 5      // gemas necesarias para ganar
const S = Math.min(window.devicePixelRatio || 1, 3)   // nitidez en pantallas retina
const rnd = (n) => Math.floor(Math.random() * n)

export default function Snake({ onGanar }) {
  const cv = useRef(null), zona = useRef(null)
  const [puntos, setPuntos] = useState(0)
  const [msg, setMsg] = useState('Desliza el dedo para empezar')

  useEffect(() => {
    const c = cv.current, ctx = c.getContext('2d')
    c.width = c.height = Math.round(c.clientWidth * S)
    const cel = c.width / G
    // Estado del juego (en variables normales, no en useState: cambia 6 veces por segundo y no necesita re-renderizar React)
    let serp, dir, cola, comida, n, esperando, vivo = true, timer, fin
    const tiempos = []

    const nueva = () => { let p; do { p = { x: rnd(G), y: rnd(G) } } while (serp.some((s) => s.x === p.x && s.y === p.y)); return p }
    const reset = () => {
      serp = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }]
      dir = { x: 1, y: 0 }; cola = []; n = 0; esperando = true; vivo = true
      comida = nueva(); setPuntos(0); setMsg('Desliza el dedo para empezar'); dibujar()
    }

    // Tiempo entre pasos: empieza tranquilo y cada gema acelera
    const programar = () => { timer = setTimeout(paso, Math.max(80, 175 - n * 16)) }

    const paso = () => {
      if (cola.length) dir = cola.shift()
      const h = { x: serp[0].x + dir.x, y: serp[0].y + dir.y }
      const come = h.x === comida.x && h.y === comida.y
      const cuerpo = come ? serp : serp.slice(0, -1)     // la cola se aparta al avanzar
      if (h.x < 0 || h.y < 0 || h.x >= G || h.y >= G || cuerpo.some((s) => s.x === h.x && s.y === h.y)) return morir()
      serp.unshift(h)
      if (come) {
        n++; setPuntos(n); navigator.vibrate?.(30)
        if (n >= OBJETIVO) return ganar()
        comida = nueva()
      } else serp.pop()
      dibujar(); programar()
    }
    const morir = () => {
      vivo = false; navigator.vibrate?.(100); setMsg('Ay… otra vez'); dibujar()
      tiempos.push(setTimeout(reset, 1100))
    }
    const ganar = () => { fin = true; setMsg('¡Lo lograste!'); dibujar(); tiempos.push(setTimeout(onGanar, 800)) }

    // Girar: se guardan hasta 2 giros en cola para no perder swipes rápidos y se impiden los giros de 180°
    const girar = (d) => {
      if (!vivo || fin) return
      const ult = cola.length ? cola[cola.length - 1] : dir
      if ((d.x === -ult.x && d.y === -ult.y) || (d.x === ult.x && d.y === ult.y)) return
      if (cola.length < 2) cola.push(d)
      if (esperando) { esperando = false; setMsg(''); programar() }
    }

    const dibujar = () => {
      ctx.fillStyle = '#12303b'; ctx.fillRect(0, 0, c.width, c.height)
      ctx.fillStyle = '#16394a'
      for (let x = 0; x < G; x++) for (let y = 0; y < G; y++) if ((x + y) % 2) ctx.fillRect(x * cel, y * cel, cel, cel)
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.font = `${cel * 0.8}px "Apple Color Emoji","Segoe UI Emoji",sans-serif`
      ctx.fillText('💎', (comida.x + 0.5) * cel, (comida.y + 0.55) * cel)
      serp.forEach((s, i) => {
        ctx.fillStyle = !vivo ? '#d46a6a' : i === 0 ? '#c9ffe6' : '#5fd3a0'
        const m = cel * 0.08
        ctx.beginPath(); ctx.roundRect(s.x * cel + m, s.y * cel + m, cel - 2 * m, cel - 2 * m, cel * 0.28); ctx.fill()
      })
    }

    // Controles: deslizar el dedo en cualquier parte de la zona (sin soltar, se pueden encadenar giros)
    let o = null
    const down = (e) => { o = { x: e.clientX, y: e.clientY }; zona.current.setPointerCapture?.(e.pointerId) }
    const move = (e) => {
      if (!o) return
      const dx = e.clientX - o.x, dy = e.clientY - o.y
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return
      girar(Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) })
      o = { x: e.clientX, y: e.clientY }
    }
    const up = () => { o = null }
    const tecla = (e) => {
      const m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] }[e.key]
      if (m) { e.preventDefault(); girar({ x: m[0], y: m[1] }) }
    }
    const z = zona.current
    z.addEventListener('pointerdown', down); z.addEventListener('pointermove', move)
    z.addEventListener('pointerup', up); z.addEventListener('pointercancel', up)
    window.addEventListener('keydown', tecla)

    reset()
    return () => {
      clearTimeout(timer); tiempos.forEach(clearTimeout); fin = true
      z.removeEventListener('pointerdown', down); z.removeEventListener('pointermove', move)
      z.removeEventListener('pointerup', up); z.removeEventListener('pointercancel', up)
      window.removeEventListener('keydown', tecla)
    }
  }, [])

  return (
    <div className="snake-zona" ref={zona}>
      <canvas ref={cv} className="snake-cv" />
      <p className="ayuda">💎 {puntos}/{OBJETIVO} {msg && `· ${msg}`}</p>
    </div>
  )
}
