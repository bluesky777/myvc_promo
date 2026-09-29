import { MAIN, type Rect } from '../personas/comun';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * IMPORTAR ALUMNOS DESDE EXCEL (`paginas/importar-alumnos/`), EN NÚMEROS. Lo comparten los dos
 * vídeos: «hojas y columnas» y «decidir y comprobar».
 *
 * EL LIBRO ES INVENTADO: `matricula-2026.xlsx`, cuatro pestañas (6A, 7A, 8A, 9A) con 142 filas. En
 * el primer vídeo la de séptimo se llama «Séptimo A» --el nombre bonito y no la abreviatura--, que
 * es el error que la pantalla explica; en el segundo ya está renombrada.
 *
 * LOS TEXTOS FIJOS son los de `importar-alumnos.html`, y los que manda el servidor (lo que se
 * guardaría si falta una columna, la consecuencia de una hoja sin grupo, el motivo del bloqueo)
 * están copiados de `8myvc`: `EnsayoDeLaImportacion::COLUMNAS`, su `consecuencia` de hoja y
 * `ImportarController` (el `motivo` de `hoja_sin_grupo`). Los números son del vídeo.
 *
 * LAS LETRAS VAN UN PUNTO Y MEDIO POR ENCIMA de las de la hoja de estilos (13,5 → 15; 12 → 13,5):
 * la cáscara se pinta al 84 % y esto se ve en un móvil. Como en el resto de la ayuda.
 */

export const FICHERO = 'matricula-2026.xlsx';
export const YEAR = 2026;

export const X = MAIN.x + 16;
export const ANCHO = 1100 - 32;
export const Y0 = MAIN.y + 16;
export const HUECO = 20;

export const L = { h2: 22, sub: 15, tabla: 15, th: 12.5, menuda: 13.5, etiqueta: 14.5 };

/* ── Los pasos del asistente ──────────────────────────────────────────────────────────────── */

export interface PasoNav { clave: string; etiqueta: string; contador: number }

export const pasosDe = (malaLaHoja: boolean): PasoNav[] => [
	{ clave: 'archivo', etiqueta: 'Archivo', contador: 0 },
	{ clave: 'hojas', etiqueta: 'Hojas', contador: malaLaHoja ? 1 : 0 },
	{ clave: 'columnas', etiqueta: 'Columnas', contador: 1 },
	{ clave: 'celdas', etiqueta: 'Celdas vacías', contador: VACIOS.length },
	{ clave: 'valores', etiqueta: 'Valores', contador: TRUNCADOS.length },
	{ clave: 'resumen', etiqueta: 'Qué va a pasar', contador: 0 },
];

/** Lo que ocupa cada píldora del paso: círculo 22, hueco 8, la etiqueta, y el contador si lo hay. */
export function pildoras(pasos: PasoNav[], y: number): Rect[] {
	let x = X;
	return pasos.map((p) => {
		const ancho = 6 + 22 + 8 + Math.round(p.etiqueta.length * 7.5) + (p.contador ? 8 + 24 : 0) + 12;
		const r = { x, y, ancho, alto: 34 };
		x += ancho + 2 + 12 + 2;
		return r;
	});
}

/* ── El libro ─────────────────────────────────────────────────────────────────────────────── */

export interface Hoja { nombre: string; filas: number; grupo: string | null }
export const hojasDe = (malaLaHoja: boolean): Hoja[] => [
	{ nombre: '6A', filas: 36, grupo: '6°A' },
	malaLaHoja ? { nombre: 'Séptimo A', filas: 35, grupo: null } : { nombre: '7A', filas: 35, grupo: '7°A' },
	{ nombre: '8A', filas: 34, grupo: '8°A' },
	{ nombre: '9A', filas: 37, grupo: '9°A' },
];
export const LA_MALA = 1;

