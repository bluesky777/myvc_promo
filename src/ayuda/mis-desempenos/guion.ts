import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { MEDIDAS, alturaEnMenu } from '../medidas';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ACADEMICO, ANCHO_CLASE, ANCHO_PERIODO, CLASES, MENU, MIS_COMPETENCIAS, PG, UTIL, X_PERIODOS, alFotograma, plano } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «MIS DESEMPEÑOS» (hoy «Mis competencias», `/mis-competencias`).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Son las mismas filas que escribe la coordinación, no una copia.** La pantalla lo dice en
 *     su entradilla con esas palabras («lo que cambies aquí lo ve ella, y lo que ella escriba lo ves
 *     tú»), y es la decisión D31 de su cabecera: escriben los dos sobre las mismas filas. Lo que la
 *     coordinación escribe para «todos los grados» sale abajo, con candado.
 *
 * Y la de propina, porque el vídeo se llama como la pantalla vieja: el primer rótulo dice que
 * «Mis desempeños» ahora se llama «Mis competencias» (renombrada el 26 sep 2026).
 *
 * EL RITMO: se teclea a una letra cada 3 fotogramas lo que se añade a una fila, y a una cada 2 la
 * fila nueva, que es larga. Guardar y Añadir son una petición: medio segundo. No sale aviso: la
 * pantalla sólo avisa si falla.
 */

export const FPS = 30;

export const LLEGADA = {
	cursorEntra: 4,
	llegaAcademico: 30,
	pulsaAcademico: 36,
	abreAcademico: 38,
	llegaHija: 90,
	pulsaHija: 98,
	seVaLaCascara: 102,
	entraPanel: 124,
};

export const ENTRA = LLEGADA.entraPanel;
const L = (f: number) => ENTRA + f;

export const T = {
	cursorEntra: 40,
	llegaClase: 160,
	pulsaClase: 175,
	llegaLapiz: 405,
	pulsaLapiz: 418,
	teclaEdicion: 440,
	llegaGuardar: 500,
	pulsaGuardar: 512,
	pulsaNuevo: 545,
	teclaNuevo: 552,
	llegaAnadir: 617,
	pulsaAnadir: 627,
	cursorSale: 700,
};
const IDA_Y_VUELTA = 15;
export const CARGA_LA_CLASE = T.pulsaClase + IDA_Y_VUELTA;
export const GUARDADA = T.pulsaGuardar + IDA_Y_VUELTA;
export const ANADIDA = T.pulsaAnadir + IDA_Y_VUELTA;
export const POR_LETRA = 3;
export const POR_LETRA_NUEVA = 1;

/* ── Los focos ────────────────────────────────────────────────────────────────────────────── */

const holgado = (r: { x: number; y: number; ancho: number; alto: number }, h = 6) => ({ x: r.x - h, y: r.y - h, ancho: r.ancho + h * 2, alto: r.alto + h * 2 });
const pConClase = plano({ conClase: true, filas: 2, editando: false });
const pEditando = plano({ conClase: true, filas: 2, editando: true });
const pFinal = plano({ conClase: true, filas: 3, editando: false });

export const FOCOS = {
	academico: enElFotograma({ x: 0, y: alturaEnMenu(MENU, ACADEMICO, null, null), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	entradilla: alFotograma(holgado({ x: PG.relleno, y: pConClase.entradilla, ancho: 1000, alto: PG.entradilla })),
	tira: alFotograma(holgado({ x: PG.relleno, y: pConClase.tira, ancho: ANCHO_CLASE * CLASES.length, alto: PG.tira }, 4)),
	periodos: alFotograma(holgado({ x: PG.relleno, y: pConClase.periodos, ancho: X_PERIODOS - PG.relleno + 4 * ANCHO_PERIODO + 3 * 8, alto: PG.periodos }, 4)),
	fila: alFotograma(holgado({ x: PG.relleno, y: pEditando.filas[0], ancho: UTIL, alto: PG.edicion }, 4)),
	nuevo: alFotograma(holgado({ x: PG.relleno, y: pConClase.nuevo, ancho: UTIL, alto: PG.nuevo }, 4)),
	comunes: alFotograma(holgado({ x: PG.relleno, y: pFinal.comunes, ancho: UTIL, alto: PG.comunesTitulo + PG.comunesNota + 2 * PG.comun }, 4)),
};

export const PUNTOS_LLEGADA = {
	entrada: { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 150 },
	academico: { x: 150, y: alturaEnMenu(MENU, ACADEMICO, null, null) + MEDIDAS.seccion / 2 },
	hija: { x: 150, y: alturaEnMenu(MENU, ACADEMICO, MIS_COMPETENCIAS, ACADEMICO) + MEDIDAS.hija / 2 },
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_PANTALLA = { ubicacion: 'Menú ▸ Académico ▸ Mis competencias', url: '/mis-competencias' };

export const PASOS: Paso[] = [
	{ desde: 8, texto: 'Ahora se llama «Mis competencias», en Académico.', voz: 'Ahora se llama Mis competencias, en Académico.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.pulsaAcademico + 20 },
	{ desde: L(20), texto: 'Son las mismas filas que escribe la coordinación.', ...EN_LA_PANTALLA, foco: FOCOS.entradilla },
	{ desde: L(134), texto: 'Elige tu clase: aquí, 9. MAT.', voz: 'Elige tu clase: aquí, Matemáticas de noveno.', ...EN_LA_PANTALLA, foco: FOCOS.tira },
	{ desde: L(270), texto: 'Y el periodo: el 2, el de arriba.', voz: 'Y el periodo: el dos, el de arriba.', ...EN_LA_PANTALLA, foco: FOCOS.periodos },
	{ desde: L(389), texto: 'El lápiz edita; al guardar, la coordinación lo ve.', ...EN_LA_PANTALLA, foco: FOCOS.fila, focoHasta: L(GUARDADA) - 10 },
	{ desde: L(532), texto: 'Lo nuevo va abajo y vale para 9°A y 9°B.', voz: 'Lo nuevo va abajo y vale para noveno A y noveno B.', ...EN_LA_PANTALLA, foco: FOCOS.nuevo, focoHasta: L(ANADIDA) },
	{ desde: L(655), texto: 'Las del plan de área son de la coordinación: sólo se ven.', ...EN_LA_PANTALLA, foco: FOCOS.comunes },
];

export const TARJETA = L(795);
export const DURACION = TARJETA + 125;

export const CLAVE = 'mis-desempenos';

export const TITULO = 'Mis desempeños';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: ahora «Mis competencias»' },
	{ desde: L(20), titulo: 'Las mismas filas que la coordinación' },
	{ desde: L(134), titulo: 'Clase y periodo' },
	{ desde: L(389), titulo: 'Editar y añadir' },
	{ desde: L(655), titulo: 'Las del plan de área' },
];

export const CIERRE: Cierre = {
	hiciste: 'Editaste una competencia de 9. MAT y añadiste otra.',
	seVe: 'Sale en la lista, y el número de 9. MAT y del periodo 2 sube a 3.',
	despues: 'La coordinación las ve en Referencias ▸ Plan de evaluación.',
	voz: 'La coordinación las ve en su plan de evaluación.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (L(CARGA_LA_CLASE) > PASOS[3].desde) { throw new Error('Guion: el periodo se cuenta antes de que cargue la clase.'); }
