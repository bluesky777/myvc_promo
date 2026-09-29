import { entra } from '../../comunes/movimiento';
import { LLEGADA, avance, entre, parpadea, tecleado } from '../montar-el-ano/tiempo';
import { opcionesDeDocentes, opcionesDeGrupos } from '../montar-el-ano/opciones';
import type { Cuadre, DetalleBorrado, Desplegable, EstadoAsignaturas, EstadoFicha, FilaVista } from '../montar-el-ano/planoAsignaturas';
import { disposicion, MAIN } from '../montar-el-ano/planoAsignaturas';
import { AL_ENTRAR, EN_EL_ANO, PRIMER_ID_9B, asignaturasDeNoveno, enElCuadre, grupo, type Asignatura } from '../montar-el-ano/reparto';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «CAMBIAR O QUITAR UNA ASIGNATURA»: LO QUE SE VE, Y CUÁNDO CAMBIA.
 *
 * LA HISTORIA, en dos partes y el mismo grupo, 9°B con sus diez asignaturas:
 *
 *   1. Diego Ocampo Ruiz se va a mitad de año y Biología pasa a Sandra Milena Rojas Duque. Se hace
 *      con el lápiz de la fila --la ficha «Editar asignatura»--, cambiando sólo el Profesor. Las
 *      notas cuelgan de la asignatura, no del docente (`putUpdate` sólo cambia `profesor_id`): la
 *      nueva las encuentra, y Diego conserva Química.
 *   2. Cátedra de la Paz se quita por error. El diálogo enseña antes lo que cuelga de ella --95
 *      notas, dos periodos--, y al eliminarla va a la papelera (`SoftDeletes`: sólo se marca
 *      `deleted_at`, nada de lo suyo se borra). «Restaurar» la devuelve entera.
 */

export const G9B = grupo('9°B');

/** Las diez de 9°B, con su orden: el campo que sólo se ve en la ficha. */
export const DE_9B: Asignatura[] = asignaturasDeNoveno('9°B', PRIMER_ID_9B);
export const BIOLOGIA = DE_9B.findIndex((a) => a.materia === 'Biología');
export const CATEDRA = DE_9B.findIndex((a) => a.materia === 'Cátedra de la Paz');

export const DETALLE_CATEDRA: DetalleBorrado = {
	id: DE_9B[CATEDRA].id,
	materia: 'Cátedra de la Paz',
	notas: 95,
	unidades: [
		{
			periodo: 1,
			definicion: 'Reconoce los mecanismos de participación ciudadana',
			subunidades: [
				{ id: 5121, definicion: 'Identifica los derechos fundamentales', notas: 38 },
				{ id: 5122, definicion: 'Propone acuerdos de convivencia en el aula', notas: 38 },
			],
		},
		{
			periodo: 2,
			definicion: 'Analiza conflictos de su entorno y propone salidas pacíficas',
			subunidades: [
				{ id: 5140, definicion: 'Describe un conflicto de su barrio', notas: 19 },
				{ id: 5141, definicion: 'Propone una salida pacífica al conflicto', notas: 0 },
			],
		},
	],
};

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
	/* El filtro de grupo: se abre, se teclea «9°B», se elige. */
	llegaFiltro: 140,
	pulsaFiltro: 148,
	tecleaFiltro: 156,
	llegaOpcionFiltro: 174,
	pulsaOpcionFiltro: 180,
	filtra: 182,
	/* El lápiz de Biología. */
	llegaEditar: 262,
	pulsaEditar: 270,
	abreFicha: 272,
	/* Profesor: «Sandra». */
	llegaProfesor: 340,
	pulsaProfesor: 346,
	tecleaProfesor: 354,
	llegaOpcionProfesor: 386,
	pulsaOpcionProfesor: 392,
	llegaGuardar: 410,
	pulsaGuardar: 418,
	/** `putUpdate` vuelve: «Asignatura actualizada con éxito», la ficha se cierra y la fila cambia. */
	guardada: 430,
	/* La papelera roja de Cátedra de la Paz. */
	llegaBorrar: 616,
	pulsaBorrar: 624,
	abreModal: 626,
	/** `detalle-asignatura` contesta: hasta entonces, «Cargando detalle de asignatura…». */
	llegaDetalle: 646,
	llegaEliminar: 880,
	pulsaEliminar: 888,
	eliminada: 900,
	/* Abajo, a la papelera. */
	bajaDesde: 996,
	bajaHasta: 1028,
	llegaPapelera: 1050,
	pulsaPapelera: 1058,
	abrePapelera: 1060,
	llegaRestaurar: 1160,
	pulsaRestaurar: 1168,
	restaurada: 1180,
	subeDesde: 1200,
	subeHasta: 1232,
};

