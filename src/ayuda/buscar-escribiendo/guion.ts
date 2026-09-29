import { rectanguloDeMando } from '../BarraDeHoy';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { alFotograma, centro, holgura, union } from '../moverse/comun';
import { FALLAS, REPROBADAS, SIN_ESCRIBIR, VALEN, rectDeFila, rectDelCuadro, rectDelPie } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «IR A CUALQUIER SITIO ESCRIBIENDO» (Moverse por MyVC, ola 1).
 *
 * LA DUDA QUE MATA: `/` o Ctrl K; busca pantallas, informes y personas, y **por sinónimos**: quien
 * escribe «fallas» no encuentra esa palabra en ninguna pantalla, y aun así llega a Asistencias.
 *
 * EL PLAN DECÍA «Navegar… Ctrl K»: desde el 2026-09-26 el disparador dice «Buscador mágico…» y
 * lleva escrita la tecla «/» (`cascara/buscador/buscador.html:12-30`). Ctrl K sigue abriéndolo.
 *
 * CUATRO ACTOS
 *
 *     1. DÓNDE ESTÁ   el cuadro de la barra; se abre con «/» (tecla en pantalla)
 *     2. SINÓNIMOS    «fallas» -> Asistencias y el informe «Ver ausencias»
 *     3. PERSONAS     «valen» -> tres alumnos, de todos los años; Esc cierra, Ctrl K abre
 *     4. IR           «reprobadas» -> Notas perdidas; Intro, y la pantalla se monta
 *
 * EL RITMO: se teclea a dos fotogramas por letra, rápido como teclea quien ya sabe qué busca. Las
 * pantallas y los informes se filtran en memoria desde la primera letra; las personas van al
 * servidor 300 ms después de la última tecla (`buscador.ts:139-141`): nueve fotogramas.
 */

export const FPS = 30;
export const POR_LETRA = 2;
/** El respiro del servidor para las personas (debounce de 300 ms). */
export const ESPERA_PERSONAS = 9;

export const T = {
	cursorEntra: 14,
	llegaBuscador: 34,
	cursorSale: 100,

	teclaBarra: { desde: 128, pulsa: 142, hasta: 180 },
	abre1: 144,

	fallas: 347,
	valen: 565,

	teclaEsc: { desde: 725, pulsa: 739, hasta: 780 },
	cierra1: 741,
	teclaCtrlK: { desde: 786, pulsa: 800, hasta: 842 },
	abre2: 802,

	reprobadas: 820,

	teclaIntro: { desde: 1010, pulsa: 1026, hasta: 1070 },
	cierra2: 1028,
	montaLista: 1036,
};

/** Cuándo acaba de teclearse cada palabra. */
export const ACABA = {
	fallas: T.fallas + 'fallas'.length * POR_LETRA,
	valen: T.valen + 'valen'.length * POR_LETRA + ESPERA_PERSONAS,
	reprobadas: T.reprobadas + 'reprobadas'.length * POR_LETRA,
};

/**
 * LO QUE DICE LA ENTRADA Y LO QUE CONTESTA EL CUADRO, en cada fotograma. Mientras se teclea (medio
 * segundo) el cuadro sigue enseñando lo de antes y cambia de golpe con la última letra: los
 * resultados intermedios de «f», «fa»… no se inventan.
 */
export function buscado(frame: number): { texto: string; bloques: typeof FALLAS; aviso?: string } {
	const escribe = (palabra: string, desde: number) => palabra.slice(0, Math.max(0, Math.min(palabra.length, Math.floor((frame - desde) / POR_LETRA) + 1)));
	if (frame >= T.abre2) {
		if (frame < T.reprobadas) { return { texto: '', bloques: SIN_ESCRIBIR }; }
		return { texto: escribe('reprobadas', T.reprobadas), bloques: frame >= ACABA.reprobadas ? REPROBADAS : SIN_ESCRIBIR };
	}
	/* Las personas van al servidor: mientras vuelve, el cuadro dice «Buscando «valen»…» (`buscador.html`). */
	if (frame >= T.valen) {
		const texto = escribe('valen', T.valen);
		const tecleado = T.valen + 'valen'.length * POR_LETRA;
		if (frame < tecleado) { return { texto, bloques: FALLAS }; }
		return frame >= ACABA.valen ? { texto, bloques: VALEN } : { texto, bloques: [], aviso: `Buscando «${texto}»…` };
	}
	if (frame >= T.fallas) { return { texto: escribe('fallas', T.fallas), bloques: frame >= ACABA.fallas ? FALLAS : SIN_ESCRIBIR }; }
	return { texto: '', bloques: SIN_ESCRIBIR };
}

