import { Suspense, useEffect, useState } from 'react'
import Mapa from './Mapa.jsx'
import Tesoro from './Tesoro.jsx'
import { MINIJUEGOS } from './minijuegos/index.js'
import { NOMBRE, BIENVENIDA, RECUERDOS } from './contenido.js'

const CLAVE = 'mapa-tesoro-v1'

// El progreso se guarda en el móvil: si cierra el navegador o recibe una llamada, no pierde nada.
// Para empezar de cero al probar, abre la web con ?reset al final de la dirección.
function cargar() {
  try {
    if (location.search.includes('reset')) { localStorage.removeItem(CLAVE); return [] }
    return JSON.parse(localStorage.getItem(CLAVE)) || []
  } catch { return [] }
}

export default function App() {
  const [hechas, setHechas] = useState(cargar)
  const [fase, setFase] = useState('inicio')
  const [actual, setActual] = useState(0)
  const [intento, setIntento] = useState(0)    // cambiar la key reinicia el minijuego

  useEffect(() => { try { localStorage.setItem(CLAVE, JSON.stringify(hechas)) } catch {} }, [hechas])

  const ganar = () => {
    setHechas((h) => (h.includes(actual) ? h : [...h, actual]))
    navigator.vibrate?.(60)
    setFase('recuerdo')
  }
  const J = MINIJUEGOS[actual]
  const todo = hechas.length === MINIJUEGOS.length

  return (
    <div className="app">
      {fase === 'inicio' && (
        <div className="pantalla centro">
          <h1>Feliz cumple, {NOMBRE} quesito jajaja</h1>
          <p className="texto">{BIENVENIDA}</p>
          {hechas.length > 0 ? (
            <div className="fin">
              <button className="btn" onClick={() => setFase('mapa')}>Continuar partida</button>
              <button className="btn sec" onClick={() => {
                if (window.confirm('¿Empezar de cero? Se borrará el progreso.')) { setHechas([]); setFase('mapa') }
              }}>Empezar de cero</button>
            </div>
          ) : (
            <button className="btn" onClick={() => setFase('mapa')}>Iniciar</button>
          )}
        </div>
      )}

      {fase === 'mapa' && (
        <div className="pantalla">
          <div className="cab">
            <h2>Mapa del tesoro</h2>
            <div className="acciones">
              <span>{hechas.length}/{MINIJUEGOS.length}</span>
              <button className="btn mini sec" onClick={() => setFase('inicio')}>Inicio</button>
            </div>
          </div>
          <p className="ayuda">eh tienes que completar todos estos juegos para llegar al tesoro (yo)</p>
          <p className="ayuda">{todo ? '¡El mapa está completo! Toca el cofre BB .' : 'Toca el siguiente punto del mapa.'}</p>
          <Mapa
            hechas={hechas}
            siguiente={hechas.length}
            alNodo={(k) => {
              setActual(k)
              if (hechas.includes(k)) setFase('recuerdo')
              else { setIntento((n) => n + 1); setFase('juego') }
            }}
            alTesoro={() => setFase('tesoro')}
          />
        </div>
      )}

      {fase === 'juego' && (
        <div className="pantalla">
          <div className="cab">
            <h2>{J.titulo}</h2>
            <div className="acciones">
              <button className="btn mini sec" onClick={() => setIntento((n) => n + 1)}>Reiniciar</button>
              <button className="btn mini" onClick={() => setFase('mapa')}>Volver</button>
            </div>
          </div>
          <p className="ayuda">{J.ayuda}</p>
          <div className="cuerpo">
            <Suspense fallback={<p className="ayuda">Cargando…</p>}>
              <J.Comp key={intento} onGanar={ganar} />
            </Suspense>
          </div>
        </div>
      )}

      {fase === 'recuerdo' && (
        <div className="pantalla centro">
          <div className="card">
            <h2>{RECUERDOS[actual].titulo}</h2>
            <p className="recuerdo">{RECUERDOS[actual].texto}</p>
            <div className="fin">
              {hechas.includes(actual) && (
                <button className="btn sec" onClick={() => { setIntento((n) => n + 1); setFase('juego') }}>Jugar otra vez</button>
              )}
              <button className="btn" onClick={() => setFase('mapa')}>Volver al mapa</button>
            </div>
          </div>
        </div>
      )}

      {fase === 'tesoro' && (
        <Tesoro
          alMapa={() => setFase('mapa')}
          alReiniciar={() => {
            if (window.confirm('¿Empezar de nuevo? Se borrará todo el progreso.')) { setHechas([]); setActual(0); setFase('inicio') }
          }}
        />
      )}
    </div>
  )
}
