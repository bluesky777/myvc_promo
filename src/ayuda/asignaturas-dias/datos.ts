import { Easing } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { LLEGADA, avance, entre, parpadea, tecleado } from '../montar-el-ano/tiempo';
import { opcionesDeDocentes } from '../montar-el-ano/opciones';
import { COLUMNAS, HASTA_EL_VIERNES, MAIN, type Desplegable, type EstadoAsignaturas, type FilaVista } from '../montar-el-ano/planoAsignaturas';
import { anchoTotal } from '../montar-el-ano/Rejilla';
import { AL_ENTRAR, EN_EL_ANO, PRIMER_ID_9A, PRIMER_ID_9B, asignaturasDeNoveno, type Asignatura } from '../montar-el-ano/reparto';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «LOS DÍAS DE CLASE DE UNA ASIGNATURA»: LO QUE SE VE, Y CUÁNDO CAMBIA.
 *
 * LA HISTORIA: Marcela Zapata Iregui dicta Inglés en preescolar y Lengua e Inglés en 9°A, 9°B y
 * 10°A. Se filtra por ella, se desplaza la rejilla hasta los días --con el menú desplegado no caben
 * en 1440 y quedan a la derecha--, y a Lengua Castellana de 9°B se le marcan lunes, miércoles y
 * viernes.
 *
 * CÓMO SE COMPORTA CADA BOTÓN, leído de `boton-dia.ts`: se pinta primero («Sí» en azul) y pregunta
 * después (`toggle-dia`), con el botón girando mientras va y vuelve; **no hay aviso de éxito**, sólo
 * «Cambio no guardado: …» si el servidor dice que no, y entonces el botón vuelve solo.
 */

const DE_9A = asignaturasDeNoveno('9°A', PRIMER_ID_9A);
const DE_9B = asignaturasDeNoveno('9°B', PRIMER_ID_9B);
const de = (xs: Asignatura[], materia: string) => xs.find((a) => a.materia === materia)!;
const preescolar = (grupo: string) => AL_ENTRAR.find((a) => a.grupo === grupo && a.materia === 'Inglés');

/** Las nueve de Marcela, en el orden de la rejilla (por el orden del grupo). */
export const DE_MARCELA: Asignatura[] = [
	preescolar('Prejardín')!,
	{ ...preescolar('Prejardín')!, id: 1016, grupo: 'Jardín' },
	{ ...preescolar('Prejardín')!, id: 1024, grupo: 'Transición' },
	de(DE_9A, 'Lengua Castellana'),
	de(DE_9A, 'Inglés'),
	de(DE_9B, 'Lengua Castellana'),
	de(DE_9B, 'Inglés'),
	{ ...de(DE_9B, 'Lengua Castellana'), id: 1540, grupo: '10°A' },
	{ ...de(DE_9B, 'Inglés'), id: 1541, grupo: '10°A', ih: 3 },
];

export const LA_QUE_SE_MARCA = DE_MARCELA.findIndex((a) => a.grupo === '9°B' && a.materia === 'Lengua Castellana');

/** Lunes, miércoles y viernes: los índices de los días que se pulsan. */
export const DIAS_QUE_SE_MARCAN = [0, 2, 4];

/* ── Los momentos ────────────────────────────────────────────────────────────────────────────── */

export const M = {
	/* La llegada de siempre, apretada: el camino por el menú se conserva, sólo va más deprisa. */
	...LLEGADA,
	cursorEntra: 14,
	llegaReferencias: 40,
	pulsaReferencias: 46,
	abreReferencias: 48,
	llegaEntrada: 88,
	pulsaEntrada: 98,
	monta: 102,
	llegaFiltro: 132,
	pulsaFiltro: 140,
	tecleaFiltro: 148,
	llegaOpcionFiltro: 188,
	pulsaOpcionFiltro: 194,
	filtra: 196,
	/* La barra de la rejilla: se agarra y se arrastra a la derecha. */
	llegaBarra: 254,
	agarraBarra: 260,
	sueltaBarra: 290,
	/* Los tres días, a 26 fotogramas uno de otro. */
	pulsaDia: [378, 404, 430],
	/** Lo que tarda `toggle-dia` en volver: el botón gira ese rato. */
	vuelo: 12,
};

export const TECLEO = { filtro: 'Marcela' };

/** Dónde queda la barra: el pulgar mide `ancho² / total` y se mueve en proporción. */
export const RECORRIDO_BARRA = (HASTA_EL_VIERNES * MAIN.ancho) / anchoTotal(COLUMNAS);

export function estadoEn(f: number, fps = 30): EstadoAsignaturas {
	const filtrado = f >= M.filtra;
	/* Con la misma curva que el puntero (`Cursor`): el pulgar va pegado a la mano que lo arrastra. */
	const desplazada = Math.round(Easing.inOut(Easing.cubic)(avance(f, M.agarraBarra, M.sueltaBarra)) * HASTA_EL_VIERNES);

	const filas: FilaVista[] = filtrado
		? DE_MARCELA.map((a, i) => {
			if (i !== LA_QUE_SE_MARCA) { return a; }
			const dias = a.dias.map((si, d) => {
				const k = DIAS_QUE_SE_MARCAN.indexOf(d);
				return k >= 0 && f >= M.pulsaDia[k] ? true : si;
			}) as Asignatura['dias'];
			const vuela = DIAS_QUE_SE_MARCAN.find((d, k) => entre(f, M.pulsaDia[k], M.pulsaDia[k] + M.vuelo));
			const encima = DIAS_QUE_SE_MARCAN.find((d, k) => entre(f, M.pulsaDia[k] - 10, M.pulsaDia[k] + 6));
			return { ...a, dias, volando: vuela === undefined ? null : `d${vuela}`, encima: encima === undefined ? null : `d${encima}` };
		})
		: AL_ENTRAR;

	return {
		cuadre: { forma: 'linea', tipo: 'success', mensaje: 'Los 15 grupos con intensidad horaria puesta cuadran con sus asignaturas' },
		ficha: null,
		filtroGrupo: null,
		filtroProfesor: filtrado ? 'zapata' : null,
		viendo: filtrado ? { de: EN_EL_ANO } : null,
		filas,
		desplazadaRejilla: filtrado ? desplazada : 0,
		copia: { origen: null, destino: null },
		papelera: { abierta: false, filas: [] },
		desplegable: desplegableEn(f, fps),
	};
}

function desplegableEn(f: number, fps: number): Desplegable | null {
	if (!entre(f, M.pulsaFiltro + 2, M.pulsaOpcionFiltro + 2)) { return null; }
	const b = f >= M.tecleaFiltro ? tecleado(f, TECLEO.filtro, M.tecleaFiltro) : null;
	return {
		donde: 'filtroProfesor',
		opciones: opcionesDeDocentes(b),
		resaltada: 0,
		elegida: f >= M.pulsaOpcionFiltro ? 0 : null,
		aparece: entra(f, fps, M.pulsaFiltro + 2, 8),
		busqueda: b,
		cursor: parpadea(f),
	};
}
