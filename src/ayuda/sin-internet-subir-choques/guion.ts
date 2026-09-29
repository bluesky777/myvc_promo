import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { CHOQUES, EL_CHOQUE_A_MANO, cuentas } from '../sin-internet/datos-de-la-subida';
import { GEO_SUBIR, Y_PIE, textoDeImportar } from '../sin-internet/Subir';
import { centro } from '../sin-internet/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * TRABAJAR SIN INTERNET, 4: «SUBIR: CHOQUES, AUSENCIAS Y QUÉ VA A PASAR».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS DOS DUDAS QUE MATA
 *
 *     1. **Ausencias es lo ÚNICO que borra historia.** El libro sólo trae el total del periodo;
 *        bajarlo borra filas con su fecha, que son las que lee la planilla de ausencias del
 *        acudiente. Por eso «Se borran» viene desmarcado y en rojo (`AUSENCIA_POR_DEFECTO`:
 *        `{ sube: 'aplicar', baja: 'dejar' }`), y el paso lleva cartel rojo.
 *     2. **Al cambiar una decisión hay que volver a leer.** El resumen es el de la lectura: con
 *        decisiones nuevas sale «N decisiones tomadas… vuelva a leer» y el botón de importar se
 *        apaga (`planEsDeAntes`, `subir.html`) hasta pulsar «Volver a leer con estas correcciones».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * SIN LLEGADA POR EL MENÚ, Y ES A PROPÓSITO (PLAN §2.2)
 *
 * Es la segunda mitad de la misma subida: el libro ya leído y la columna nueva ya decidida en el
 * vídeo anterior. Recorrer otra vez el menú obligaría a volver a elegir el archivo, y en la
 * aplicación eso descarta las decisiones tomadas. El vídeo abre en la pantalla de subir, en el
 * paso Choques, con la cabecera de ubicación diciendo dónde está; el primer rótulo lo dice.
 *
 * LO QUE NO SE AFIRMA: cuánto tarda la relectura ni la importación. No hay diálogo de confirmación
 * antes de importar (no existe en `subir.html`): el botón escribe al primer clic.
 */

export const FPS = 30;

export const CHOQUE = {
	llegaSelect: 368,
	pulsaSelect: 380,
	llegaOpcion: 400,
	pulsaOpcion: 412,
};

export const AUSENCIAS = {
	llegaPildora: 498,
	pulsaPildora: 510,
	entra: 515,
	/** La página baja para enseñar «Se borran». */
	bajaDesde: 781,
	bajaHasta: 811,
	scroll: 250,
};

export const RESUMEN = {
	llegaSiguiente: 1117,
	pulsaSiguiente: 1129,
	entra: 1135,
	bajaDesde: 1189,
	bajaHasta: 1217,
	scroll: 160,
	llegaVolver: 1264,
	pulsaVolver: 1276,
	/** La relectura: el botón se apaga, y al volver salen las cifras nuevas. */
	releido: 1324,
	subeDesde: 1326,
	subeHasta: 1348,
	bajaOtraVez: 1501,
	bajaOtraVezHasta: 1525,
	llegaImportar: 1556,
	pulsaImportar: 1568,
	escribeHasta: 1650,
	aviso: 1653,
};

/** El plan de la primera lectura: la columna de reserva sin decidir y los tres choques del sistema. Se queda hasta volver a leer. */
export const ANTES_DE_LEER = cuentas(false, 0);
export const DESPUES = cuentas(true, 1);

const f = enElFotograma;

export const FOCOS = {
	tabla: f(GEO_SUBIR.tablaChoques),
	/** La tabla y, debajo, la lista que se despliega en la última fila. */
	tablaYLista: f({ ...GEO_SUBIR.tablaChoques, alto: GEO_SUBIR.tablaChoques.alto + 84 }),
	porDefecto: f(GEO_SUBIR.opcion(0)),
	unaPorUna: f(GEO_SUBIR.opcion(2)),
	pildora: f(GEO_SUBIR.paso('ausencias')),
	seAnaden: f(GEO_SUBIR.seAnaden(0)),
	seBorran: f(GEO_SUBIR.seBorran(AUSENCIAS.scroll)),
	siguiente: f(GEO_SUBIR.siguiente(Y_PIE.ausencias, AUSENCIAS.scroll)),
	barra: f(GEO_SUBIR.barraDeAntes(RESUMEN.scroll)),
	cifras: f(GEO_SUBIR.cifrasResumen),
};

const ANCHO_IMPORTAR = 360;

