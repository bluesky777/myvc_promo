import { entra } from '../../comunes/movimiento';
import { LLEGADA, entre, parpadea, tecleado } from '../montar-el-ano/tiempo';
import { opcionesDeDocentes, opcionesDeGrupos, opcionesDeMaterias } from '../montar-el-ano/opciones';
import type { Cuadre, Desplegable, EstadoAsignaturas, EstadoFicha } from '../montar-el-ano/planoAsignaturas';
import {
	AL_ENTRAR, EN_EL_ANO, PRIMER_ID_9B, asignaturasDeNoveno, enElCuadre, grupo, type Asignatura,
} from '../montar-el-ano/reparto';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «CREAR UNA ASIGNATURA»: LO QUE SE VE, Y CUÁNDO CAMBIA.
 *
 * LA HISTORIA: es enero y a 9°B le falta Tecnología e Informática. Las otras nueve suman 28 horas y
 * el grupo da 30, así que el cuadre de la IH lo dice al entrar. Se crea la asignatura con su
 * docente --Óscar Iván Peña Salazar, que ya la dicta en 9°A-- y 2 horas, y el cuadre pasa a verde.
 *
 * Los momentos van aquí y no en el guion porque el estado de la pantalla depende de ellos, y el
 * guion necesita el estado para saber dónde está cada cosa que señala. `estadoEn(f)` es la pantalla
 * en el fotograma `f`, y con ella se pinta y se apunta.
 */

export const G9B = grupo('9°B');

/** Las nueve que ya tiene 9°B: todas menos Tecnología. */
export const ANTES: Asignatura[] = asignaturasDeNoveno('9°B', PRIMER_ID_9B).filter((a) => a.materia !== 'Tecnología e Informática');

/** La que se crea. Id nuevo, el siguiente libre del año; sin orden, así que va la última del grupo. */
export const LA_NUEVA: Asignatura = {
	...asignaturasDeNoveno('9°B', PRIMER_ID_9B).find((a) => a.materia === 'Tecnología e Informática')!,
	id: 1649,
};

export const DESPUES: Asignatura[] = [...ANTES, LA_NUEVA];

const suma = (xs: Asignatura[]) => xs.reduce((n, a) => n + a.ih, 0);

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
	/** «Ver sus asignaturas» en la fila de 9°B del cuadre. */
	llegaVerSus: 272,
	pulsaVerSus: 280,
	filtra: 282,
	llegaCrearNueva: 376,
	pulsaCrearNueva: 384,
	abreFicha: 386,
	/* Materia: se pincha, se teclea «tecno» y se elige la única que queda. */
	llegaMateria: 448,
	pulsaMateria: 454,
	tecleaMateria: 462,
	llegaOpcionMateria: 488,
	pulsaOpcionMateria: 494,
	/* Grupo: «9°B». */
	llegaGrupo: 506,
	pulsaGrupo: 512,
	tecleaGrupo: 518,
	llegaOpcionGrupo: 536,
	pulsaOpcionGrupo: 542,
	/* Profesor: «Óscar». */
	llegaProfesor: 554,
	pulsaProfesor: 560,
	tecleaProfesor: 566,
	llegaOpcionProfesor: 592,
	pulsaOpcionProfesor: 598,
	/* Créditos: 2. */
	llegaCreditos: 612,
	pulsaCreditos: 618,
	tecleaCreditos: 626,
	llegaCrear: 690,
	pulsaCrear: 698,
	/** `postIndex` va y vuelve: el aviso sale, la ficha se cierra y la lista se recarga. */
	creada: 712,
};

export const TECLEO = { materia: 'tecno', grupo: '9°B', profesor: 'Óscar', creditos: '2' };

/* ── El cuadre ──────────────────────────────────────────────────────────────────────────────── */

const cuadreDeLista = (): Cuadre => ({
	forma: 'lista',
	mensaje: '1 de 15 grupos no cuadra con su intensidad horaria',
	filas: [{ grupo: enElCuadre(G9B), cifras: `${suma(ANTES)} de ${G9B.ih} h`, diferencia: `faltan ${G9B.ih - suma(ANTES)} horas` }],
});

const cuadreDelGrupo = (filas: Asignatura[]): Cuadre => {
	const s = suma(filas);
	const cuadra = s === G9B.ih;
	return {
		forma: 'grupo',
		tipo: cuadra ? 'success' : 'warning',
		mensaje: `${enElCuadre(G9B)} · ${s} de ${G9B.ih} h asignadas · ${cuadra ? 'cuadra' : `faltan ${G9B.ih - s} horas`}`,
		detalle: `${filas.length} asignaturas en el grupo.`,
	};
};

