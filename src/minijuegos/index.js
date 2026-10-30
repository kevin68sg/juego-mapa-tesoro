import { lazy } from 'react'
import Memoria from './Memoria.jsx'
import Snake from './Snake.jsx'
import Quiz from './Quiz.jsx'
import Simon from './Simon.jsx'
import Palabra from './Palabra.jsx'

// Phaser pesa bastante: se descarga solo al abrir el minijuego que lo usa (así la web inicial carga rápido en el móvil)
const Atrapa = lazy(() => import('./Atrapa.jsx'))

// El orden de esta lista es el orden de los puntos del mapa. Cada Comp recibe { onGanar }.
export const MINIJUEGOS = [
  { titulo: 'Parejas', ayuda: 'Encuentra las 6 parejas.', Comp: Memoria },
  { titulo: 'Atrapa corazones', ayuda: 'Desliza el dedo para mover la cesta. Atrapa 10 💗 y esquiva los meteoritos: 3 golpes y vuelves a empezar.', Comp: Atrapa },
  { titulo: 'Serpiente', ayuda: 'Desliza el dedo para girar. Recoge 5 💎 sin chocar con las paredes ni contigo. Cada gema te hace más rápida.', Comp: Snake },
  { titulo: 'Relámpago de recuerdos', ayuda: '10 segundos por pregunta. Necesitas 3 aciertos de 4.', Comp: Quiz },
  { titulo: 'Simon', ayuda: 'Repite la secuencia de luces. Son 5 rondas.', Comp: Simon },
  { titulo: 'Palabra secreta', ayuda: 'Adivina la palabra en 6 intentos.', Comp: Palabra }
]
