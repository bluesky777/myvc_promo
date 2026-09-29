import { entre, avance, parpadea, tecleado } from '../montar-el-ano/tiempo';
import { DOCENTES, GRUPOS } from '../montar-el-ano/reparto';
import type { Opcion } from '../montar-el-ano/ant';
import type { EstadoDirectorio } from '../secretaria/Directorio';
import { NOVENO_A, NOVENO_B, OCTAVO_2025, buscar } from '../secretaria/personas';
import type { EstadoMatricularEn, EstadoTraerNotas } from './Dialogos';
import { ALTO_REJILLA, type EstadoMatricular } from './Matricular';
import { CABECERA, FILA } from '../secretaria/Tabla';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «MATRICULAR»: lo que se ve, fotograma a fotograma. Todo inventado.
 *
 * A mitad del año (periodo 2) vuelve Jerónimo Zuluaga Ríos, que el año pasado estuvo en 8°A: sale
 * entre los candidatos de 9°B y se matricula con «Matric». Luego Alejandro Echeverri Gil pasa de
 * 9°A a 9°B desde Personas ▸ Alumnos, y como ya tiene las 11 definitivas del periodo 1 en 9°A, la
 * aplicación lo dice y ofrece traerlas.
 */

export const QUIEN_VUELVE = buscar(OCTAVO_2025, 'Jerónimo');
export const QUIEN_CAMBIA = buscar(NOVENO_A, 'Alejandro');
export const FILA_QUE_CAMBIA = NOVENO_A.indexOf(QUIEN_CAMBIA);
export const NOTAS = 11;

export const M = {
	cursorEntra: 12,
	llegaPersonas: 34,
	pulsaPersonas: 40,
	abrePersonas: 42,
	llegaMatricular: 88,
	pulsaMatricular: 98,
	monta: 102,

	bajaDesde: 265,
	bajaHasta: 293,

	/* El puntero sube al año de la barra mientras se dice que tiene que ser el nuevo. */
	llegaAno: 465,

	llegaMatric: 630,
	pulsaMatric: 642,
	/** La ida y vuelta de `matricularUno`. */
	matriculado: 654,

	bajaFilasDesde: 690,
	bajaFilasHasta: 722,

	/* Y baja a «Reti» y «Dese» de la fila nueva: al que se va no se le borra. */
	llegaRetiDese: 770,

	llegaAlumnos: 965,
	pulsaAlumnos: 975,
	montaDirectorio: 992,

	llegaGrupo9A: 1122,
	pulsaGrupo9A: 1132,
	cambiaGrupo: 1140,
	llegaPuntos: 1225,
	pulsaPuntos: 1240,
	abreEn: 1242,

	llegaSelector: 1280,
	pulsaSelector: 1290,
	teclea: 1300,
	llegaOpcion: 1320,
	pulsaOpcion: 1330,
	llegaMatricularEn: 1350,
	pulsaMatricularEn: 1362,
	/** La ida y vuelta de `matricular-en`: aviso y el diálogo se cierra. */
	matriculadoEn: 1376,
	/** Y la de `revisarNotasDelGrupoAnterior`: si hay definitivas, se abre el segundo. */
	abreNotas: 1390,
	cargadoNotas: 1412,

	llegaTraer: 1605,
	pulsaTraer: 1620,
	traidas: 1635,
};

/* ── Matricular ───────────────────────────────────────────────────────────────────────────── */

const CANDIDATOS = OCTAVO_2025;
export const FILA_CANDIDATO = CANDIDATOS.indexOf(QUIEN_VUELVE);
export const DESPLAZADA = 150;

/** Lo que baja la rejilla de arriba para enseñar su última fila. */
export const BAJADA_FINAL = (NOVENO_B.length + 1) * FILA - (ALTO_REJILLA - CABECERA * 2) + 2;

