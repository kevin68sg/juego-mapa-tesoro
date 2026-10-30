import { useState } from 'react'
import { MEMORIA } from '../contenido.js'

const barajar = (a) => [...a].sort(() => Math.random() - 0.5)

export default function Memoria({ onGanar }) {
  const [cartas] = useState(() => barajar([...MEMORIA, ...MEMORIA].map((e, id) => ({ e, id }))))
  const [abiertas, setAbiertas] = useState([])   // ids boca arriba ahora mismo
  const [hechas, setHechas] = useState([])       // emojis ya emparejados
  const [intentos, setIntentos] = useState(0)

  const voltear = (c) => {
    if (abiertas.length === 2 || abiertas.includes(c.id) || hechas.includes(c.e)) return
    const nuevas = [...abiertas, c.id]
    setAbiertas(nuevas)
    if (nuevas.length === 2) {
      setIntentos((i) => i + 1)
      const [a, b] = nuevas.map((id) => cartas.find((x) => x.id === id))
      setTimeout(() => {
        if (a.e === b.e) {
          const h = [...hechas, a.e]
          setHechas(h)
          if (h.length === MEMORIA.length) setTimeout(onGanar, 500)
        }
        setAbiertas([])
      }, 800)
    }
  }
  return (
    <>
      <div className="rejilla memoria">
        {cartas.map((c) => {
          const visible = abiertas.includes(c.id) || hechas.includes(c.e)
          return <button key={c.id} className={'ficha' + (visible ? ' visible' : '')} onClick={() => voltear(c)}>{visible ? c.e : '✦'}</button>
        })}
      </div>
      <p className="ayuda">Intentos: {intentos}</p>
    </>
  )
}