export const CONSECUENCIA_PARAR = 'DETIENE la importación entera: no entra nadie, ni de las otras hojas.';
export const MOTIVO_BLOQUEO =
	'La pestaña «Séptimo A» no es ningún grupo del año, y el importador se detiene al llegar a ella. Las hojas anteriores ya habrán quedado escritas.';

/** Las columnas de MyVc, en el orden de `EnsayoDeLaImportacion::COLUMNAS`. */
export interface ColumnaDestino {
	etiqueta: string;
	obligatoria: boolean;
	longitud: number | null;
	/** Lo que sale en la tercera columna: la pastilla del valor por defecto, o la frase. */
	defecto?: { literal: string; soloAlCrear?: boolean };
	siFalta?: string;
	/** Si falta en alguna hoja, en cuál. */
	faltaEn?: string;
	vacias?: number;
}

export const COLUMNAS_DESTINO: ColumnaDestino[] = [
	{ etiqueta: 'ID', obligatoria: false, longitud: null, siFalta: 'Se busca al alumno por su documento; si tampoco está, se crea uno nuevo.', vacias: 21 },
	{ etiqueta: 'Tipo de Documento', obligatoria: false, longitud: null, defecto: { literal: 'TARJETA DE IDENTIDAD' } },
	{ etiqueta: 'Nro de documento', obligatoria: true, longitud: 20, siFalta: 'El alumno se crea igual, sin documento y sin poder reconocerse la próxima vez.' },
	{ etiqueta: 'Primer apellido', obligatoria: true, longitud: 100, siFalta: 'Los apellidos quedan en blanco.' },
	{ etiqueta: 'Segundo apellido', obligatoria: false, longitud: 100, siFalta: 'Se guarda sólo el primero.', vacias: 3 },
	{ etiqueta: 'Primer nombre', obligatoria: true, longitud: 100, siFalta: 'La fila NO crea alumno: sin primer nombre el importador la salta entera.', vacias: 1 },
	{ etiqueta: 'Segundo nombre', obligatoria: false, longitud: 100, siFalta: 'Se guarda sólo el primero.', vacias: 48 },
	{ etiqueta: 'Estado Matrícula', obligatoria: false, longitud: 4, siFalta: 'La matrícula conserva el estado que ya tenía; una nueva nace MATR.' },
	{ etiqueta: 'Número Matrícula', obligatoria: false, longitud: 20, siFalta: 'Queda en blanco.' },
	{ etiqueta: 'Dirección residencia', obligatoria: false, longitud: 150, siFalta: 'Se BORRA la que hubiera, porque el UPDATE escribe todas las columnas.' },
	{ etiqueta: 'Barrio', obligatoria: false, longitud: 100, siFalta: 'Se BORRA el que hubiera.', vacias: 12 },
	{ etiqueta: 'Teléfono', obligatoria: false, longitud: 50, siFalta: 'Se BORRA el que hubiera.' },
	{ etiqueta: 'Celular', obligatoria: false, longitud: 50, siFalta: 'Se BORRA el que hubiera.', vacias: 5 },
	{ etiqueta: 'Estrato', obligatoria: false, longitud: null, siFalta: 'Se BORRA el que hubiera.' },
	{ etiqueta: 'SISBEN', obligatoria: false, longitud: 50, siFalta: 'Se BORRA el que hubiera.' },
	{ etiqueta: 'Fecha de nacim', obligatoria: false, longitud: null, siFalta: 'Se BORRA la que hubiera, y con ella la comprobación de «mismo nombre, otro documento».', faltaEn: '8A' },
	{ etiqueta: 'Sexo', obligatoria: false, longitud: 1, defecto: { literal: 'Masculino', soloAlCrear: true } },
	{ etiqueta: 'RH', obligatoria: false, longitud: 10, siFalta: 'Se BORRA el que hubiera.' },
	{ etiqueta: 'EPS', obligatoria: false, longitud: 100, siFalta: 'Se BORRA la que hubiera.' },
	{ etiqueta: 'Religión', obligatoria: false, longitud: 100, siFalta: 'Se BORRA la que hubiera.' },
];
export const LA_QUE_FALTA = COLUMNAS_DESTINO.findIndex((c) => c.faltaEn);

