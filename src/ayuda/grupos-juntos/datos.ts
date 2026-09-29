import { entra } from '../../comunes/movimiento';
import { LLEGADA, entre } from '../montar-el-ano/tiempo';
import type { EstadoGrupos, Juntos } from '../montar-el-ano/planoGrupos';
import { GRUPOS, grupo } from '../montar-el-ano/reparto';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «GRUPOS QUE VAN SIEMPRE JUNTOS»: LO QUE SE VE, Y CUÁNDO CAMBIA.
 *
 * LA HISTORIA: Prejardín, Jardín y Transición reciben las clases a la vez, en la misma aula y con la
 * misma maestra (Paola Andrea Quintero Mesa, titular de los tres). Se juntan en el recuadro de
 * arriba de Grupos, y la columna «Va junto con» de la rejilla lo refleja.
 *
 * LO QUE HACE, leído del código: guarda `grupos.juntos_con` (todos los del conjunto llevan el id del
 * mismo grupo) y **sólo lo lee el programa de horarios al importar** (`myvc_horarios`, importador
 * de MyVC) y la copia del año nuevo. Ni listas, ni notas, ni boletines lo miran: cada grupo sigue
 * siendo el suyo, con sus alumnos contados aparte en la rejilla.
 */

export const JUNTOS = ['Prejardín', 'Jardín', 'Transición'];
export const ALUMNOS_JUNTOS = JUNTOS.reduce((n, g) => n + grupo(g).alumnos, 0);

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
	llegaJuntar: 254,
	pulsaJuntar: 262,
	abreEditor: 264,
	/* Las tres fichas, a veinte fotogramas una de otra. */
	llegaFicha: [284, 304, 324],
	pulsaFicha: [292, 312, 332],
	llegaGuardar: 426,
	pulsaGuardar: 436,
	/** `juntar` vuelve: el aviso, el editor se cierra y la pantalla vuelve a leer los grupos. */
	guardado: 454,
	llegaSeparar: 760,
};

/** «A, B y C». */
const lista = (xs: string[]) => (xs.length < 2 ? xs[0] ?? '' : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`);
export const AVISO_JUNTOS = `${lista(JUNTOS)} van juntos`;

function juntosEn(f: number, fps: number): Juntos {
	if (f < M.abreEditor) { return { forma: 'vacio', encimaJuntar: entre(f, M.llegaJuntar, M.pulsaJuntar + 8) }; }
	if (f < M.guardado) {
		return {
			forma: 'editor',
			elegidos: JUNTOS.filter((_, i) => f >= M.pulsaFicha[i]),
			encimaGuardar: entre(f, M.llegaGuardar, M.pulsaGuardar + 8),
			cargando: entre(f, M.pulsaGuardar, M.guardado),
			aparece: entra(f, fps, M.abreEditor, 10),
		};
	}
	return {
		forma: 'conjuntos',
		conjuntos: [{ grupos: JUNTOS, alumnos: ALUMNOS_JUNTOS }],
		aparece: entra(f, fps, M.guardado, 10),
		encimaSeparar: f >= M.llegaSeparar,
	};
}

export function estadoEn(f: number, fps = 30): EstadoGrupos {
	const juntos = f >= M.guardado;
	return {
		ficha: null,
		juntos: juntosEn(f, fps),
		filas: GRUPOS.map((g) => ({
			nombre: g.nombre,
			juntos: juntos && JUNTOS.includes(g.nombre) ? JUNTOS.filter((x) => x !== g.nombre).join(', ') : '',
		})),
	};
}
