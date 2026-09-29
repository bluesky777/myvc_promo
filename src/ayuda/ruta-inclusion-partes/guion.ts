import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { EL_ESTUDIANTE, GEO_FICHA, GEO_RUTA, LA_AJENA, MENU_RUTA, centro } from '../ruta-inclusion/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * RUTA DE INCLUSIÓN, 2: «LAS CINCO PARTES».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Quién edita cada parte son tres criterios distintos** (`permisos-piar.ts`, a propósito sin
 *     unificar): lo del grupo —contexto, valoración y ajustes generales, informe— el TITULAR de
 *     ese grupo; los ajustes de cada materia, el DOCENTE DE ESA MATERIA; y los documentos, la
 *     ADMINISTRACIÓN (la caracterización sólo ella; las actas, ella o el titular). **Sin titular
 *     asignado, lo del titular no lo escribe nadie** salvo un superusuario (`esTitularDelGrupo`
 *     exige que el grupo tenga titular).
 *
 * El vídeo lo enseña con lo que la pantalla dice en cada parte: «Lo escribe: …» y, cuando no le
 * toca a quien mira, «Usted lo puede leer, no cambiar.» (`cabecera-paso.ts`). Quien mira es el
 * titular de 9°B, que dicta Matemáticas y Geometría.
 *
 * DATOS DE MENORES: estudiante inventado, sin diagnóstico; los acudientes no salen (a un docente
 * la pantalla no se los enseña). Ver `ruta-inclusion/datos.ts`.
 *
 * LO QUE NO SE AFIRMA: que el guardado sea automático (no lo es: «Editar» abre el editor y se
 * guarda con «Guardar»), ni cómo sale el papel impreso más allá de lo que dibuja la vista previa.
 */

export const FPS = 30;

export const LLEGADA = {
	cursorEntra: 16,
	llegaAcademico: 40,
	pulsaAcademico: 46,
	abreAcademico: 48,
	llegaRuta: 84,
	pulsaRuta: 96,
	monta: 102,
	/** El grupo recordado (`GrupoRecordado`) se carga solo. */
	cargado: 134,
	llegaFila: 216,
	pulsaFila: 230,
	montaFicha: 284,
};

export const PESTANAS = {
	llegaValoracion: 559, pulsaValoracion: 571,
	llegaAjustes: 703, pulsaAjustes: 715,
	llegaAjena: 845, pulsaAjena: 859,
	llegaActas: 947, pulsaActas: 959,
	llegaInforme: 1091, pulsaInforme: 1103,
};

const f = enElFotograma;

export const FOCOS = {
	academico: f(MENU_RUTA.academico),
	selector: f(GEO_RUTA.selector),
	fila: f(GEO_RUTA.fila(EL_ESTUDIANTE, false)),
	pestanas: f(GEO_FICHA.pestanas),
	loEscribe: f(GEO_FICHA.loEscribe),
	editar: f(GEO_FICHA.editar),
	materias: f(GEO_FICHA.materias),
	zona: f(GEO_FICHA.zona),
	imprimir: f(GEO_FICHA.imprimir),
	subtitulo: f(GEO_FICHA.subtitulo),
};

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	academico: { x: 150, y: MENU_RUTA.academico.y + MEDIDAS.seccion / 2 },
	ruta: { x: 150, y: MENU_RUTA.ruta.y + MEDIDAS.hija / 2 },
	reposo: { x: MEDIDAS.ancho - 170, y: MEDIDAS.alto - 40 },
	fila: { x: MEDIDAS.menu + 520, y: centro(GEO_RUTA.fila(EL_ESTUDIANTE, false)).y },
	pestana: (i: number) => centro(GEO_FICHA.pestana(i)),
	ajena: centro(GEO_FICHA.materia(LA_AJENA)),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_RUTA = { ubicacion: 'Menú ▸ Académico ▸ Ruta de inclusión', url: '/ruta-inclusion' };
const EN_LA_FICHA = { ubicacion: 'Menú ▸ Académico ▸ Ruta de inclusión ▸ Ficha de inclusión', url: '/ruta-inclusion/318/2047' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Académico, Ruta de inclusión.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.pulsaAcademico + 20 },
	{ desde: 112, texto: 'Sale el último grupo usado.', ...EN_LA_RUTA, foco: FOCOS.selector },
	{ desde: 199, texto: 'La fila del estudiante abre su ficha.', ...EN_LA_RUTA, foco: FOCOS.fila, focoHasta: LLEGADA.pulsaFila + 6 },
	{ desde: 300, texto: 'Cinco partes; el reloj marca las que faltan.', ...EN_LA_FICHA, foco: FOCOS.pestanas },
	{ desde: 425, texto: 'Quién es: lo sube la administración; aquí se lee.', ...EN_LA_FICHA, foco: FOCOS.loEscribe },
	{ desde: 559, texto: 'Valoración: la escribe el titular; por eso sale Editar.', ...EN_LA_FICHA, foco: FOCOS.editar },
	{ desde: 700, texto: 'Ajustes: los escribe el docente de cada materia.', ...EN_LA_FICHA, foco: FOCOS.materias },
	{ desde: 829, texto: 'En una materia que no es suya, sólo se lee.', ...EN_LA_FICHA, foco: FOCOS.loEscribe },
	{ desde: 944, texto: 'Actas: una por año, del titular o la administración.', ...EN_LA_FICHA, foco: FOCOS.zona },
	{ desde: 1088, texto: 'Informe: lo escribe el titular; se imprime y se firma.', ...EN_LA_FICHA, foco: FOCOS.imprimir },
	{ desde: 1229, texto: 'Sin titular asignado, eso sólo lo escribe un superusuario.', ...EN_LA_FICHA, foco: FOCOS.subtitulo },
];

export const TARJETA = 1370;
export const DURACION = 1490;

export const CLAVE = 'ruta-inclusion-partes';
export const TITULO = 'Ruta de inclusión: las cinco partes';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Del grupo a la ficha' },
	{ desde: PASOS[3].desde, titulo: 'Las cinco partes y quién escribe' },
	{ desde: PASOS[6].desde, titulo: 'Ajustes: el docente de cada materia' },
	{ desde: PASOS[8].desde, titulo: 'Actas e informe' },
	{ desde: PASOS[10].desde, titulo: 'Sin titular' },
];

export const CIERRE: Cierre = {
	hiciste: 'Recorriste las cinco partes de la ficha y quién escribe cada una.',
	seVe: 'Arriba de cada parte, «Lo escribe: …»; si no te toca, «Usted lo puede leer, no cambiar.»',
	despues: '«Al día» cuenta cuatro: caracterización, valoración, acta de este año e informe.',
	voz: 'Al día cuenta cuatro partes.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

const clics = [
	[PESTANAS.pulsaValoracion, 5], [PESTANAS.pulsaAjustes, 6], [PESTANAS.pulsaAjena, 7], [PESTANAS.pulsaActas, 8], [PESTANAS.pulsaInforme, 9],
] as const;
for (const [f2, p] of clics) {
	if (!(f2 > PASOS[p].desde && f2 < PASOS[p].desde + 40)) {
		throw new Error(`Guion: el clic del fotograma ${f2} tiene que caer al empezar el paso ${p + 1}.`);
	}
}
