import { ACADEMICO, MEDIDAS, SECCIONES, alturaDeEntrada } from '../medidas';
import { DOCENTE } from '../sin-internet/datos-del-libro';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «RUTA DE INCLUSIÓN»: LO QUE SE VE EN EL LISTADO DEL GRUPO Y EN LA FICHA, Y DÓNDE CAE CADA COSA.
 *
 * SON DATOS DE MENORES Y DE LOS MÁS DELICADOS DEL SISTEMA, así que aquí va lo mínimo y genérico:
 * dos estudiantes inventados, sin diagnóstico ninguno (la pantalla no tiene ese campo: «ERE» es
 * sólo una marca), y en «Observaciones rápidas» apoyos de aula que valen para cualquiera. Los
 * acudientes no se dibujan: a un docente la pantalla no se los enseña («Los acudientes no se
 * muestran en esta pantalla salvo a un superusuario»), y eso es lo que sale.
 *
 * El docente es el mismo de los vídeos de la planilla, titular de 9°B (la estrella de su grupo,
 * como en la rejilla de disciplina).
 */

export const RUTA = SECCIONES[ACADEMICO].hijas!.indexOf('Ruta de inclusión');

export const GRUPOS_RUTA = [
	{ abrev: '8A', titular: false },
	{ abrev: '9A', titular: false },
	{ abrev: '9B', titular: true },
	{ abrev: '10A', titular: false },
];
export const EL_GRUPO = 2;
export const GRUPO = { nombre: 'Noveno B', grado: 'Noveno', abrev: '9B' };
export const TITULAR = DOCENTE;

export const CONTEXTO =
	'Grupo participativo, que trabaja mejor en equipos pequeños y con instrucciones escritas en el tablero. Las familias asisten con regularidad a las reuniones de periodo.';

export interface EstudianteERE {
	apellidos: string;
	nombres: string;
	sexo: 'mujer' | 'hombre';
	avatar: number;
	observacion: string;
	/** Las cuatro partes que cuentan: caracterización, valoración, acta de este año, informe. */
	hechas: [boolean, boolean, boolean, boolean];
}

export const ESTUDIANTES: EstudianteERE[] = [
	{ apellidos: 'Bedoya Arango', nombres: 'Salomé', sexo: 'mujer', avatar: 3, observacion: 'Instrucciones cortas y por escrito; revisar la agenda al final de la clase.', hechas: [true, true, true, true] },
	{ apellidos: 'Restrepo Cano', nombres: 'Martín', sexo: 'hombre', avatar: 4, observacion: 'Se sienta cerca del tablero; tiempo adicional en las evaluaciones.', hechas: [true, false, true, false] },
];
export const EL_ESTUDIANTE = 1;

const PIEZAS = ['la caracterización', 'la valoración', 'el acta de este año', 'el informe'];

/** «Falta X», «Falta X y Y», «Falta X, Y y Z» (`partes-del-piar.ts`), o «Al día». */
export function estadoDe(e: EstudianteERE): { alDia: boolean; texto: string } {
	const faltan = PIEZAS.filter((_, i) => !e.hechas[i]);
	if (faltan.length === 0) { return { alDia: true, texto: 'Al día' }; }
	const lista = faltan.length === 1 ? faltan[0] : `${faltan.slice(0, -1).join(', ')} y ${faltan[faltan.length - 1]}`;
	return { alDia: false, texto: `Falta ${lista}` };
}

export const AL_DIA = ESTUDIANTES.filter((e) => estadoDe(e).alDia).length;

/* ── La geometría del listado, en coordenadas del CONTENIDO ─────────────────────────────── */

export const L = {
	arriba: 28,
	lados: 36,
	ancho: MEDIDAS.ancho - MEDIDAS.menu - 72,
	yIntro: 74,
	ySelector: 170,
	boton: { ancho: 74, alto: 40, hueco: 10 },
	yTitular: 228,
	altoTitular: 84,
	yContexto: 326,
	altoContexto: 46,
	/** Lo que crece «Contexto del grupo» al abrirse. */
	abierto: 176,
	yLista: 392,
	fila: 76,
	hueco: 8,
};

