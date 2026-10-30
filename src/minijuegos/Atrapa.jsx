import { useEffect, useRef } from 'react'
import Phaser from 'phaser'

const OBJETIVO = 10
// S = densidad de píxeles del móvil. Dibujamos a escala S para que no se vea borroso.
// Todo el código usa "unidades de 360x520" y las multiplica por S.
const S = Math.min(window.devicePixelRatio || 1, 3)
const W = 360 * S, H = 520 * S

class Escena extends Phaser.Scene {
  constructor(onGanar) { super('Atrapa'); this.onGanar = onGanar }

  estilo(px, color = '#ffffff', fuente = 'Nunito, sans-serif') {
    return { fontSize: `${px * S}px`, color, fontFamily: fuente }
  }

  create() {
    this.puntos = 0; this.vidas = 3; this.items = []; this.fin = false; this.agarre = null
    this.cesta = this.add.text(W / 2, H - 70 * S, '🧺', this.estilo(46)).setOrigin(0.5)
    this.hud = this.add.text(12 * S, 10 * S, '', this.estilo(22, '#ffe9a8'))
    this.pintar()

    // Táctil: control RELATIVO (la cesta se mueve lo que mueves el dedo, sin saltar ni quedar tapada por el dedo).
    // Ratón: la cesta sigue al cursor.
    this.input.on('pointerdown', (p) => {
      if (p.wasTouch) this.agarre = { px: p.x, cx: this.cesta.x }
      else this.mover(p.x)
    })
    this.input.on('pointermove', (p) => {
      if (!p.wasTouch) this.mover(p.x)
      else if (p.isDown && this.agarre) this.mover(this.agarre.cx + (p.x - this.agarre.px) * 1.3)
    })
    this.cursores = this.input.keyboard.createCursorKeys()
    this.time.addEvent({ delay: 600, loop: true, callback: () => this.soltar() })
  }

  mover(x) { this.cesta.x = Phaser.Math.Clamp(x, 30 * S, W - 30 * S) }
  pintar() { this.hud.setText(`💗 ${this.puntos}/${OBJETIVO}   ${'❤️'.repeat(this.vidas)}`) }

  soltar() {
    if (this.fin) return
    const bueno = Math.random() < 0.68
    const t = this.add.text(Phaser.Math.Between(30 * S, W - 30 * S), -20 * S, bueno ? '💗' : '☄️', this.estilo(34)).setOrigin(0.5)
    t.bueno = bueno
    t.vel = (Phaser.Math.Between(160, 220) + this.puntos * 12) * S   // cada corazón acelera un poco
    this.items.push(t)
  }

  update(_, dt) {
    if (this.fin) return
    dt = Math.min(dt, 50)    // si la pestaña se queda en segundo plano, evita saltos enormes
    if (this.cursores.left.isDown) this.mover(this.cesta.x - 320 * S * dt / 1000)
    if (this.cursores.right.isDown) this.mover(this.cesta.x + 320 * S * dt / 1000)
    this.items = this.items.filter((t) => {
      t.y += (t.vel * dt) / 1000
      if (Math.abs(t.x - this.cesta.x) < 40 * S && Math.abs(t.y - this.cesta.y) < 34 * S) {
        if (t.bueno) this.puntos++
        else { this.vidas--; this.cameras.main.shake(150, 0.01); navigator.vibrate?.(80) }
        this.pintar(); t.destroy()
        if (this.puntos >= OBJETIVO) this.terminar(true)
        else if (this.vidas <= 0) this.terminar(false)
        return false
      }
      if (t.y > H + 20 * S) { t.destroy(); return false }
      return true
    })
  }

  terminar(gana) {
    this.fin = true
    this.add.text(W / 2, H / 2, gana ? '¡Lo lograste!' : 'Ay… otra vez', this.estilo(40, '#ffffff', 'Caveat, cursive')).setOrigin(0.5)
    this.time.delayedCall(1100, () => (gana ? this.onGanar() : this.scene.restart()))
  }
}

export default function Atrapa({ onGanar }) {
  const ref = useRef(null)
  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO, parent: ref.current, width: W, height: H, backgroundColor: '#12303b',
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      input: { touch: { capture: true } },
      scene: new Escena(onGanar)
    })
    return () => game.destroy(true)
  }, [])
  return <div ref={ref} className="lienzo" />
}