export const PUNTOS = {
	entrada: { x: MEDIDAS.ancho - 200, y: MEDIDAS.alto - 60 },
	reposo: { x: MEDIDAS.ancho - 170, y: MEDIDAS.alto - 40 },
	select: centro(GEO_SUBIR.entraChoque(EL_CHOQUE_A_MANO)),
	opcion: centro(GEO_SUBIR.opcionDelChoque(EL_CHOQUE_A_MANO, 1)),
	pildora: centro(GEO_SUBIR.paso('ausencias')),
	siguiente: centro(GEO_SUBIR.siguiente(Y_PIE.ausencias, AUSENCIAS.scroll)),
	volver: centro(GEO_SUBIR.volverALeer(RESUMEN.scroll)),
	importar: centro(GEO_SUBIR.importar(RESUMEN.scroll, ANCHO_IMPORTAR)),
};

export const ANCHO_DEL_BOTON_IMPORTAR = ANCHO_IMPORTAR;

const EN_SUBIR = { ubicacion: 'Menú ▸ Académico ▸ Trabajar sin internet ▸ Subir una planilla', url: '/notas/sin-internet/subir' };

export const TEXTO_IMPORTAR = textoDeImportar({ resumen: { cuentas: DESPUES, planDeAntes: false, decisiones: 0, releyendo: false }, ausencias: { anadir: true, borrar: false } });

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Sigue del vídeo anterior.', ...EN_SUBIR },
	{ desde: 91, texto: 'Choques: notas que cambiaron tú y el sistema.', ...EN_SUBIR, foco: FOCOS.tabla },
	{ desde: 217, texto: 'Por defecto manda el sistema: las tuyas quedan fuera.', ...EN_SUBIR, foco: FOCOS.porDefecto },
	{ desde: 348, texto: 'Se puede decidir una por una, en la columna Entra.', ...EN_SUBIR, foco: FOCOS.tablaYLista },
	{ desde: 473, texto: 'Ausencias: el libro trae el total; el sistema, cada falta.', ...EN_SUBIR, foco: FOCOS.pildora, focoHasta: AUSENCIAS.pulsaPildora + 6 },
	{ desde: 646, texto: 'Subir el total crea faltas de hoy; viene marcado.', ...EN_SUBIR, foco: FOCOS.seAnaden, focoHasta: 767 },
	{ desde: 779, texto: 'Bajarlo BORRA faltas con su fecha: es lo único que borra historia.', voz: 'Bajarlo borra faltas con su fecha: es lo único que borra historia.', ...EN_SUBIR, foco: FOCOS.seBorran, rojo: true },
	{ desde: 959, texto: 'Viene sin marcar: márcalo sólo si de verdad faltó menos.', ...EN_SUBIR, foco: FOCOS.seBorran },
	{ desde: 1099, texto: 'Siguiente: Qué va a pasar.', ...EN_SUBIR, foco: FOCOS.siguiente, focoHasta: RESUMEN.entra - 10 },
	{ desde: 1187, texto: 'Tras decidir, hay que volver a leer; Importar espera apagado.', ...EN_SUBIR, foco: FOCOS.barra, focoHasta: RESUMEN.pulsaVolver + 6 },
	{ desde: 1336, texto: `Ahora sí: entran ${DESPUES.entran}, con las de la columna nueva.`, ...EN_SUBIR, foco: FOCOS.cifras, focoHasta: 1483 },
	{ desde: 1495, texto: 'Importar escribe de verdad, sin otra confirmación.', ...EN_SUBIR, rojo: true },
	{ desde: RESUMEN.aviso, texto: `Sale «Entraron ${DESPUES.entran} notas y se borraron ${DESPUES.seBorran}.»`, voz: 'Sale el aviso con lo que entró y lo que se borró.', ...EN_SUBIR },
];

export const TARJETA = 1763;
export const DURACION = 1883;

export const CLAVE = 'sin-internet-subir-choques';
export const TITULO = 'Subir: choques, ausencias y qué va a pasar';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Choques: manda el sistema, o una por una' },
	{ desde: PASOS[4].desde, titulo: 'Ausencias: lo único que borra historia' },
	{ desde: RESUMEN.entra, titulo: 'Qué va a pasar: volver a leer' },
	{ desde: PASOS[11].desde, titulo: 'Importar' },
];

export const CIERRE: Cierre = {
	hiciste: 'Decidiste los choques y las ausencias, volviste a leer e importaste.',
	seVe: `«Entraron ${DESPUES.entran} notas…» y, abajo, «Lo que pasó» con lo prometido y lo hecho.`,
	despues: 'En la planilla de cada asignatura, las notas ya están puestas.',
	voz: 'Las notas ya están en la planilla.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[PASOS.length - 1].desde !== RESUMEN.aviso) {
	throw new Error('Guion: el aviso de la importación sale donde empieza el paso que lo cuenta.');
}
if (!(CHOQUE.pulsaOpcion > PASOS[3].desde && CHOQUE.pulsaOpcion < PASOS[4].desde)) {
	throw new Error('Guion: el choque se decide a mano mientras el paso 4 lo cuenta.');
}
if (CHOQUES.length !== 3) { throw new Error('Guion: los rótulos cuentan con tres choques.'); }
