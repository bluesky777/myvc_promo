import { ALUMNOS, COLUMNAS, total } from '../../notas/planilla';
import { EstadoDePlanilla, geometriaDePlanilla, planillaEnElFotograma } from '../../notas/Escena';
import { RITMO_AYUDA } from '../planilla/guion';
import { SUBE_LA_PANTALLA } from '../tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN LA NOTA RÁPIDA, Y DÓNDE CAE.
 *
 * LA PLANILLA ES LA DE 9°B DESPUÉS DE `planilla-teclear`: Mateo con 92, Samuel con 78 y Valentina
 * con 55 en el quiz. Se sacan del guion de aquel vídeo, no se copian. Y **todo lo que este vídeo
 * cambia lo deshace antes de acabar** --que es además lo que enseña--, así que la planilla termina
 * como empezó y `cierre-1` sigue viendo el 55 de Valentina.
 *
 * LA MÁQUINA ES LA DE app2 (`paginas/notas/nota-rapida.ts`), copiada tal cual:
 *
 *     sin copia de antes      pone el valor y guarda la de antes
 *     valor distinto          pone el valor y guarda la de antes
 *     el mismo valor          DESHACE: vuelve la de antes
 *
 * y el valor vacío es `null`, que BORRA. La cabecera recorre **las filas que se ven**
 * (`alumnosFiltrados()`), y cada clic va al lote: 2 s de ventana desde el primero y la ida y vuelta.
 */

/* ── La franja de encima: la nota rápida y el buscador, en coordenadas del panel ──────────────── */

export const ENCIMA = {
	alto: 116,
	/** La fila de la nota rápida. */
	franja: { y: 0, alto: 44 },
	/** La fila del buscador. */
	buscador: { y: 54, alto: 44, ancho: 480 },
};

export const GEOMETRIA = geometriaDePlanilla({ encima: ENCIMA.alto });

/** Un poco más pequeña que en `planilla-teclear`: encima lleva dos filas más y tiene que caber. */
export const AJUSTE = { escala: 0.76, y: SUBE_LA_PANTALLA };

/* Las piezas de la franja, medidas desde su esquina (la del hueco de `encima`). */
export const PIEZAS = {
	casillaX: { x: 0, y: 10, ancho: 24, alto: 24 },
	/** El `Nota rápida` con su casilla: lo que se pulsa. */
	interruptor: { x: 0, y: 4, ancho: 150, alto: 36 },
	etiquetaValor: { x: 184 },
	campoValor: { x: 244, y: 2, ancho: 120, alto: 40 },
	hace: { x: 384 },
};

const E = GEOMETRIA.encima;
const enElPanel = (r: { x: number; y: number; ancho: number; alto: number }, dy = 0) => ({ x: E.x + r.x, y: E.y + dy + r.y, ancho: r.ancho, alto: r.alto });

export const EN_EL_PANEL = {
	interruptor: enElPanel(PIEZAS.interruptor),
	campoValor: enElPanel(PIEZAS.campoValor),
	/** La franja entera, del interruptor al final del texto de lo que hace el clic. */
	franja: enElPanel({ x: 0, y: 0, ancho: PIEZAS.hace.x + 300, alto: ENCIMA.franja.alto }),
	valorYHace: enElPanel({ x: PIEZAS.etiquetaValor.x - 12, y: 0, ancho: PIEZAS.hace.x + 312 - PIEZAS.etiquetaValor.x, alto: ENCIMA.franja.alto }),
	buscador: enElPanel({ x: 0, y: 0, ancho: ENCIMA.buscador.ancho, alto: ENCIMA.buscador.alto }, ENCIMA.buscador.y),
};

export const fotograma = (r: { x: number; y: number; ancho: number; alto: number }) => planillaEnElFotograma(GEOMETRIA, r, AJUSTE);

/* ── Lo que se pulsa ─────────────────────────────────────────────────────────────────────────── */

export const VALENTINA = ALUMNOS.findIndex((a) => a.nombre.startsWith('Escobar Lozano'));
export const QUIZ = COLUMNAS.indexOf('Quiz');

/** Lo que se teclea en el buscador: casa con «Rojas VALencia» y con «VALentina». */
export const BUSQUEDA = 'val';

/** Las notas al abrir: las de `notas/planilla.ts` con los tres tecleos de `planilla-teclear`. */
export const NOTAS_DE_PARTIDA: (number | null)[][] = ALUMNOS.map((a, fila) => {
	const notas = [...a.notas];
	const t = RITMO_AYUDA.TECLEOS.find((x) => x.fila === fila);
	if (t) { notas[1] = Number(t.valor); }
	return notas;
});