export const TECLEO = { filtro: '9°B', profesor: 'Sandra' };

/** Lo que se baja la página para ver la papelera abierta. */
export const BAJADA = 330;

/* ── La pantalla en cada fotograma ───────────────────────────────────────────────────────────── */

const suma = (xs: Asignatura[]) => xs.reduce((n, a) => n + a.ih, 0);

function cuadreEn(filtrado: boolean, filas: Asignatura[]): Cuadre {
	if (!filtrado) { return { forma: 'linea', tipo: 'success', mensaje: 'Los 15 grupos con intensidad horaria puesta cuadran con sus asignaturas' }; }
	const s = suma(filas);
	const falta = G9B.ih - s;
	return {
		forma: 'grupo',
		tipo: falta === 0 ? 'success' : 'warning',
		mensaje: `${enElCuadre(G9B)} · ${s} de ${G9B.ih} h asignadas · ${falta === 0 ? 'cuadra' : falta === 1 ? 'falta 1 hora' : `faltan ${falta} horas`}`,
		detalle: `${filas.length} asignaturas en el grupo.`,
	};
}

/** Las filas de 9°B en el fotograma: Biología cambia de docente al guardar; Cátedra se va y vuelve. */
function filasDe9B(f: number): FilaVista[] {
	const conSandra = DE_9B.map((a, i) => (i === BIOLOGIA && f >= M.guardada ? { ...a, profesor: 'rojas' as const } : a));
	const sinCatedra = f >= M.eliminada && f < M.restaurada;
	return conSandra
		.filter((_, i) => !(sinCatedra && i === CATEDRA))
		.map((a) => ({
			...a,
			encima: a.materia === 'Biología' && entre(f, M.llegaEditar, M.pulsaEditar + 8) ? 'editar'
				: a.materia === 'Cátedra de la Paz' && entre(f, M.llegaBorrar, M.pulsaBorrar + 8) ? 'borrar' : null,
		}));
}

export function estadoEn(f: number, fps = 30): EstadoAsignaturas {
	const filtrado = f >= M.filtra;
	const filas: FilaVista[] = filtrado ? filasDe9B(f) : DE_9B.slice(0, 0);
	const enPapelera = f >= M.eliminada && f < M.restaurada;
	const baja = avance(f, M.bajaDesde, M.bajaHasta) * (1 - avance(f, M.subeDesde, M.subeHasta));

	const base: EstadoAsignaturas = {
		cuadre: cuadreEn(filtrado, filas),
		ficha: f >= M.abreFicha && f < M.guardada ? fichaEn(f, fps) : null,
		filtroGrupo: filtrado ? { nombre: G9B.nombre, titular: G9B.titular } : null,
		filtroProfesor: null,
		viendo: filtrado ? { de: EN_EL_ANO - (enPapelera ? 1 : 0) } : null,
		filas: filtrado ? filas : AL_ENTRAR,
		copia: { origen: null, destino: null },
		papelera: {
			abierta: f >= M.abrePapelera,
			filas: enPapelera ? [{ id: DE_9B[CATEDRA].id, materia: 'Cátedra de la Paz', profesor: 'bernal', grupo: '9°B' }] : [],
			restaurando: entre(f, M.pulsaRestaurar, M.restaurada) ? DE_9B[CATEDRA].id : null,
			encima: entre(f, M.llegaPapelera, M.pulsaPapelera + 8) ? 'boton' : entre(f, M.llegaRestaurar, M.pulsaRestaurar + 8) ? DE_9B[CATEDRA].id : null,
		},
		desplegable: desplegableEn(f, fps),
	};
	return { ...base, desplazada: Math.round(baja * BAJADA) };
}

