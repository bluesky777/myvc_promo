import { ACADEMICO, MEDIDAS, MIS_ASIGNATURAS, alturaDeEntrada } from '../medidas';
import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { LO_QUE_SE_ESCRIBE, NOTA_NUEVA, PERIODO_DEL_LIBRO, botonComportamiento, campo, casillaNota, distintivo, lasTresFilas, pestana, seccionTitularia, todasLasPestanas } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * DOCENTE: «COMPORTAMIENTO Y EL LIBRO ROJO».
 *
 * LA DUDA QUE MATA, afinada contra el código: en pantalla la pestaña 2 SÍ es el periodo 2 (el
 * cambio de índice es interno: `periodoDe(alumno) - 1`), pero **cada ficha abre el libro en
 * Periodo 1, no en el periodo en curso** (`comportamiento-notas.ts:436`). Quien escribe sin mirar
 * la pestaña escribe en el periodo 1. Y las tres filas tienen nombre: Convivencia, Académico y
 * Acuerdos (`libro-rojo.ts:84`).
 *
 * TRES ACTOS: la llegada (Académico ▸ Mis asignaturas ▸ Grupos titularía ▸ Comportamiento), la nota
 * (medio segundo tras la última tecla: «Dato cambiado: 95»), y el libro rojo (pestaña del periodo 2,
 * escribir; dos segundos tras la última tecla: «Cambios guardados», y el número de la pestaña sube).
 *
 * EL RITMO ES EL DE LA APLICACIÓN: `ESPERA_NUMERO` 500 ms y `ESPERA_TEXTO` 2000 ms, más medio
 * segundo de ida y vuelta, y el aviso cae donde empieza el paso que lo explica (puertas abajo).
 */

export const FPS = 30;

export const LLEGADA = {
	cursorEntra: 14,
	llegaAcademico: 40,
	pulsaAcademico: 46,
	abreAcademico: 48,
	llegaMisAsignaturas: 90,
	pulsaMisAsignaturas: 100,
	montaLista: 104,
	llegaBoton: 200,
	pulsaBoton: 214,
	cursorSale: 226,
	seVaLaCascara: 232,
	entraPantalla: 262,
};

const IDA_Y_VUELTA = 15;
const ESPERA_NUMERO = 15;
const ESPERA_TEXTO = 60;

export const NOTA = {
	llega: 290,
	enfoca: 300,
	empieza: 320,
	porTecla: 5,
	suelta: 395,
	aviso: 320 + NOTA_NUEVA.length * 5 + ESPERA_NUMERO + IDA_Y_VUELTA,
};

export const LIBRO = {
	llegaPestana: 598,
	pulsaPestana: 612,
	llegaCampo: 878,
	enfoca: 888,
	empieza: 898,
	porTecla: 1,
	aviso: 898 + LO_QUE_SE_ESCRIBE.length * 1 + ESPERA_TEXTO + IDA_Y_VUELTA,
};

/** El puntero, de la fila escrita al número de la pestaña. */
export const DISTINTIVO = { sale: 1035, llega: 1065 };

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
const aire = (r: { x: number; y: number; ancho: number; alto: number }, a = 6) => ({ x: r.x - a, y: r.y - a, ancho: r.ancho + a * 2, alto: r.alto + a * 2 });