/* ── El buscador, como en app2: subcadena sin acentos del nombre, de una nota o del total ─────── */

const sinAcentos = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function filasQueCasan(texto: string, notas: (number | null)[][]): number[] {
	const t = sinAcentos(texto.trim());
	return ALUMNOS.map((_, i) => i).filter((i) => {
		if (!t) { return true; }
		if (sinAcentos(ALUMNOS[i].nombre.replace(',', '')).includes(t)) { return true; }
		if (notas[i].some((n) => String(n ?? '').includes(t))) { return true; }
		return String(total(notas[i]) ?? '').includes(t);
	});
}

/* ── La máquina ─────────────────────────────────────────────────────────────────────────────── */

export interface Clic {
	/** Fotograma LOCAL de la planilla. */
	frame: number;
	/** Una casilla (`fila`) o la cabecera de la columna (`fila: null`: todas las que se ven). */
	fila: number | null;
	columna: number;
}

export interface Tiempos {
	/** Cuándo se marca «Nota rápida». */
	activa: number;
	/** El valor del campo en cada momento: `null` es vacío. */
	valores: { desde: number; valor: number | null }[];
	/** El buscador: cuándo se teclea y cuándo se borra, letra a letra. */
	busca: { empieza: number; borra: number; porTecla: number };
	clics: Clic[];
}

/** Lo que tarda un clic en volver confirmado: 2 s de ventana del lote y la ida y vuelta. */
export const LO_QUE_TARDA_EL_LOTE = 75;

export function valorEn(t: Tiempos, frame: number): number | null {
	let v: number | null = null;
	t.valores.forEach((x) => { if (frame >= x.desde) { v = x.valor; } });
	return v;
}

export function busquedaEn(t: Tiempos, frame: number): string {
	const { empieza, borra, porTecla } = t.busca;
	if (frame < empieza) { return ''; }
	const puestas = Math.min(BUSQUEDA.length, Math.floor((frame - empieza) / porTecla) + 1);
	if (frame < borra) { return BUSQUEDA.slice(0, puestas); }
	const quitadas = Math.min(BUSQUEDA.length, Math.floor((frame - borra) / porTecla) + 1);
	return BUSQUEDA.slice(0, BUSQUEDA.length - quitadas);
}

export interface Resultado extends EstadoDePlanilla {
	/** Lo que dice cada aviso de lote, y cuándo sale. */
	avisos: { desde: number; texto: string }[];
}

const textoDeNota = (n: number | null) => (n === null ? '(vacía)' : String(n));

/**
 * LA PLANILLA EN UN FOTOGRAMA: se aplican, en orden, los clics que ya pasaron. Es la misma cuenta
 * que hace app2, y por eso el total que se ve (60 con la casilla vacía, 40 con un 0) no se escribe
 * a mano en ningún sitio.
 */
export function estadoEn(t: Tiempos, frame: number): Resultado {
	const notas = NOTAS_DE_PARTIDA.map((n) => [...n]);
	const copias: (number | null | undefined)[][] = notas.map((n) => n.map(() => undefined));
	const aros: ({ desde: number; confirma: number } | null)[][] = notas.map((n) => n.map(() => null));
	const avisos: { desde: number; texto: string }[] = [];

	for (const clic of t.clics) {
		if (clic.frame > frame) { break; }
		const valor = valorEn(t, clic.frame);
		const filas = clic.fila === null ? filasQueCasan(busquedaEn(t, clic.frame), notas) : [clic.fila];
		const guardadas: (number | null)[] = [];

		for (const f of filas) {
			const c = clic.columna;
			const nota = notas[f][c];
			/* `nadaQueBorrar`: borrar lo que ya está vacío no es nada. */
			if (valor === null && copias[f][c] === undefined && nota === null) { continue; }

			if (copias[f][c] === undefined || valor !== nota) {
				copias[f][c] = nota;
				notas[f][c] = valor;
			} else {
				const antes = copias[f][c] as number | null;
				copias[f][c] = nota;
				notas[f][c] = antes;
			}
			aros[f][c] = { desde: clic.frame, confirma: clic.frame + LO_QUE_TARDA_EL_LOTE };
			guardadas.push(notas[f][c]);
		}

		if (guardadas.length > 0) {
			const verbo = guardadas.length === 1 ? 'Cambiada' : 'Cambiadas';
			avisos.push({ desde: clic.frame + LO_QUE_TARDA_EL_LOTE, texto: `${verbo}: ${guardadas.map(textoDeNota).join(', ')}` });
		}
	}

	const busqueda = busquedaEn(t, frame);
	return {
		notas,
		aros,
		avisos,
		filas: busqueda ? filasQueCasan(busqueda, notas) : undefined,
	};
}
