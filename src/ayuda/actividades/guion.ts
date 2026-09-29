import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { MEDIDAS, SECCIONES, alturaEnMenu, entradaDe } from '../medidas';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import {
	BORRADOR, CUESTIONARIO, TAREA, alFotograma, rectCifra, rectCifras, rectColumnaRespuestas, rectCuerpoEntregas,
	rectFaltan, rectFila, rectLista, rectPregunta, rectRespondieron,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «ACTIVIDADES» (`/act`: en el menú, la sección Actividades ▸ Actividades).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA — corregida contra el código
 *
 *     El plan (§4.B) decía «“Respuestas” hoy sólo va con actividad compartida a alumnos». Eso era
 *     la pantalla vieja, `/actividades`, que ya no tiene entrada en el menú (sólo el botón «Ver las
 *     actividades de antes»). En `/act` es falso: **las respuestas se ven pulsando la fila entera**,
 *     y lo que abre depende del estado y del modo, no de a quién va (`act-bandeja.ts`, `destino()`):
 *     un borrador abre sus preguntas —«sin publicar», no le ha llegado a nadie—; una tarea
 *     publicada abre sus Entregas; un cuestionario o una encuesta, sus Resultados.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA    Actividades -> Actividades: la bandeja, «Las que creé»
 *     2. LA BANDEJA    «Respuestas» N de M; el borrador dice «sin publicar»
 *     3. RESULTADOS    la fila del cuestionario: respondieron, faltan, cada pregunta; «← Actividades»
 *     4. ENTREGAS      la fila de la tarea: las cifras, un alumno, su nota, que va a la planilla
 */

export const FPS = 30;

/* «Actividades» es una sección propia del menú (`menu.ts`), con «Actividades» dentro. */
export const MENU = SECCIONES;
export const SECCION = entradaDe(MENU, 'Actividades').seccion;
export const HIJA = entradaDe(MENU, 'Actividades', 'Actividades').hija!;

export const LLEGADA = {
	cursorEntra: 14,
	llegaAcademico: 40,
	pulsaAcademico: 46,
	abreAcademico: 48,
	llegaHija: 100,
	pulsaHija: 110,
	seVaLaCascara: 114,
	entraPanel: 144,
};
export const ENTRA = LLEGADA.entraPanel;
const L = (f: number) => ENTRA + f;

export const T = {
	cursorEntra: 30,
	/* El cuestionario. */
	llegaCuestionario: 380,
	pulsaCuestionario: 395,
	/* «← Actividades». */
	llegaVolver: 814,
	pulsaVolver: 826,
	/* La tarea. */
	llegaTarea: 915,
	pulsaTarea: 932,
	/* En Entregas: Mariana, y su nota. */
	llegaMariana: 1120,
	pulsaMariana: 1132,
	llegaNota: 1170,
	pulsaNota: 1180,
	teclas: [1195, 1203],
	cursorSale: 1250,
};
const IDA_Y_VUELTA = 15;
export const RESULTADOS_ = T.pulsaCuestionario + IDA_Y_VUELTA;
export const VUELVE_BANDEJA = T.pulsaVolver + IDA_Y_VUELTA;
export const ENTREGAS_ = T.pulsaTarea + IDA_Y_VUELTA;
export const ELIGE_MARIANA = T.pulsaMariana + 2;

const holgado = (r: { x: number; y: number; ancho: number; alto: number }, h = 5) => ({ x: r.x - h, y: r.y - h, ancho: r.ancho + h * 2, alto: r.alto + h * 2 });

export const FOCOS = {
	academico: enElFotograma({ x: 0, y: alturaEnMenu(MENU, SECCION, null, null), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	lista: alFotograma(holgado(rectLista(), 4)),
	respuestas: alFotograma(rectColumnaRespuestas()),
	borrador: alFotograma(holgado(rectFila(BORRADOR), 3)),
	cuestionario: alFotograma(holgado(rectFila(CUESTIONARIO), 3)),
	tarea: alFotograma(holgado(rectFila(TAREA), 3)),
	respondieron: alFotograma(holgado(rectRespondieron(), 4)),
	pregunta: alFotograma(holgado(rectPregunta(), 4)),
	faltan: alFotograma(holgado(rectFaltan(), 4)),
	cifras: alFotograma(holgado(rectCifras(), 4)),
	cuerpo: alFotograma(holgado(rectCuerpoEntregas(), 4)),
	planilla: alFotograma(holgado({ ...rectCifra(4), y: rectCifra(4).y + 12, alto: rectCifra(4).alto - 24 }, 4)),
};

export const PUNTOS_LLEGADA = {
	entrada: { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 150 },
	academico: { x: 150, y: alturaEnMenu(MENU, SECCION, null, null) + MEDIDAS.seccion / 2 },
	hija: { x: 150, y: alturaEnMenu(MENU, SECCION, HIJA, SECCION) + MEDIDAS.hija / 2 },
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Actividades', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_BANDEJA = { ubicacion: 'Menú ▸ Actividades ▸ Actividades', url: '/act' };
const EN_RESULTADOS = { ubicacion: 'Menú ▸ Actividades ▸ Actividades ▸ Resultados', url: '/act/41/resultados' };
const EN_ENTREGAS = { ubicacion: 'Menú ▸ Actividades ▸ Actividades ▸ Entregas', url: '/act/40/entregas' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Actividades tiene sección propia en el menú.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.pulsaAcademico + 20 },
	{ desde: L(4), texto: 'La bandeja: una fila por cada actividad que creaste.', ...EN_LA_BANDEJA, foco: FOCOS.lista },
	{ desde: L(142), texto: 'En Respuestas, cuántos respondieron: 5 de 6 en el repaso.', voz: 'En Respuestas, cuántos respondieron: cinco de seis.', ...EN_LA_BANDEJA, foco: FOCOS.respuestas },
	{ desde: L(291), texto: 'Pulsa la fila del cuestionario para ver sus respuestas.', ...EN_LA_BANDEJA, foco: FOCOS.cuestionario, focoHasta: L(T.pulsaCuestionario) },
	{ desde: L(RESULTADOS_ + 5), texto: 'Sus resultados: quién respondió y la nota, calculada sola.', ...EN_RESULTADOS, foco: FOCOS.respondieron },
	{ desde: L(575), texto: 'Por pregunta, cuántos acertaron cada una.', ...EN_RESULTADOS, foco: FOCOS.pregunta },
	{ desde: L(692), texto: 'En Faltan, quién no respondió, y un botón para recordarle.', ...EN_RESULTADOS, foco: FOCOS.faltan, focoHasta: L(T.llegaVolver) },
	{ desde: L(VUELVE_BANDEJA + 3), texto: 'Una tarea, en cambio, abre sus Entregas.', ...EN_LA_BANDEJA, foco: FOCOS.tarea, focoHasta: L(T.pulsaTarea) },
	{ desde: L(ENTREGAS_ + 30), texto: 'Arriba, la cuenta de entregas y de calificadas.', ...EN_ENTREGAS, foco: FOCOS.cifras },
	{ desde: L(1103), texto: 'Elige un alumno, lee su entrega y ponle la nota.', ...EN_ENTREGAS, foco: FOCOS.cuerpo },
	{ desde: L(1236), texto: 'Al guardarla, pasa sola a la planilla del periodo 2.', voz: 'Al guardarla, pasa sola a la planilla del periodo dos.', ...EN_ENTREGAS, foco: FOCOS.planilla },
];

export const TARJETA = L(1369);
export const DURACION = TARJETA + 120;

export const CLAVE = 'actividades';

export const TITULO = 'Actividades';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: el menú, Actividades' },
	{ desde: L(20), titulo: 'La bandeja: las que creaste' },
	{ desde: L(291), titulo: 'Las respuestas: pulsar la fila' },
	{ desde: L(VUELVE_BANDEJA + 3), titulo: 'Una tarea: sus Entregas' },
];

export const CIERRE: Cierre = {
	hiciste: 'Abriste los resultados de un cuestionario y las entregas de una tarea.',
	seVe: 'En la bandeja, «5 de 6» en Respuestas; al pulsar la fila, sus resultados.',
	despues: 'Un borrador no tiene respuestas: se publica con «Revisar y publicar».',
	voz: 'Un borrador se publica con Revisar y publicar.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* La pantalla cambia donde el rótulo que la cuenta ya habló de ella, y el foco no sobrevive al cambio. */
if (T.pulsaCuestionario + 10 > RESULTADOS_ || T.pulsaTarea + 10 > ENTREGAS_) { throw new Error('Guion: un foco sigue encendido cuando cambia la pantalla.'); }
if (L(VUELVE_BANDEJA) > PASOS[7].desde) { throw new Error('Guion: la bandeja vuelve después del rótulo que habla de ella.'); }