export const FOCOS = {
	/*
	 * Sólo la entrada «Académico»: antes de que se despliegue, un recuadro del alto de sus hijas
	 * cubría Personas…Configuración, que no es lo que dice el rótulo. Se apaga al desplegarse.
	 */
	academico: enElFotograma({ x: 0, y: alturaDeEntrada(ACADEMICO, null, false), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	titularia: enElFotograma(seccionTitularia()),
	boton: enElFotograma(aire(botonComportamiento(), 4)),
	nota: aire(casillaNota(), 8),
	pestanas: aire(todasLasPestanas(), 4),
	pestana2: aire(pestana(PERIODO_DEL_LIBRO), 4),
	filas: aire(lasTresFilas(), 6),
	distintivo: aire(pestana(PERIODO_DEL_LIBRO), 4),
};

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	academico: { x: 150, y: alturaDeEntrada(ACADEMICO, null, false) + MEDIDAS.seccion / 2 },
	misAsignaturas: { x: 150, y: alturaDeEntrada(ACADEMICO, MIS_ASIGNATURAS, true) + MEDIDAS.hija / 2 },
	boton: centro(botonComportamiento()),
	nota: centro(casillaNota()),
	pestana: centro(pestana(PERIODO_DEL_LIBRO)),
	campo: { x: campo(0).x + 120, y: centro(campo(0)).y },
	distintivo: centro(distintivo(PERIODO_DEL_LIBRO)),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_MIS_ASIGNATURAS = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };
const EN_COMPORTAMIENTO = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Comportamiento', url: '/comportamiento-notas/318' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Se entra por Académico, Mis asignaturas.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.abreAcademico + 20 },
	{ desde: 127, texto: 'Sólo el titular lo tiene: botón Comportamiento de tu grupo.', ...EN_MIS_ASIGNATURAS, foco: FOCOS.boton, focoHasta: LLEGADA.seVaLaCascara - 6 },
	{ desde: 265, texto: 'Arriba, la nota de Comportamiento: se guarda sola, y lo avisa.', ...EN_COMPORTAMIENTO, foco: FOCOS.nota, focoHasta: NOTA.enfoca + 4 },
	{ desde: 434, texto: 'El libro abre en Periodo 1, no en el periodo en curso.', ...EN_COMPORTAMIENTO, foco: FOCOS.pestanas },
	{ desde: 573, texto: 'Para escribir en el periodo 2, pulsa su pestaña.', voz: 'Para escribir en el periodo dos, pulsa su pestaña.', ...EN_COMPORTAMIENTO, foco: FOCOS.pestana2, focoHasta: LIBRO.pulsaPestana + 20 },
	{ desde: 714, texto: 'Las tres filas: Convivencia, Académico y Acuerdos.', ...EN_COMPORTAMIENTO, foco: FOCOS.filas },
	{ desde: 868, texto: 'Escribe; a los dos segundos se guarda sola, sin botón.', ...EN_COMPORTAMIENTO },
	{ desde: 1025, texto: 'El número de la pestaña: cuántas filas tienen algo.', ...EN_COMPORTAMIENTO, foco: FOCOS.distintivo },
];

export const AVISO_NOTA_DURA = PASOS[3].desde - NOTA.aviso;
export const AVISO_LIBRO_DURA = 75;

export const TARJETA = 1156;
export const DURACION = 1276;

export const CLAVE = 'docente-comportamiento';
export const TITULO = 'Comportamiento y el libro rojo';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Mis asignaturas, Grupos titularía' },
	{ desde: LLEGADA.entraPantalla, titulo: 'La nota de comportamiento' },
	{ desde: 434, titulo: 'El libro rojo abre en Periodo 1' },
	{ desde: 714, titulo: 'Las tres filas y cuándo se guardan' },
];

export const CIERRE: Cierre = {
	hiciste: 'Pusiste la nota de comportamiento y escribiste en el libro rojo del periodo 2.',
	seVe: `Salen «Dato cambiado: ${NOTA_NUEVA}» y «Cambios guardados», y la pestaña Periodo 2 cuenta una más.`,
	despues: 'Siguiente: registrar una situación, en Disciplina.',
	voz: 'Siguiente: registrar una situación.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* Los avisos caen dentro del paso que los explica, y el del libro se ve entero antes de la tarjeta. */
if (NOTA.aviso < PASOS[2].desde || NOTA.aviso + 30 > PASOS[3].desde) { throw new Error('Guion: «Dato cambiado» no cae dentro de su paso.'); }
if (LIBRO.aviso < PASOS[6].desde || LIBRO.aviso >= PASOS[7].desde) { throw new Error('Guion: «Cambios guardados» no cae dentro de su paso.'); }
if (DISTINTIVO.sale < PASOS[7].desde || LIBRO.aviso + AVISO_LIBRO_DURA > TARJETA) { throw new Error('Guion: el puntero sale antes del paso del número, o el aviso pisa la tarjeta.'); }