function fichaEn(f: number, fps: number): EstadoFicha {
	const a = DE_9B[BIOLOGIA];
	const activo = entre(f, M.pulsaProfesor, M.pulsaOpcionProfesor) ? 'profesor' : null;
	return {
		modo: 'editar',
		materia: a.materia,
		grupo: a.grupo,
		profesor: f >= M.pulsaOpcionProfesor ? 'rojas' : a.profesor,
		creditos: String(a.ih),
		orden: String(BIOLOGIA + 1),
		activo,
		busqueda: activo && f >= M.tecleaProfesor ? tecleado(f, TECLEO.profesor, M.tecleaProfesor) : null,
		cursor: parpadea(f),
		encima: entre(f, M.llegaGuardar, M.pulsaGuardar + 8) ? 'guardar' : null,
		cargando: entre(f, M.pulsaGuardar, M.guardada),
		aparece: entra(f, fps, M.abreFicha, 12),
	};
}

function desplegableEn(f: number, fps: number): Desplegable | null {
	if (entre(f, M.pulsaFiltro + 2, M.pulsaOpcionFiltro + 2)) {
		const b = f >= M.tecleaFiltro ? tecleado(f, TECLEO.filtro, M.tecleaFiltro) : null;
		return { donde: 'filtroGrupo', opciones: opcionesDeGrupos(b), resaltada: 0, elegida: f >= M.pulsaOpcionFiltro ? 0 : null, aparece: entra(f, fps, M.pulsaFiltro + 2, 8), busqueda: b, cursor: parpadea(f) };
	}
	if (entre(f, M.pulsaProfesor + 2, M.pulsaOpcionProfesor + 2)) {
		const b = f >= M.tecleaProfesor ? tecleado(f, TECLEO.profesor, M.tecleaProfesor) : null;
		return { donde: 'profesor', opciones: opcionesDeDocentes(b), resaltada: 0, elegida: f >= M.pulsaOpcionProfesor ? 0 : null, aparece: entra(f, fps, M.pulsaProfesor + 2, 8), busqueda: b, cursor: parpadea(f) };
	}
	return null;
}

/** El modal: se abre al pulsar la papelera roja y se cierra cuando el borrado vuelve. */
export const modalEn = (f: number, fps = 30) => ({
	visible: f >= M.abreModal && f < M.eliminada + 8,
	aparece: entra(f, fps, M.abreModal, 10) * (1 - avance(f, M.eliminada, M.eliminada + 8)),
	cargandoDetalle: f < M.llegaDetalle,
	encima: entre(f, M.llegaEliminar, M.pulsaEliminar + 8) ? ('eliminar' as const) : null,
	cargando: entre(f, M.pulsaEliminar, M.eliminada),
});

/* Una comprobación que el dibujo no puede hacer solo: con la página bajada, la papelera abierta cabe. */
{
	const e = estadoEn(M.abrePapelera + 10);
	const d = disposicion(e);
	const abajo = MAIN.y + d.papelera + 32 + 8 + 42 - BAJADA;
	if (abajo > 900 - 20) {
		throw new Error(`Datos: con la página bajada ${BAJADA} px, la fila de la papelera acaba en ${abajo} y la cáscara mide 900.`);
	}
}
