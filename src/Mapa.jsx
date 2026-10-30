import { ICONOS } from './contenido.js'

// Posiciones de los 6 puntos (de abajo a arriba) y del tesoro, en un lienzo de 360x560
const N = [[60, 500], [265, 440], [95, 360], [270, 275], [85, 195], [245, 120]]
const T = [175, 48]
const P = [...N, T]

export default function Mapa({ hechas, siguiente, alNodo, alTesoro }) {
  const todo = hechas.length === N.length
  return (
    <svg viewBox="0 0 360 560" className="mapa">
      <defs>
        <radialGradient id="perg" cx="50%" cy="40%" r="75%">
          <stop offset="0" stopColor="#f3e4b8" /><stop offset="1" stopColor="#d3b377" />
        </radialGradient>

        <clipPath id="recorte"><rect x="6" y="6" width="348" height="548" rx="14" /></clipPath>
        <filter id="difuso"><feGaussianBlur stdDeviation="9" /></filter>
        
      </defs>
      <rect x="6" y="6" width="348" height="548" rx="14" fill="url(#perg)" stroke="#4a2f17" strokeWidth="3" />

      {/* Ruta: se dibuja en oro el tramo que sale de cada punto ya superado */}
      {N.map(([x, y], k) => (
        <line key={k} x1={x} y1={y} x2={P[k + 1][0]} y2={P[k + 1][1]} className={'ruta' + (hechas.includes(k) ? ' oro' : '')} />
      ))}

      {/* Niebla sobre lo que todavía no se puede ver */}
      <g clipPath="url(#recorte)">
        {N.map(([x, y], k) => k > siguiente && <circle key={k} cx={x} cy={y} r="46" className="niebla" />)}
        {!todo && <circle cx={T[0]} cy={T[1]} r="46" className="niebla" />}
      </g>

      {N.map(([x, y], k) => {
        const hecho = hechas.includes(k), actual = k === siguiente
        return (
          <g key={k} transform={`translate(${x} ${y})`} role="button" aria-label={`Punto ${k + 1}`}
             className={'nodo' + (hecho ? ' hecho' : '') + (actual ? ' actual' : '')}
             onClick={() => (hecho || actual) && alNodo(k)}>
            <circle r="38" fill="transparent" />
            <circle r="26" className="disco" />
            <text textAnchor="middle" dy=".35em" fontSize="26">{hecho || actual ? ICONOS[k] : '?'}</text>
          </g>
        )
      })}

      <g transform={`translate(${T[0]} ${T[1]})`} className={'nodo' + (todo ? ' actual' : '')} role="button" aria-label="Tesoro"
         onClick={() => todo && alTesoro()}>
        <circle r="42" fill="transparent" />
        <circle r="30" className="disco" />
        <text textAnchor="middle" dy=".35em" fontSize="30">{todo ? '🧰' : '❓'}</text>
      </g>
    </svg>
  )
}
