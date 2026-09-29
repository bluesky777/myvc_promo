import { entra } from '../../comunes/movimiento';
import { LLEGADA, avance, entre, parpadea, tecleado } from '../montar-el-ano/tiempo';
import { opcionesDeGrupos } from '../montar-el-ano/opciones';
import { disposicion, MAIN, type Cuadre, type Desplegable, type EstadoAsignaturas } from '../montar-el-ano/planoAsignaturas';
import { AL_ENTRAR, EN_EL_ANO, asignaturasDeNoveno, enElCuadre, grupo, type Asignatura } from '../montar-el-ano/reparto';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «COPIAR LAS ASIGNATURAS DE UN GRUPO A OTRO»: LO QUE SE VE, Y CUÁNDO CAMBIA.
 *
 * LA HISTORIA: enero. 9°A ya tiene sus diez asignaturas y 9°B, que va igual, ninguna: el cuadre lo
 * dice al entrar («0 de 30 h»). Se filtra 9°B --la rejilla sale vacía--, se baja a «Copiar
 * asignaturas de un grupo a otro», origen 9°A, destino 9°B, y se copia.
 *
 * LO QUE COPIA, leído de `AsignaturasController::postCopiar`: un INSERT por asignatura con
 * `materia_id, profesor_id, nuevo_responsable_id, creditos, orden`. **Nada más**: ni los días, ni el
 * `porcentaje_area`, ni las notas ni lo que cuelga de ellas. Por eso las filas nuevas llegan con
 * «No» en los días y una raya en «% del área» donde 9°A tenía 80/20. Y no mira qué hay en el
 * destino: si 9°B ya tuviera asignaturas, las copiadas se sumarían a ellas.
 */

export const G9A = grupo('9°A');
export const G9B = grupo('9°B');

/** Las que llegan a 9°B: las de 9°A con ids nuevos, sin días y sin porcentaje del área. */
export const COPIADAS: Asignatura[] = asignaturasDeNoveno('9°B', 1650).map((a) => ({ ...a, area: a.area === 'solo' ? 'solo' : null }));

/* ── Los momentos ────────────────────────────────────────────────────────────────────────────── */

export const M = {
	/* La llegada por el menú, más corta que la común (`LLEGADA`): el vídeo de ayuda va a dos tercios. */
	...LLEGADA,
	cursorEntra: 14,
	llegaReferencias: 36,
	pulsaReferencias: 42,
	abreReferencias: 44,
	llegaEntrada: 76,
	pulsaEntrada: 84,
	monta: 88,
	llegaVerSus: 150,
	pulsaVerSus: 158,
	filtra: 160,
	bajaDesde: 250,
	bajaHasta: 286,
	llegaOrigen: 380,
	pulsaOrigen: 388,
	tecleaOrigen: 396,
	llegaOpcionOrigen: 414,
	pulsaOpcionOrigen: 420,
	llegaDestino: 434,
	pulsaDestino: 442,
	tecleaDestino: 450,
	llegaOpcionDestino: 468,
	pulsaOpcionDestino: 474,
	llegaCopiar: 488,
	pulsaCopiar: 496,
	/** «Asignaturas copiadas», y la lista se recarga. */
	copiadas: 512,
	subeDesde: 514,
	subeHasta: 546,
};

export const TECLEO = { origen: '9°A', destino: '9°B' };

/** Lo que baja la página para que la tarjeta de copiar y su desplegable quepan enteros. */
export const BAJADA = 300;

const suma = (xs: Asignatura[]) => xs.reduce((n, a) => n + a.ih, 0);

function cuadreEn(filtrado: boolean, filas: Asignatura[]): Cuadre {
	const s = suma(filas);
	if (!filtrado) {
		return { forma: 'lista', mensaje: '1 de 15 grupos no cuadra con su intensidad horaria', filas: [{ grupo: enElCuadre(G9B), cifras: `0 de ${G9B.ih} h`, diferencia: `faltan ${G9B.ih} horas` }] };
	}
	const falta = G9B.ih - s;
	return {
		forma: 'grupo',
		tipo: falta === 0 ? 'success' : 'warning',
		mensaje: `${enElCuadre(G9B)} · ${s} de ${G9B.ih} h asignadas · ${falta === 0 ? 'cuadra' : `faltan ${falta} horas`}`,
		detalle: `${filas.length} asignaturas en el grupo.`,
	};
}

export function estadoEn(f: number, fps = 30): EstadoAsignaturas {
	const filtrado = f >= M.filtra;
	const copiadas = f >= M.copiadas;
	const filas = !filtrado ? AL_ENTRAR : copiadas ? COPIADAS : [];
	const baja = avance(f, M.bajaDesde, M.bajaHasta) * (1 - avance(f, M.subeDesde, M.subeHasta));

	return {
		cuadre: cuadreEn(filtrado, filtrado ? filas : []),
		ficha: null,
		filtroGrupo: filtrado ? { nombre: G9B.nombre, titular: G9B.titular } : null,
		filtroProfesor: null,
		viendo: filtrado ? { de: copiadas ? EN_EL_ANO : EN_EL_ANO - 10 } : null,
		filas,
		copia: {
			origen: f >= M.pulsaOpcionOrigen ? G9A.nombre : null,
			destino: f >= M.pulsaOpcionDestino ? G9B.nombre : null,
			cargando: entre(f, M.pulsaCopiar, M.copiadas),
			encima: entre(f, M.llegaCopiar, M.pulsaCopiar + 8),
		},
		papelera: { abierta: false, filas: [] },
		desplazada: Math.round(baja * BAJADA),
		desplegable: desplegableEn(f, fps),
		encima: entre(f, M.llegaVerSus, M.pulsaVerSus + 8) ? 'verSus' : null,
	};
}

function desplegableEn(f: number, fps: number): Desplegable | null {
	if (entre(f, M.pulsaOrigen + 2, M.pulsaOpcionOrigen + 2)) {
		const b = f >= M.tecleaOrigen ? tecleado(f, TECLEO.origen, M.tecleaOrigen) : null;
		return { donde: 'origen', opciones: opcionesDeGrupos(b), resaltada: 0, elegida: f >= M.pulsaOpcionOrigen ? 0 : null, aparece: entra(f, fps, M.pulsaOrigen + 2, 8), busqueda: b, cursor: parpadea(f) };
	}
	if (entre(f, M.pulsaDestino + 2, M.pulsaOpcionDestino + 2)) {
		const b = f >= M.tecleaDestino ? tecleado(f, TECLEO.destino, M.tecleaDestino) : null;
		return { donde: 'destino', opciones: opcionesDeGrupos(b), resaltada: 0, elegida: f >= M.pulsaOpcionDestino ? 0 : null, aparece: entra(f, fps, M.pulsaDestino + 2, 8), busqueda: b, cursor: parpadea(f) };
	}
	return null;
}

/* Con la página bajada, la tarjeta de copiar y el desplegable más alto (cinco grupos) caben. */
{
	const e = estadoEn(M.pulsaOrigen + 4);
	const d = disposicion(e);
	const abajo = MAIN.y + d.copia - BAJADA + 40 + 12 + 32 + 4 + 8 + 5 * 48;
	if (abajo > 900) {
		throw new Error(`Datos: con la página bajada ${BAJADA}, el desplegable de copiar acaba en ${abajo} y la cáscara mide 900.`);
	}
}
