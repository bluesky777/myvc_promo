import { ALTO_CONTROL } from '../montar-el-ano/ant';
import { MAIN, mainDe, type Rect } from '../comun-directivo/lugar';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA SERIE «HORARIO»: LAS PANTALLAS DE `paginas/horario` EN NÚMEROS, para los cuatro vídeos.
 *
 * Las anchuras son las de sus `scss`: la lista, la versión y la impresión van a 62rem (992 px) y
 * las dos del programa a 52rem (832), centradas en el panel. Todo en coordenadas de la cáscara.
 *
 * El colegio es el de siempre, con trece grupos y doce docentes, todos inventados.
 */

export const LISTA = mainDe(992);
export const ESTRECHA = mainDe(832);

/* ════════════════════════════ LAS VERSIONES ════════════════════════════ */

export interface Version {
	id: number;
	nombre: string;
	rige: boolean;
	masReciente: boolean;
	veredicto: string;
	reparos: boolean;
	quien: string;
	cuando: string;
}

export const VERSIONES: Version[] = [
	{
		id: 7, nombre: 'Subida del 24 de septiembre de 2026', rige: false, masReciente: true, reparos: false,
		veredicto: 'Sin reparos cuando se subió · 13 renglones comprobados.', quien: 'Diego Alejandro Rincón Duarte', cuando: '24 sept 2026, 18:40',
	},
	{
		id: 6, nombre: 'Subida del 3 de septiembre de 2026', rige: true, masReciente: false, reparos: true,
		veredicto: 'Cuando se subió, 2 de 13 renglones no llegaban a su intensidad horaria: 10°A (28 de 30), 11°B (29 de 30).',
		quien: 'Diego Alejandro Rincón Duarte', cuando: '3 sept 2026, 19:57',
	},
	{
		id: 5, nombre: 'Subida del 12 de agosto de 2026', rige: false, masReciente: false, reparos: false,
		veredicto: 'Sin reparos cuando se subió · 13 renglones comprobados.', quien: 'Luz Marina Ortega Pabón', cuando: '12 ago 2026, 07:12',
	},
];

export const LA_QUE_RIGE = VERSIONES.findIndex((v) => v.rige);
export const LA_NUEVA = VERSIONES.findIndex((v) => v.masReciente);

/** Lo que mide cada fila de la lista: cabeza, veredicto (una o dos líneas) y pie. */
export const FILA_VERSION = { relleno: 12, cabeza: 32, veredicto: 22, pie: 20, hueco: 12 };
export const ALTO_CONFIRMAR = 128;

const altoDeFila = (v: Version, confirmando: number) =>
	FILA_VERSION.relleno * 2 + FILA_VERSION.cabeza + 6 + FILA_VERSION.veredicto * (v.reparos ? 2 : 1) + 4 + FILA_VERSION.pie + confirmando * ALTO_CONFIRMAR;

export const LISTA_Y = { cabecera: LISTA.y, rige: LISTA.y + 56, filas: LISTA.y + 96 };

/** `confirmando` (0..1) es la caja «Publicar…» abierta dentro de la fila nueva. */
export function rectVersion(i: number, confirmando = 0): Rect {
	let y = LISTA_Y.filas;
	for (let k = 0; k < i; k++) { y += altoDeFila(VERSIONES[k], k === LA_NUEVA ? confirmando : 0) + FILA_VERSION.hueco; }
	return { x: LISTA.x, y, ancho: LISTA.ancho, alto: altoDeFila(VERSIONES[i], i === LA_NUEVA ? confirmando : 0) };
}

export const BOTON_VER = { ancho: 142 };
export const BOTON_PUBLICAR = { ancho: 100 };

export function rectVer(i: number, conPublicar: boolean, confirmando = 0): Rect {
	const r = rectVersion(i, confirmando);
	const derecha = r.x + r.ancho - 16 - (conPublicar && !VERSIONES[i].rige ? BOTON_PUBLICAR.ancho + 8 : 0);
	return { x: derecha - BOTON_VER.ancho, y: r.y + FILA_VERSION.relleno, ancho: BOTON_VER.ancho, alto: ALTO_CONTROL };
}

export function rectPublicar(i: number, confirmando = 0): Rect {
	const r = rectVersion(i, confirmando);
	return { x: r.x + r.ancho - 16 - BOTON_PUBLICAR.ancho, y: r.y + FILA_VERSION.relleno, ancho: BOTON_PUBLICAR.ancho, alto: ALTO_CONTROL };
}

/** La etiqueta de la cabeza de la fila («Rige el colegio» o «La más reciente»), para el foco. */
export function rectCabeza(i: number): Rect {
	const r = rectVersion(i);
	return { x: r.x + 12, y: r.y + FILA_VERSION.relleno - 2, ancho: 560, alto: FILA_VERSION.cabeza + 4 };
}