/** Las celdas vacías que borrarían algo al actualizar: dos columnas. */
export const VACIOS = [
	{ etiqueta: 'Barrio', veces: 12, siFalta: 'Se BORRA el que hubiera.' },
	{ etiqueta: 'Celular', veces: 5, siFalta: 'Se BORRA el que hubiera.' },
];
export const EL_VACIO = 0;

/** Los valores que no caben (`truncados`), con la frase de `consecuenciaEnPalabras`. */
export const TRUNCADOS = [
	{
		etiqueta: 'Sexo', caben: 1, valor: 'Hombre', veces: 14,
		consecuencia: 'Se guarda «H», que es lo que cabe. Parece correcto y puede no serlo.',
		opciones: ['M · Masculino', 'F · Femenino'], elegida: 0,
	},
	{
		etiqueta: 'Estado Matrícula', caben: 4, valor: 'Activo', veces: 9,
		consecuencia: 'No se escribe: la matrícula se queda sin estado, y sin estado el alumno no sale en las listas.',
		opciones: ['MATR · Matriculado', 'ASIS · Asistente', 'PREM · Prematriculado', 'PREA · Preinscrito', 'FORM · Con formulario', 'RETI · Retirado', 'DESE · Desertor'], elegida: 0,
	},
];

/** Lo que dice el plan: `totales` del ensayo, y por hoja. */
export const TOTALES = { actualizar: 118, crear: 21, sin_cambios: 2, se_saltan: 1, borrar: 0 };
export const FILAS_DEL_LIBRO = 142;
export const POR_HOJA = [
	{ hoja: '6A', grupo: '6°A', filas: 36, crear: 6, actualizar: 30, se_saltan: 0, nuevos: 6 },
	{ hoja: '7A', grupo: '7°A', filas: 35, crear: 5, actualizar: 29, se_saltan: 1, nuevos: 5 },
	{ hoja: '8A', grupo: '8°A', filas: 34, crear: 4, actualizar: 29, se_saltan: 0, nuevos: 4 },
	{ hoja: '9A', grupo: '9°A', filas: 37, crear: 6, actualizar: 30, se_saltan: 0, nuevos: 6 },
];
export const A_IMPORTAR = TOTALES.crear + TOTALES.actualizar;
/** Lo que devuelve la subida: lo mismo que se dijo. `actualizados` junta actualizar y sin cambios. */
export const HECHOS = { filas: FILAS_DEL_LIBRO, creados: TOTALES.crear, actualizados: TOTALES.actualizar + TOTALES.sin_cambios, saltadas: TOTALES.se_saltan, celdas: 23 };

if (POR_HOJA.reduce((n, h) => n + h.filas, 0) !== FILAS_DEL_LIBRO) {
	throw new Error('Importar: las hojas no suman las filas del libro.');
}
if (POR_HOJA.reduce((n, h) => n + h.crear, 0) !== TOTALES.crear || POR_HOJA.reduce((n, h) => n + h.se_saltan, 0) !== TOTALES.se_saltan) {
	throw new Error('Importar: el plan por hoja no cuadra con los totales.');
}
if (POR_HOJA.reduce((n, h) => n + h.actualizar, 0) !== TOTALES.actualizar) {
	throw new Error('Importar: «Actualiza» por hoja no suma el total.');
}
if (TOTALES.actualizar + TOTALES.crear + TOTALES.sin_cambios + TOTALES.se_saltan !== FILAS_DEL_LIBRO) {
	throw new Error('Importar: los totales no suman las filas del libro.');
}
if (HECHOS.celdas !== TRUNCADOS[0].veces + TRUNCADOS[1].veces) {
	throw new Error('Importar: las celdas corregidas no son las de las dos decisiones.');
}
