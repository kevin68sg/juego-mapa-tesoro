// ============================================================
//  TODO LO PERSONAL VA AQUÍ. Edita este archivo y ya.
//  Sustituye los textos de ejemplo por vuestros recuerdos.
// ============================================================

// Nombre de la persona a la que va dirigido el juego
export const NOMBRE = "Nombre"

// Texto de la pantalla de inicio, debajo de "Feliz cumpleaños"
export const BIENVENIDA = "Un pirata ha escondido un tesoro solo para ti. Supera las seis pruebas y reclama tu recompensa."

// Icono de cada punto del mapa (6) y lo que se revela al superar su prueba
export const ICONOS = ["🏝️", "🌴", "⛰️", "🏰", "🌋", "⚓"]
export const RECUERDOS = [
  { titulo: "Primera pista", texto: "Recuerdo 1: cuenta cómo os conocisteis." },
  { titulo: "Segunda pista", texto: "Recuerdo 2: una anécdota o broma interna." },
  { titulo: "Tercera pista", texto: "Recuerdo 3: un lugar o una fiesta que no olvidaréis." },
  { titulo: "Cuarta pista", texto: "Recuerdo 4: vuestra primera cita o salida." },
  { titulo: "Quinta pista", texto: "Recuerdo 5: un momento que te hizo sentir especial." },
  { titulo: "Última pista", texto: "Recuerdo 6: lo que más te gusta de ella o de vuestra relación." }
]

// Minijuego "Parejas": 6 emojis DISTINTOS que representen cosas vuestras (se duplican solos)
export const MEMORIA = ["⭐", "🎵", "🌙", "🎬", "☕", "🐢"]

// Minijuego "Relámpago": 4 preguntas, 10 s cada una, hay que acertar 3.
// "correcta" es la posición de la respuesta correcta en "opciones", empezando a contar desde 0.
export const QUIZ = [
  { pregunta: "¿Dónde nos conocimos?", opciones: ["Opción A (esta)", "Opción B", "Opción C", "Opción D"], correcta: 0 },
  { pregunta: "¿Qué artista o canción tenemos en común?", opciones: ["Opción A", "Opción B(esta)", "Opción C", "Opción D"], correcta: 1 },
  { pregunta: "¿Qué comimos en nuestra primera salida?", opciones: ["Opción A", "Opción B(esta)", "Opción C", "Opción D"], correcta: 2 },
  { pregunta: "¿Quién era nuestro amigo en común?", opciones: ["Opción A", "Opción B", "Opción C(esta)", "Opción D"], correcta: 3 }
]

// Minijuego "Palabra secreta": una palabra de 4 a 7 letras con significado para vosotros
export const PALABRA = "Luna"
export const PISTA_PALABRA = "Escribe aquí una pista sobre la palabra."

// Carta final: se escribe con efecto máquina de escribir. Termina con la pregunta que quieras hacer.
export const CARTA = `Nombre,

Hice este mapa para ti porque quería regalarte algo diferente.

Aquí va la carta de verdad: escribe aquí lo que quieras decirle, lo que han vivido juntos y lo que esperas del futuro.

Así que me queda una pregunta:

¿Quieres...? (aqui le haces la pregunta)`

// Lo que aparece cuando responde "Sí"
export const DESPEDIDA = "¡Genial! Ya no hay vuelta atrás. 💫"