/* ── La pantalla en cada fotograma ───────────────────────────────────────────────────────────── */

export function estadoEn(f: number, fps = 30): EstadoAsignaturas {
	const filtrado = f >= M.filtra;
	const creada = f >= M.creada;
	const filas = !filtrado ? AL_ENTRAR : creada ? DESPUES : ANTES;

	return {
		cuadre: !filtrado ? cuadreDeLista() : cuadreDelGrupo(filas),
		ficha: f >= M.abreFicha && !creada ? fichaEn(f, fps) : null,
		filtroGrupo: filtrado ? { nombre: G9B.nombre, titular: G9B.titular } : null,
		filtroProfesor: null,
		viendo: filtrado ? { de: creada ? EN_EL_ANO : EN_EL_ANO - 1 } : null,
		filas,
		copia: { origen: null, destino: null },
		papelera: { abierta: false, filas: [] },
		desplegable: desplegableEn(f, fps),
		encima: entre(f, M.llegaVerSus, M.pulsaVerSus + 8) ? 'verSus' : entre(f, M.llegaCrearNueva, M.pulsaCrearNueva + 8) ? 'crearNueva' : null,
	};
}

function fichaEn(f: number, fps: number): EstadoFicha {
	const activo = entre(f, M.pulsaMateria, M.pulsaOpcionMateria) ? 'materia'
		: entre(f, M.pulsaGrupo, M.pulsaOpcionGrupo) ? 'grupo'
			: entre(f, M.pulsaProfesor, M.pulsaOpcionProfesor) ? 'profesor'
				: entre(f, M.pulsaCreditos, M.pulsaCrear) ? 'creditos'
					: null;

	const busqueda = activo === 'materia' && f >= M.tecleaMateria ? tecleado(f, TECLEO.materia, M.tecleaMateria)
		: activo === 'grupo' && f >= M.tecleaGrupo ? tecleado(f, TECLEO.grupo, M.tecleaGrupo)
			: activo === 'profesor' && f >= M.tecleaProfesor ? tecleado(f, TECLEO.profesor, M.tecleaProfesor)
				: null;

	return {
		modo: 'nueva',
		materia: f >= M.pulsaOpcionMateria ? LA_NUEVA.materia : null,
		grupo: f >= M.pulsaOpcionGrupo ? G9B.nombre : null,
		profesor: f >= M.pulsaOpcionProfesor ? LA_NUEVA.profesor : null,
		creditos: f >= M.tecleaCreditos ? tecleado(f, TECLEO.creditos, M.tecleaCreditos) : '',
		orden: '',
		activo,
		busqueda,
		cursor: parpadea(f),
		encima: entre(f, M.llegaCrear, M.pulsaCrear + 8) ? 'crear' : null,
		cargando: entre(f, M.pulsaCrear, M.creada),
		aparece: entra(f, fps, M.abreFicha, 12),
	};
}

function desplegableEn(f: number, fps: number): Desplegable | null {
	const abierto = (desde: number, hasta: number) => entre(f, desde + 2, hasta + 2);
	if (abierto(M.pulsaMateria, M.pulsaOpcionMateria)) {
		const b = f >= M.tecleaMateria ? tecleado(f, TECLEO.materia, M.tecleaMateria) : null;
		return { donde: 'materia', opciones: opcionesDeMaterias(b), resaltada: 0, elegida: f >= M.pulsaOpcionMateria ? 0 : null, aparece: entra(f, fps, M.pulsaMateria + 2, 8), busqueda: b, cursor: parpadea(f) };
	}
	if (abierto(M.pulsaGrupo, M.pulsaOpcionGrupo)) {
		const b = f >= M.tecleaGrupo ? tecleado(f, TECLEO.grupo, M.tecleaGrupo) : null;
		return { donde: 'grupo', opciones: opcionesDeGrupos(b), resaltada: 0, elegida: f >= M.pulsaOpcionGrupo ? 0 : null, aparece: entra(f, fps, M.pulsaGrupo + 2, 8), busqueda: b, cursor: parpadea(f) };
	}
	if (abierto(M.pulsaProfesor, M.pulsaOpcionProfesor)) {
		const b = f >= M.tecleaProfesor ? tecleado(f, TECLEO.profesor, M.tecleaProfesor) : null;
		return { donde: 'profesor', opciones: opcionesDeDocentes(b), resaltada: 0, elegida: f >= M.pulsaOpcionProfesor ? 0 : null, aparece: entra(f, fps, M.pulsaProfesor + 2, 8), busqueda: b, cursor: parpadea(f) };
	}
	return null;
}
