/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL GUION DE «ENCUESTAS». TRES ACTOS, Y NINGUNO SE SOLAPA CON EL SIGUIENTE.
 *
 * ── POR QUÉ NO SE ENSEÑAN A LA VEZ LA WEB Y EL TELÉFONO ────────────────────────────────────────
 *
 * La primera versión de este clip los ponía uno al lado del otro: el docente tocaba una opción en el
 * móvil y, a la vez, en el árbol de la web se encendía la rama que le correspondía. Se leía mal --y
 * es un fallo de fondo, no de ritmo--: **parecía que las dos pantallas estaban conectadas en vivo**,
 * como si el navegador de la Unión supiera lo que un docente acaba de pulsar en su teléfono. Eso ni
 * pasa ni tiene por qué pasar, y prometerlo en un vídeo es prometer algo que no se puede enseñar
 * después en vivo.
 *
 * Así que van **en orden, como pasa de verdad**:
 *
 *   ACTO 1 · SE PREPARA     la encuesta se arma en el navegador, con sus preguntas y sus condiciones
 *   ACTO 2 · SE CONTESTA    horas después, en el teléfono de un docente, y él no ve la web
 *   ACTO 3 · SE MIRA        días después, la Unión abre los resultados
 *
 * Entre acto y acto la pantalla anterior **se va**: no hay dos cosas vivas al mismo tiempo.
 *
 * ── Y SIN EL RAIL DE LA IZQUIERDA ──────────────────────────────────────────────────────────────
 *
 * El menú de veinte apartados ya se enseñó en los clips anteriores. Aquí son 236 píxeles de franja
 * gastados en algo que no se va a usar, y los gráficos del acto 3 los necesitan.
 */

export const FPS = 30;

/* ── ACTO 1: la encuesta se prepara ───────────────────────────────────────────────────────── */

export const MARCO = 0;
export const CONSTRUCTOR = 22;
export const PREGUNTAS = 36;
export const PASO_PREGUNTA = 7;
export const NOTA = 100;

export const CURSOR_PUBLICAR = 132;
export const CLIC_PUBLICAR = 158;
/** La web se retira: lo que sigue pasa en otro sitio y en otro momento. */
export const WEB_SALE = 168;

/* ── ACTO 2: se contesta en el teléfono ───────────────────────────────────────────────────── */

export const MOVIL = 186;
export const PREGUNTA_2 = 212;

/** Contesta «No», y aparece una pregunta que antes no estaba. */
export const DEDO_NO = 232;
export const TOCA_NO = 250;
export const RAMA_NO = 258;

/**
 * CAMBIA LA RESPUESTA A «SÍ», y ahí está la demostración: donde había una pregunta aparecen dos
 * distintas, no la misma con otro texto.
 */
export const DEDO_SI = 306;
export const TOCA_SI = 324;
export const RAMA_SI = 332;

/** Y una respuesta baja en la escala abre una tercera, encadenada. */
export const DEDO_ESCALA = 380;
export const TOCA_ESCALA = 398;
export const RAMA_HONDA = 406;

/** Se envían. La app dice que quedaron guardadas: sin eso, el docente no sabe si contestó. */
export const DEDO_ENVIAR = 452;
export const TOCA_ENVIAR = 470;
export const GUARDADO = 478;
export const MOVIL_SALE = 512;

/* ── ACTO 3: los resultados ───────────────────────────────────────────────────────────────── */

export const RESULTADOS = 528;
export const KPIS = 552;
export const PASO_KPI = 6;

export const G_CAPACITACION = 588;
export const G_INTERES = 622;
export const G_APLICA = 654;
export const G_EXPERIENCIA = 676;
export const G_CAMPOS = 700;
export const G_DIA = 724;

export const SALIDA = 792;
export const DURACION = 840;
