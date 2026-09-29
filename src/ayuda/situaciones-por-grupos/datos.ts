import { MEDIDAS, SECCIONES, alturaEnMenu, entradaDe } from '../medidas';
import { COLEGIO } from '../colegio';
import { SITUACION_NUEVA, SITUACIONES_DE_SARA } from '../disciplina/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «SITUACIONES POR GRUPOS» (`app2/.../disciplina/situaciones-por-grupos/`): lo que se ve.
 *
 * El servidor (`ComportamientoController::putSituacionesPorGrupos`) recorre TODOS los grupos del
 * año y de cada uno **sólo devuelve a los alumnos que tienen alguna situación** en uno de los
 * cuatro periodos; la pantalla, además, se salta los grupos que se quedan vacíos (`conAlumnos`).
 * La fecha es `SUBSTRING(fecha_hora_aprox, 1, 10)`: año-mes-día.
 *
 * Las dos de Sara son las de los vídeos de disciplina (la del 19 de agosto y la que se registra en
 * «Registrar una situación», el 28 de septiembre). El resto, inventado y genérico.
 */

export const DISCIPLINA = entradaDe(SECCIONES, 'Disciplina');
export const ENTRADA = entradaDe(SECCIONES, 'Disciplina', 'Situaciones por grupos');

export const MENU_SIT = {
	seccion: { x: 0, y: alturaEnMenu(SECCIONES, DISCIPLINA.seccion, null, null), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion },
	hija: { x: 0, y: alturaEnMenu(SECCIONES, ENTRADA.seccion, ENTRADA.hija, DISCIPLINA.seccion), ancho: MEDIDAS.menu, alto: MEDIDAS.hija },
};

export const MEMBRETE = `${COLEGIO.nombre} - ${COLEGIO.abreviatura}`;

export interface Falta { tipo: number; descripcion: string; fecha: string }
export interface AlumnoConSituaciones { nombre: string; periodos: Falta[][] }
export interface GrupoDelInforme { nombre: string; abrev: string; alumnos: AlumnoConSituaciones[] }

const LLEGAR_TARDE = 'Llegó tarde al aula sin justificación.';

export const GRUPOS_DEL_INFORME: GrupoDelInforme[] = [
	{ nombre: 'Sexto A', abrev: '6A', alumnos: [
		{ nombre: 'Gómez Pérez Andrés Felipe', periodos: [[{ tipo: 1, descripcion: LLEGAR_TARDE, fecha: '2026-02-16' }], [{ tipo: 1, descripcion: 'Comió en el aula durante la clase.', fecha: '2026-05-04' }], [], []] },
	] },
	{ nombre: 'Octavo A', abrev: '8A', alumnos: [
		{ nombre: 'Benítez Ossa Julián', periodos: [[], [{ tipo: 2, descripcion: 'Agresión verbal reiterada a un compañero en el descanso.', fecha: '2026-06-10' }], [], []] },
	] },
	{ nombre: 'Noveno B', abrev: '9B', alumnos: [
		{ nombre: 'Acosta Rivera Sara Isabel', periodos: [[], [
			{ tipo: 1, descripcion: SITUACIONES_DE_SARA[0].descripcion, fecha: '2026-08-19' },
			{ tipo: 1, descripcion: SITUACION_NUEVA.descripcion, fecha: '2026-09-28' },
		], [], []] },
		{ nombre: 'Rojas Valencia Mateo David', periodos: [[{ tipo: 1, descripcion: LLEGAR_TARDE, fecha: '2026-03-09' }], [{ tipo: 1, descripcion: 'Usó el celular en clase sin autorización.', fecha: '2026-07-22' }], [], []] },
		{ nombre: 'Escobar Lozano Valentina', periodos: [[], [{ tipo: 1, descripcion: 'Salió del aula sin permiso del docente.', fecha: '2026-09-02' }], [], []] },
	] },
	{ nombre: 'Décimo A', abrev: '10A', alumnos: [
		{ nombre: 'Villa Herrera Camilo', periodos: [[{ tipo: 1, descripcion: 'Usó el celular en clase sin autorización.', fecha: '2026-04-14' }], [], [], []] },
	] },
];
export const EL_GRUPO = 2;
export const ALUMNOS_DEL_GRUPO = 30;

/* ── Geometría, en coordenadas del CONTENIDO ───────────────────────────────────────────── */

export const S = {
	lados: 36,
	ancho: MEDIDAS.ancho - MEDIDAS.menu - 72,
	arriba: 24,
	membrete: 96,
	titulo: 128,
	primerGrupo: 168,
	h3: 34,
	nombre: 30,
	cabecera: 30,
	falta: 58,
	vacia: 34,
	huecoAlumno: 12,
	huecoGrupo: 26,
};

const altoDeLaFila = (a: AlumnoConSituaciones) => Math.max(S.vacia, Math.max(...a.periodos.map((p) => p.length)) * S.falta + 6);
export const altoDelAlumno = (a: AlumnoConSituaciones) => S.nombre + S.cabecera + altoDeLaFila(a) + S.huecoAlumno;
export const altoDelGrupo = (g: GrupoDelInforme) => S.h3 + g.alumnos.reduce((n, a) => n + altoDelAlumno(a), 0) + S.huecoGrupo;

export function arribaDelGrupo(i: number): number {
	return S.primerGrupo + GRUPOS_DEL_INFORME.slice(0, i).reduce((n, g) => n + altoDelGrupo(g), 0);
}
export function arribaDelAlumno(g: number, a: number): number {
	return arribaDelGrupo(g) + S.h3 + GRUPOS_DEL_INFORME[g].alumnos.slice(0, a).reduce((n, x) => n + altoDelAlumno(x), 0);
}

const X0 = MEDIDAS.menu + S.lados;
const Y0 = MEDIDAS.barra;

export const GEO_SIT = {
	grupo: (i: number, scroll: number) => ({ x: X0 - 8, y: Y0 + arribaDelGrupo(i) - 6 - scroll, ancho: S.ancho + 16, alto: altoDelGrupo(GRUPOS_DEL_INFORME[i]) - S.huecoGrupo + 4 }),
	alumno: (g: number, a: number, scroll: number) => ({ x: X0 - 8, y: Y0 + arribaDelAlumno(g, a) - 4 - scroll, ancho: S.ancho + 16, alto: altoDelAlumno(GRUPOS_DEL_INFORME[g].alumnos[a]) - S.huecoAlumno + 8 }),
	imprimir: { x: X0 + S.ancho - 132, y: Y0 + S.arriba, ancho: 132, alto: 40 },
};

export const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
