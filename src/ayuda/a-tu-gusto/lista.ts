import { Miga } from '../moverse/comun';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «LISTA DE ALUMNOS» (Personas ▸ Listado alumnos, `paginas/lista-alumnos/`): la pantalla de fondo
 * de `a-tu-gusto` y `menu-secciones`. Se elige porque es una rejilla (AG Grid), y la densidad de las
 * tablas es justo eso: filas de 48 px en «Cómoda» y de 32 en «Compacta»
 * (`core/tema/densidad-compacta.scss`: `--ag-row-height: 32px`, cabecera 36).
 *
 * EL GRUPO ES 8°A, del que el docente NO es titular: por eso la pista dice que sólo puede mirarla
 * (`lista-alumnos.html`). Los nombres son inventados y no salen en ningún otro vídeo; los usuarios
 * también.
 */

export const MIGAS_LISTA: Miga[] = [
	{ etiqueta: 'Panel', enlace: true },
	{ etiqueta: 'Personas', enlace: false },
	{ etiqueta: 'Listado alumnos', enlace: false },
];

export const GRUPOS = [
	{ abrev: '8A', titular: false },
	{ abrev: '9A', titular: false },
	{ abrev: '9B', titular: true },
	{ abrev: '10A', titular: false },
];
export const ELEGIDO = 0;

export const PISTA = 'Sólo el titular del grupo puede editar esta lista. Puedes verla y filtrarla.';

export const ALUMNOS_8A: { nombres: string; apellidos: string; sexo: 'F' | 'M'; matricula: string; usuario: string }[] = [
	['Isabella', 'Arango Pérez', 'F'],
	['Juan José', 'Bedoya Marín', 'M'],
	['Julián', 'Benítez Ossa', 'M'],
	['Antonella', 'Cárdenas Ríos', 'F'],
	['Emiliano', 'Castro Vélez', 'M'],
	['Luciana', 'Duque Henao', 'F'],
	['Santiago', 'Echeverri Gil', 'M'],
	['Salomé', 'Franco Londoño', 'F'],
	['Martín', 'Giraldo Soto', 'M'],
	['Gabriela', 'Hoyos Quintero', 'F'],
	['Jerónimo', 'Jaramillo Toro', 'M'],
	['María José', 'López Arboleda', 'F'],
	['Samuel', 'Muñoz Cano', 'M'],
	['Violeta', 'Ospina Restrepo', 'F'],
	['Maximiliano', 'Patiño Gómez', 'M'],
	['Sofía', 'Zuluaga Mesa', 'F'],
].map(([nombres, apellidos, sexo], i) => ({
	nombres,
	apellidos,
	sexo: sexo as 'F' | 'M',
	matricula: String(2026081 + i * 7),
	usuario: (nombres.split(' ')[0][0] + apellidos.split(' ')[0]).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') + '8a',
}));

/** Las filas de AG Grid, según la densidad (`densidad-compacta.scss`). */
export const FILA = { comoda: 48, compacta: 32 };
export const CABECERA = { comoda: 48, compacta: 36 };

/** Las columnas, en el orden de `lista-alumnos.ts`, con su ancho mínimo en la rejilla. */
export const COLUMNAS = [
	{ id: 'no', titulo: 'Nº', ancho: 64 },
	{ id: 'nombres', titulo: 'Nombres', ancho: 220 },
	{ id: 'apellidos', titulo: 'Apellidos', ancho: 220 },
	{ id: 'acciones', titulo: 'Acciones', ancho: 110 },
	{ id: 'sexo', titulo: 'Sexo', ancho: 90 },
	{ id: 'matricula', titulo: '# matrícula', ancho: 150 },
	{ id: 'usuario', titulo: 'Usuario', ancho: 250 },
	{ id: 'deuda', titulo: 'Deuda', ancho: 140 },
];