export function rectConfirmar(confirmando = 1): Rect {
	const r = rectVersion(LA_NUEVA, confirmando);
	return { x: r.x + 16, y: r.y + r.alto - FILA_VERSION.relleno - ALTO_CONFIRMAR + 8, ancho: r.ancho - 32, alto: ALTO_CONFIRMAR - 8 };
}

export const rectNoPublicar = (): Rect => {
	const c = rectConfirmar();
	return { x: c.x + 16 + 384 + 8, y: c.y + c.alto - 14 - ALTO_CONTROL, ancho: 110, alto: ALTO_CONTROL };
};

/* ════════════════════════════ UNA VERSIÓN ════════════════════════════ */

export const VERSION_Y = {
	volver: LISTA.y,
	titulo: LISTA.y + 44,
	aviso: LISTA.y + 92,
	resumen: LISTA.y + 194,
	filtro: LISTA.y + 256,
	parrilla: LISTA.y + 304,
};

export const rectVolver = (): Rect => ({ x: LISTA.x, y: VERSION_Y.volver, ancho: 184, alto: ALTO_CONTROL });
export const rectAvisoVersion = (): Rect => ({ x: LISTA.x, y: VERSION_Y.aviso, ancho: LISTA.ancho, alto: 90 });

export const GRUPOS = ['5A', '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B'];
export const NOMBRES_DE_GRUPO = GRUPOS.map((g) => g.replace(/^(\d+)/, '$1°'));

/** Doce docentes, con el tono de su color en la parrilla. */
export const DOCENTES = [
	{ nombre: 'Hernando Pabón Rivera', abrev: 'MAT', tono: 210 },
	{ nombre: 'Clara Inés Vera Suárez', abrev: 'LEN', tono: 24 },
	{ nombre: 'Wilson Ferney Gélvez Rozo', abrev: 'ING', tono: 150 },
	{ nombre: 'Ruth Mery Contreras Pinto', abrev: 'NAT', tono: 110 },
	{ nombre: 'Jairo Alonso Ramírez Leal', abrev: 'SOC', tono: 45 },
	{ nombre: 'Sandra Milena Ortiz Paz', abrev: 'EMP', tono: 320 },
	{ nombre: 'Óscar Iván Duarte Mora', abrev: 'EDF', tono: 0 },
	{ nombre: 'Liliana Patricia Sepúlveda Gil', abrev: 'ART', tono: 340 },
	{ nombre: 'Fabio Andrés Carvajal Niño', abrev: 'TEC', tono: 250 },
	{ nombre: 'Gloria Amparo Quintero Rey', abrev: 'REL', tono: 275 },
	{ nombre: 'Nelson Javier Bautista Ríos', abrev: 'FIS', tono: 185 },
	{ nombre: 'Yolanda Esther Castro León', abrev: 'QUI', tono: 70 },
];

/** Qué docente tiene el grupo `g` en la lección `l` del día `d`: una cuenta fija, sin azar. */
export const docenteEn = (d: number, l: number, g: number) => (g * 5 + l * 7 + d * 3 + ((g * l) % 4)) % DOCENTES.length;

export const LECCIONES = 7;

/* ════════════════════════════ EL PROGRAMA ════════════════════════════ */

export const DESCARGAS = [
	{ sistema: 'Windows', tam: '85,3 MB', este: true },
	{ sistema: 'Mac con chip Apple (M1, M2, M3…)', tam: '92,1 MB', este: false },
	{ sistema: 'Mac con procesador Intel', tam: '94,6 MB', este: false },
	{ sistema: 'Linux', tam: '88,0 MB', este: false },
];

export const PROGRAMA_Y = { intro: ESTRECHA.y + 52, version: ESTRECHA.y + 114, filas: ESTRECHA.y + 150, filaAlto: 60, filaHueco: 12 };

export const rectDescarga = (i: number): Rect => ({ x: ESTRECHA.x, y: PROGRAMA_Y.filas + i * (PROGRAMA_Y.filaAlto + PROGRAMA_Y.filaHueco), ancho: ESTRECHA.ancho, alto: PROGRAMA_Y.filaAlto });
export const rectBotonDescarga = (i: number): Rect => { const r = rectDescarga(i); return { x: r.x + 16, y: r.y + 14, ancho: [228, 404, 344, 210][i], alto: ALTO_CONTROL }; };

export const DESPUES_Y = PROGRAMA_Y.filas + DESCARGAS.length * (PROGRAMA_Y.filaAlto + PROGRAMA_Y.filaHueco) + 14;
export const rectViñeta = (i: number): Rect => ({ x: ESTRECHA.x, y: DESPUES_Y + 44 + i * 30, ancho: ESTRECHA.ancho, alto: 26 });
export const rectIntroPrograma = (): Rect => ({ x: ESTRECHA.x, y: PROGRAMA_Y.intro, ancho: ESTRECHA.ancho, alto: 48 });
export const rectAvisoPrograma = (): Rect => ({ x: ESTRECHA.x, y: PROGRAMA_Y.version, ancho: ESTRECHA.ancho, alto: 100 });