/* ── Dónde cae cada cosa ──────────────────────────────────────────────────────────────────── */

export const FOCOS = {
	buscador: alFotograma(holgura(rectanguloDeMando('buscador'), 4), 10),
	grupos: alFotograma(holgura(union(rectDeFila(SIN_ESCRIBIR, 0), rectDeFila(SIN_ESCRIBIR, 3)), 6), 10),
	asistencias: alFotograma(holgura(rectDeFila(FALLAS, 0), 2), 10),
	ausencias: alFotograma(holgura(rectDeFila(FALLAS, 1), 2), 10),
	personas: alFotograma(holgura(union(rectDeFila(VALEN, 0), rectDeFila(VALEN, 2)), 6), 10),
	perdidas: alFotograma(holgura(rectDelCuadro(REPROBADAS), -2), 12),
	pie: alFotograma(rectDelPie(REPROBADAS), 10),
};

export const PUNTOS = {
	entrada: { x: 760, y: 620 },
	buscador: centro(rectanguloDeMando('buscador')),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const ARRIBA = { ubicacion: 'Barra de arriba ▸ Buscador mágico', url: 'En todas las pantallas · tecla / o Ctrl K' };
const EN_NOTAS_PERDIDAS = { ubicacion: 'Menú ▸ Académico ▸ Notas perdidas', url: '/notas-perdidas' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'El Buscador mágico te lleva a cualquier sitio.', ...ARRIBA, foco: FOCOS.buscador },
	{ desde: 118, texto: 'Se abre con / o Ctrl K, fuera de una casilla.', voz: 'Se abre con barra o control K, fuera de una casilla.', ...ARRIBA },
	{ desde: 253, texto: 'Sin escribir, salen tus grupos.', ...ARRIBA, foco: FOCOS.grupos },
	{ desde: ACABA.fallas, texto: '«fallas» te lleva a Asistencias.', ...ARRIBA, foco: FOCOS.asistencias },
	{ desde: 467, texto: 'Y encuentra informes: Ver ausencias.', ...ARRIBA, foco: FOCOS.ausencias, focoHasta: T.valen - 12 },
	{ desde: ACABA.valen, texto: 'Personas, desde tres letras y de todos los años.', ...ARRIBA, foco: FOCOS.personas },
	{ desde: 719, texto: 'Esc lo cierra; Ctrl K lo vuelve a abrir.', voz: 'Escape lo cierra; control K lo vuelve a abrir.', ...ARRIBA },
	{ desde: ACABA.reprobadas, texto: '«reprobadas» encuentra Notas perdidas.', ...ARRIBA, foco: FOCOS.perdidas },
	{ desde: 961, texto: 'Flechas para moverte, Intro para abrir.', voz: 'Flechas para moverte, intro para abrir.', ...ARRIBA, foco: FOCOS.pie, focoHasta: T.teclaIntro.pulsa - 4 },
	{ desde: 1075, texto: 'Y llegas directo, sin el menú.', ...EN_NOTAS_PERDIDAS },
];

export const TARJETA = 1176;
export const DURACION = 1296;

export const CLAVE = 'buscar-escribiendo';
export const TITULO = 'Ir a cualquier sitio escribiendo';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: / o Ctrl K' },
	{ desde: PASOS[3].desde, titulo: 'Por sinónimos: «fallas»' },
	{ desde: PASOS[5].desde, titulo: 'Personas' },
	{ desde: PASOS[7].desde, titulo: 'Abrir con Intro' },
];

export const CIERRE: Cierre = {
	hiciste: 'Fuiste a una pantalla escribiendo, sin pasar por el menú.',
	seVe: 'Con Intro se abre la pantalla elegida: aquí, Notas perdidas.',
	despues: 'Dónde está cada cosa: el menú.',
	voz: 'Siguiente: el menú.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* Cada resultado sale donde empieza el paso que lo explica, y la tecla, dentro del suyo. */
if (PASOS[3].desde !== ACABA.fallas || PASOS[5].desde !== ACABA.valen || PASOS[7].desde !== ACABA.reprobadas) {
	throw new Error('Guion: un resultado no sale donde empieza el paso que lo explica.');
}
if (T.teclaBarra.pulsa < PASOS[1].desde || T.teclaEsc.pulsa < PASOS[6].desde || T.teclaIntro.pulsa < PASOS[8].desde) {
	throw new Error('Guion: una tecla se pulsa antes del paso que la explica.');
}