export function estadoMatricularEn(f: number): EstadoMatricular {
	const hecho = f >= M.matriculado;
	return {
		enElGrupo: [
			...NOVENO_B.map((a) => ({ alumno: a })),
			...(hecho ? [{ alumno: QUIEN_VUELVE, fecha: '2026-06-09' }] : []),
		],
		candidatos: CANDIDATOS.filter((a) => !hecho || a !== QUIEN_VUELVE).map((a) => ({
			alumno: a,
			encima: a === QUIEN_VUELVE && entre(f, M.llegaMatric, M.pulsaMatric + 8) ? 'Matric' : null,
		})),
		bajada1: avance(f, M.bajaFilasDesde, M.bajaFilasHasta) * BAJADA_FINAL,
		desplazada: avance(f, M.bajaDesde, M.bajaHasta) * DESPLAZADA,
		opacidad: avance(f, M.monta, M.monta + 12) * (1 - avance(f, M.pulsaAlumnos, M.pulsaAlumnos + 14)),
	};
}

/* ── Alumnos, 9°A ─────────────────────────────────────────────────────────────────────────── */

export function estadoDirectorioEn(f: number): EstadoDirectorio {
	const en9A = f >= M.cambiaGrupo;
	const lista = en9A ? NOVENO_A : NOVENO_B;
	return {
		grupo: f >= M.pulsaGrupo9A ? '9A' : '9B',
		encimaGrupo: entre(f, M.llegaGrupo9A, M.pulsaGrupo9A + 8) ? '9A' : null,
		filas: lista.map((a, i) => ({
			alumno: a,
			estado: 'Matr' as const,
			encimaEstado: en9A && i === FILA_QUE_CAMBIA && entre(f, M.llegaPuntos, M.pulsaPuntos + 10) ? '…' : null,
		})),
		opacidad: avance(f, M.montaDirectorio, M.montaDirectorio + 12),
	};
}

const grupo = (nombre: string) => GRUPOS.find((g) => g.nombre === nombre)!;
const opcionDe = (nombre: string): Opcion => ({ texto: nombre, debajo: DOCENTES[grupo(nombre).titular].nombre, cara: grupo(nombre).titular });
export const OPCIONES_9 = [opcionDe('9°A'), opcionDe('9°B')];

export function estadoMatricularEnDialogo(f: number): EstadoMatricularEn {
	const elegido = f >= M.pulsaOpcion;
	const abierto = f >= M.pulsaSelector && f < M.pulsaOpcion;
	const busqueda = tecleado(f, '9', M.teclea);
	return {
		t: avance(f, M.abreEn, M.abreEn + 12),
		sale: avance(f, M.matriculadoEn, M.matriculadoEn + 8),
		grupo: elegido ? { nombre: '9°B', titular: 'herrera' } : { nombre: '9°A', titular: 'ocampo' },
		abierto: abierto
			? {
				busqueda,
				cursor: parpadea(f),
				/* Sin teclear, el panel enseña los primeros; con «9», los dos novenos. */
				opciones: busqueda ? OPCIONES_9 : GRUPOS.slice(0, 5).map((g) => opcionDe(g.nombre)),
				resaltada: busqueda ? (f >= M.llegaOpcion - 6 ? 1 : 0) : null,
				aparece: avance(f, M.pulsaSelector, M.pulsaSelector + 8),
			}
			: null,
		encimaMatricular: entre(f, M.llegaMatricularEn, M.matriculadoEn),
		cargando: entre(f, M.pulsaMatricularEn, M.matriculadoEn),
		giro: (f - M.pulsaMatricularEn) * 24,
	};
}

export function estadoTraerNotasEn(f: number): EstadoTraerNotas {
	return {
		t: avance(f, M.abreNotas, M.abreNotas + 12),
		sale: avance(f, M.traidas, M.traidas + 8),
		cargando: f < M.cargadoNotas,
		giro: (f - M.abreNotas) * 24,
		contenido: avance(f, M.cargadoNotas, M.cargadoNotas + 8),
		encimaTraer: entre(f, M.llegaTraer, M.traidas),
		trayendo: entre(f, M.pulsaTraer, M.traidas),
	};
}