const X0 = MEDIDAS.menu + L.lados;
const Y0 = MEDIDAS.barra;

export const GEO_RUTA = {
	selector: { x: X0 - 6, y: Y0 + L.ySelector - 6, ancho: GRUPOS_RUTA.length * (L.boton.ancho + L.boton.hueco) + 2, alto: L.boton.alto + 12 },
	boton: (i: number) => ({ x: X0 + i * (L.boton.ancho + L.boton.hueco), y: Y0 + L.ySelector, ancho: L.boton.ancho, alto: L.boton.alto }),
	titular: { x: X0, y: Y0 + L.yTitular, ancho: L.ancho, alto: L.altoTitular },
	cuenta: { x: X0 + L.ancho - 200, y: Y0 + L.yTitular + 6, ancho: 194, alto: L.altoTitular - 12 },
	contexto: (abierto: boolean) => ({ x: X0, y: Y0 + L.yContexto, ancho: L.ancho, alto: L.altoContexto + (abierto ? L.abierto : 0) }),
	resumenContexto: { x: X0 + 10, y: Y0 + L.yContexto + 6, ancho: 300, alto: 34 },
	lista: (abierto: boolean) => ({ x: X0, y: Y0 + L.yLista + (abierto ? L.abierto : 0), ancho: L.ancho, alto: 40 + ESTUDIANTES.length * (L.fila + L.hueco) }),
	fila: (i: number, abierto: boolean) => ({ x: X0, y: Y0 + L.yLista + (abierto ? L.abierto : 0) + 40 + i * (L.fila + L.hueco), ancho: L.ancho, alto: L.fila }),
	estado: (i: number, abierto: boolean) => ({ x: X0 + L.ancho - 520, y: Y0 + L.yLista + (abierto ? L.abierto : 0) + 40 + i * (L.fila + L.hueco) + 8, ancho: 490, alto: L.fila - 16 }),
	pie: (abierto: boolean) => ({ x: X0, y: Y0 + L.yLista + (abierto ? L.abierto : 0) + 40 + ESTUDIANTES.length * (L.fila + L.hueco) + 4, ancho: L.ancho, alto: 56 }),
};

export const MENU_RUTA = {
	academico: { x: 0, y: alturaDeEntrada(ACADEMICO, null, false), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion },
	ruta: { x: 0, y: alturaDeEntrada(ACADEMICO, RUTA, true), ancho: MEDIDAS.menu, alto: MEDIDAS.hija },
};

/* ── La ficha ──────────────────────────────────────────────────────────────────────────── */

export const PARTES = [
	{ corto: 'Quién es', titulo: 'Quién es el estudiante', explica: 'Su contacto, sus acudientes, y el informe de caracterización que hace el colegio.', escribe: 'La administración del colegio sube el documento', puede: false },
	{ corto: 'Valoración', titulo: 'Valoración pedagógica', explica: 'Cómo va el estudiante y qué se le ajusta en general, para todas sus materias.', escribe: 'El titular del grupo', puede: true },
	{ corto: 'Ajustes por materia', titulo: 'Apoyos y ajustes razonables por asignatura', explica: 'Lo que hace cada docente en su clase con este estudiante, y si está funcionando.', escribe: 'El docente de cada materia, no el titular', puede: true },
	{ corto: 'Actas', titulo: 'Actas de acuerdo', explica: 'Lo que se acordó con la familia, firmado. Una por cada año de matrícula.', escribe: 'El titular o la administración', puede: true },
	{ corto: 'Informe', titulo: 'Informe de proceso pedagógico', explica: 'La hoja que se imprime, se firma y se entrega a la familia.', escribe: 'El titular del grupo', puede: true },
];

