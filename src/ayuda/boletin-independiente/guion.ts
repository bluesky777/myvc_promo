import { Ritmo } from '../../notas/guion';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { RITMO_AYUDA } from '../planilla/guion';
import { FOCOS_LLEGADA } from '../planilla-nota-rapida/Llegada';
import { LLEGADA_RAPIDA, PASOS_DE_LLEGADA } from '../planilla-nota-rapida/llegada-rapida';
import { CAJA_AVISO, GEOMETRIA, alFotograma, enPlanilla, rectAlerta, rectCopiar, rectNota, rectTarjeta } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «BOLETÍN INDEPENDIENTE» (`/boletin-independiente/:asignatura_id`).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Marcarlo «aparte» lo hace secretaría; aquí sólo se monta y se califica.** El interruptor
 *     sale en la tarjeta, pero su guarda en el servidor es de administrador, secretaría o rectoría
 *     --explícitamente NO del docente--: al pulsarlo contesta 403, y la pantalla lo dice con su
 *     aviso («Marcar o quitar el boletín aparte no se hace desde aquí») y apaga los interruptores.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA   Mis asignaturas -> Planilla de 9°B -> el aviso de arriba y su enlace
 *     2. CALIFICAR    la nota que falta; se guarda AL SALIR de la casilla (`(change)`), no al teclear
 *     3. LO QUE NO    el interruptor: 403 y el aviso; y montar, que sí: «Copiar de…»
 *
 * La nota va por `notas/{id}` (un PUT): medio segundo hasta «Nota guardada» (`exito`).
 */

export const FPS = 30;

export const LLEGADA = LLEGADA_RAPIDA;
export const ENTRA = LLEGADA.entraLaPlanilla;
const L = (f: number) => ENTRA + f;

export const T = {
	cursorPlanilla: 40,
	llegaEnlace: 115,
	pulsaEnlace: 130,
	montaPagina: 148,
	cursorPagina: 160,
	pulsaNota: 300,
	teclea: 312,
	sueltaNota: 392,
	llegaInterruptor: 560,
	pulsaInterruptor: 572,
	responde: 592,
	llegaCopiar: 845,
	cursorSale: 900,
};
export const GUARDADA = T.sueltaNota + 15;
export const AVISO = { desde: L(GUARDADA), dura: 75 };

export const RITMO_PLANILLA: Ritmo = { ...RITMO_AYUDA, TECLEOS: [], CONFIRMA: 100000, SALIDA: 100000 };

/* ── Los focos ────────────────────────────────────────────────────────────────────────────── */

const holgado = (r: { x: number; y: number; ancho: number; alto: number }, h = 5) => ({ x: r.x - h, y: r.y - h, ancho: r.ancho + h * 2, alto: r.alto + h * 2 });

export const FOCOS = {
	...FOCOS_LLEGADA,
	aviso: enPlanilla(holgado(CAJA_AVISO, 6)),
	unidad: enPlanilla(holgado({ x: GEOMETRIA.cabecera(0).x, y: GEOMETRIA.cabecera(0).y - 45, ancho: GEOMETRIA.anchos.nota * 3, alto: 45 }, 3)),
	tarjeta: alFotograma(holgado(rectTarjeta(false), 4)),
	nota: alFotograma(holgado(rectNota(1, false), 8)),
	alerta: alFotograma(holgado(rectAlerta(), 4)),
	copiar: alFotograma(holgado(rectCopiar(true), 5)),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_LA_PLANILLA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Planilla', url: '/planilla-notas/1222' };
const EN_EL_BOLETIN = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Planilla ▸ Boletín independiente', url: '/boletin-independiente/1222' };

export const PASOS: Paso[] = [
	...PASOS_DE_LLEGADA(),
	{ desde: L(8), texto: 'Si alguien lleva boletín aparte, la planilla avisa arriba.', ...EN_LA_PLANILLA, foco: FOCOS.aviso, focoHasta: L(T.pulsaEnlace + 4) },
	{ desde: L(150), texto: 'Juliana no sale en la planilla: su boletín va aquí.', ...EN_EL_BOLETIN, foco: FOCOS.tarjeta },
	{ desde: L(276), texto: 'Escribe la nota: se guarda al salir de la casilla.', ...EN_EL_BOLETIN, foco: FOCOS.nota },
	{ desde: L(GUARDADA), texto: 'Sale «Nota guardada», y el resumen cuenta 2 de 2.', voz: 'Sale Nota guardada, y el resumen cuenta dos de dos.', ...EN_EL_BOLETIN },
	{ desde: L(542), texto: 'El interruptor «Aparte» no es tuyo: la pantalla lo dice.', voz: 'El interruptor Aparte no es tuyo: la pantalla lo dice.', ...EN_EL_BOLETIN },
	{ desde: L(681), texto: 'Lo marca secretaría o rectoría, en la ficha del alumno.', ...EN_EL_BOLETIN, foco: FOCOS.alerta },
	{ desde: L(825), texto: 'Montar sus unidades sí es tuyo: «Copiar de…».', voz: 'Montar sus unidades sí es tuyo: Copiar de.', ...EN_EL_BOLETIN, foco: FOCOS.copiar },
];

export const TARJETA = L(945);
export const DURACION = TARJETA + 150;

export const CLAVE = 'boletin-independiente';

export const TITULO = 'Boletín independiente';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: el aviso de la planilla' },
	{ desde: L(150), titulo: 'Calificar su boletín aparte' },
	{ desde: L(542), titulo: '«Aparte» lo marca secretaría' },
	{ desde: L(825), titulo: 'Montar: «Copiar de…»' },
];

export const CIERRE: Cierre = {
	hiciste: 'Calificaste el boletín aparte de una estudiante de 9°B.',
	seVe: 'Sale «Nota guardada», y su resumen dice 2 de 2 notas puestas.',
	despues: 'Para marcar o quitar «aparte», pídeselo a secretaría: se hace en la ficha del estudiante.',
	voz: 'Para marcar o quitar aparte, pídeselo a secretaría.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[5].desde !== AVISO.desde) { throw new Error('Guion: «Nota guardada» no sale donde empieza su paso.'); }
if (L(T.responde) > PASOS[7].desde - 30) { throw new Error('Guion: el aviso del 403 sale tarde para su rótulo.'); }
