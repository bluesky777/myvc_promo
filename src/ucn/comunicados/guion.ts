/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL GUION DE «COMUNICADOS Y EVENTOS». Es el primero del vídeo del portal, y el que tiene que dejar
 * claro de qué va todo lo demás.
 *
 * LO QUE CUENTA, EN UNA FRASE: alguien de la Unión escribe un evento en el navegador y, al pulsar
 * «Publicar», eso está en el teléfono de 401 personas de trece colegios. No hay un paso intermedio,
 * ni un correo, ni una lista que alguien tenga que repartir.
 *
 * ── POR QUÉ EN ESTE ORDEN ──────────────────────────────────────────────────────────────────────
 *
 *   1  SE ESCRIBE EL EVENTO      el título se teclea, se elige cuándo y dónde
 *   2  SE ELIGE A QUIÉN LE LLEGA  y el portal responde con la cuenta: 401 personas
 *   3  SE ENCIENDEN LAS OPCIONES  confirmación, calendario, recordatorio
 *   4  SE PULSA PUBLICAR          y AHÍ sube el teléfono, por delante de todo
 *   5  LLEGA EL AVISO             el docente lo toca y se abre dentro de su app
 *   6  CONFIRMA                   y el contador del portal, detrás, se mueve
 *
 * EL SEIS ES EL REMATE y no es un adorno: enseña que esto no es un envío a ciegas. Lo que el docente
 * toca en su teléfono vuelve a la pantalla de quien lo escribió, en el mismo clip y sin cambiar de
 * plano. Un comunicado que sólo sale no se puede medir; éste se mide.
 */

export const FPS = 30;

/* ── 1: la pantalla del portal se monta ───────────────────────────────────────────────────── */

export const MARCO = 0;
export const TARJETA_COMPOSITOR = 26;
export const COLUMNA_DERECHA = 40;

/* ── 2: se escribe el evento ──────────────────────────────────────────────────────────────── */

/** El puntero llega a la píldora «Evento con fecha» y la enciende. */
export const CURSOR_ENTRA = 44;
export const CLIC_TIPO = 60;
/** El título se teclea. Es lo único que se escribe letra a letra: lo demás ya sería teatro. */
export const TITULO = 70;
export const POR_TECLA = 1.4;
export const CUANDO = 128;
export const DONDE = 138;

/* ── 3: a quién le llega ──────────────────────────────────────────────────────────────────── */

export const DESTINO_ROTULO = 152;
export const CLIC_COLEGIOS = 166;
export const CLIC_DOCENTES = 180;
export const CLIC_RECTORES = 192;
export const CLIC_COORDINADORES = 204;
/**
 * LA CUENTA SUBE DESPUÉS DEL ÚLTIMO CLIC, no antes. Que el número se mueva **al elegir el rol** es
 * lo que enseña que el portal sabe cuánta gente hay detrás de cada casilla; si apareciera hecho, se
 * leería como un rótulo escrito a mano.
 */
export const CUENTA = 210;

/* ── 4: las opciones de envío, y publicar ─────────────────────────────────────────────────── */

export const OPCIONES = 232;
export const PASO_OPCION = 9;
export const CURSOR_PUBLICAR = 262;
export const CLIC_PUBLICAR = 286;

/* ── 5: el teléfono ───────────────────────────────────────────────────────────────────────── */

/** Sube en cuanto se pulsa: la gracia es que las dos cosas pasen a la vez, no una después de otra. */
export const MOVIL = 292;
export const PUSH = 316;
export const DEDO = 348;
export const TOCA_PUSH = 366;
/** La pantalla del evento entra deslizando desde la derecha, como navega un teléfono. */
export const EVENTO = 374;
export const EVENTO_FILAS = 388;

/* ── 6: confirma, y el portal se entera ───────────────────────────────────────────────────── */

export const DEDO_CONFIRMA = 418;
export const TOCA_CONFIRMA = 436;
export const CONFIRMADO = 442;
/**
 * EL REMATE. El teléfono se retira y detrás queda la tarjeta del portal con el evento recién
 * publicado, en verde y con la cuenta ya movida. **El teléfono se va antes a propósito**: con él
 * delante, lo que hay que ver al final quedaría tapado justo cuando importa.
 *
 * Entre confirmar y esto hay treinta fotogramas de teléfono quieto, y no sobran: es el tiempo de
 * leer «Asistencia confirmada» y el 251. Un botón que cambia y desaparece no se ha visto.
 */
export const PORTAL_SUMA = 482;

export const SALIDA = 522;
export const DURACION = 568;