/** Las materias del estudiante en 9°B. El docente dicta las dos primeras. */
export const MATERIAS = [
	{ nombre: 'Matemáticas', suya: true },
	{ nombre: 'Geometría', suya: true },
	{ nombre: 'Ciencias Naturales', suya: false },
	{ nombre: 'Lengua Castellana', suya: false },
	{ nombre: 'Inglés', suya: false },
];
export const LA_AJENA = 2;

export const APOYOS: Record<string, string> = {
	'Matemáticas': 'Ejemplos resueltos paso a paso antes de cada ejercicio; la evaluación se lee en voz alta.',
	'Ciencias Naturales': 'Guía con imágenes para cada práctica de laboratorio y trabajo en pareja.',
};

export const F = {
	arriba: 22,
	lados: 36,
	ancho: MEDIDAS.ancho - MEDIDAS.menu - 72,
	yCabeza: 58,
	altoCabeza: 96,
	yPestanas: 172,
	altoPestanas: 50,
	yPaso: 244,
	yContenido: 356,
};

const anchoDePestana = [150, 164, 214, 124, 132];
export const xDePestana = (i: number) => F.lados + anchoDePestana.slice(0, i).reduce((a, b) => a + b, 0) + i * 8;

/** Los botones de las materias (pestaña 3): su ancho, y dónde empieza cada uno. */
export const ANCHO_MATERIA = [140, 124, 184, 178, 92];
export const xDeMateria = (i: number) => ANCHO_MATERIA.slice(0, i).reduce((a, b) => a + b, 0) + i * 8;

/**
 * La pestaña 3 por dentro: la nota de arriba (una línea en una caja de alto fijo), el hueco y los
 * botones de las materias. El dibujo y el foco salen de estos tres números.
 */
export const AJUSTES = { nota: 32, hueco: 8, arriba: 6 };
const Y_MATERIAS = AJUSTES.nota + AJUSTES.hueco + AJUSTES.arriba;

export const GEO_FICHA = {
	cabeza: { x: MEDIDAS.menu + F.lados, y: Y0 + F.yCabeza, ancho: F.ancho, alto: F.altoCabeza },
	subtitulo: { x: MEDIDAS.menu + F.lados + 84, y: Y0 + F.yCabeza + 52, ancho: 470, alto: 28 },
	pestanas: { x: MEDIDAS.menu + F.lados, y: Y0 + F.yPestanas, ancho: F.ancho, alto: F.altoPestanas },
	pestana: (i: number) => ({ x: MEDIDAS.menu + xDePestana(i), y: Y0 + F.yPestanas + 6, ancho: anchoDePestana[i], alto: F.altoPestanas - 12 }),
	loEscribe: { x: MEDIDAS.menu + F.lados - 6, y: Y0 + F.yPaso + 60, ancho: 760, alto: 32 },
	paso: { x: MEDIDAS.menu + F.lados - 6, y: Y0 + F.yPaso - 6, ancho: F.ancho + 12, alto: 112 },
	editar: { x: MEDIDAS.menu + F.lados + F.ancho - 100, y: Y0 + F.yContenido + 36, ancho: 96, alto: 34 },
	materias: { x: MEDIDAS.menu + F.lados - 6, y: Y0 + F.yContenido + Y_MATERIAS - 6, ancho: 760, alto: 50 },
	materia: (i: number) => ({ x: MEDIDAS.menu + F.lados + xDeMateria(i), y: Y0 + F.yContenido + Y_MATERIAS, ancho: ANCHO_MATERIA[i], alto: 38 }),
	zona: { x: MEDIDAS.menu + F.lados - 6, y: Y0 + F.yContenido - 6, ancho: F.ancho + 12, alto: 164 },
	imprimir: { x: MEDIDAS.menu + F.lados + 612, y: Y0 + F.yContenido, ancho: 130, alto: 38 },
	volver: { x: MEDIDAS.menu + F.lados, y: Y0 + F.arriba, ancho: 290, alto: 26 },
};

export const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