export const VERSION_DEL_PROGRAMA = { numero: '1.4.2', fecha: '18 de septiembre de 2026' };

/* ════════════════════════════ CUADRAR ════════════════════════════ */

export const CUADRAR_Y = { parrafo: ESTRECHA.y + 52, gris: ESTRECHA.y + 134, boton: ESTRECHA.y + 172, estado: ESTRECHA.y + 224, saber: ESTRECHA.y + 350 };
export const rectAbrir = (volver = false): Rect => ({ x: ESTRECHA.x, y: CUADRAR_Y.boton, ancho: volver ? 176 : 262, alto: ALTO_CONTROL });
export const rectParrafoCuadrar = (): Rect => ({ x: ESTRECHA.x, y: CUADRAR_Y.parrafo, ancho: ESTRECHA.ancho, alto: 100 });
export const rectEstadoCuadrar = (alto = 100): Rect => ({ x: ESTRECHA.x, y: CUADRAR_Y.estado, ancho: ESTRECHA.ancho, alto });

/* ════════════════════════════ IMPRIMIR ════════════════════════════ */

export interface Informe { clave: string; titulo: string; pregunta: string; nota?: string; eje?: string[] }

export const SALONES = ['Laboratorio', 'Coliseo', 'Sala de sistemas'];

export const INFORMES: Informe[] = [
	{ clave: 'grupo', titulo: 'Horario por grupo', pregunta: 'La semana de cada grupo, una hoja por grupo.', eje: NOMBRES_DE_GRUPO },
	{ clave: 'docente', titulo: 'Horario por docente', pregunta: 'La semana de cada docente, una hoja por docente.', eje: DOCENTES.map((d) => d.nombre) },
	{ clave: 'colegio', titulo: 'El colegio entero', pregunta: 'Todos los grupos en una sola rejilla, para ver el colegio de un vistazo.' },
	{
		clave: 'salon', titulo: 'Horario por salón', pregunta: 'Qué pasa en cada salón, una hoja por salón.', eje: SALONES,
		nota: 'Sólo 96 de las 412 lecciones de esta versión traen salón, así que estas hojas cubren esa parte y no el horario entero.',
	},
	{ clave: 'carga', titulo: 'Carga por docente', pregunta: 'Cuántas horas tiene cada docente y qué ventanas le quedan.' },
	{ clave: 'libre', titulo: 'Quién está libre', pregunta: 'Qué docentes quedan libres en cada casilla de la semana.' },
];

export const IMPRIMIR_Y = { subtitulo: LISTA.y + 42, lista: LISTA.y + 80 };
export const FILA_INFORME = { alto: 64, nota: 22, hueco: 8, ejeFila: 30, ejeColumnas: 4 };

const altoEje = (n: number, t: number) => Math.ceil(n / FILA_INFORME.ejeColumnas) * FILA_INFORME.ejeFila * t + (t > 0 ? 10 * t : 0);

/** `abiertos`: cuánto está desplegada la lista de cada informe (0..1). */
export function rectInforme(i: number, abiertos: Record<string, number> = {}): Rect {
	let y = IMPRIMIR_Y.lista;
	for (let k = 0; k <= i; k++) {
		const inf = INFORMES[k];
		const alto = FILA_INFORME.alto + (inf.nota ? FILA_INFORME.nota : 0) + altoEje(inf.eje?.length ?? 0, abiertos[inf.clave] ?? 0);
		if (k === i) { return { x: LISTA.x, y, ancho: LISTA.ancho, alto }; }
		y += alto + FILA_INFORME.hueco;
	}
	throw new Error('Imprimir: no hay ese informe.');
}

export const rectCasillaInforme = (i: number, abiertos: Record<string, number> = {}): Rect => {
	const r = rectInforme(i, abiertos);
	return { x: r.x + 14, y: r.y + 14, ancho: 240, alto: 22 };
};

/** La barra pegada abajo: se queda en el borde de la ventana aunque la lista siga. */
export const PIE_IMPRIMIR = { x: LISTA.x, y: 900 - 24 - 16 - 56, ancho: LISTA.ancho, alto: 56 };
export const rectBotonImprimir = (): Rect => ({ x: PIE_IMPRIMIR.x + PIE_IMPRIMIR.ancho - 120, y: PIE_IMPRIMIR.y + 12, ancho: 120, alto: ALTO_CONTROL });
export const rectContador = (): Rect => ({ x: PIE_IMPRIMIR.x, y: PIE_IMPRIMIR.y + 8, ancho: 300, alto: 40 });

export { MAIN };
