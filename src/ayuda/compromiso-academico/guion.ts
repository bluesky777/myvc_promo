import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { MEDIDAS } from '../medidas';
import { ENTRADA_DEL_PUNTERO, alFotograma, centro, focoDelMenu, puntoDelMenu, type Rect } from '../el-ano/Aplicacion';
import { ANCHO_PANEL, CG, P_COMPROMISOS, P_PLANTILLA, enLaCascara, rectGuardarDeLaBarra, rectNav, rectPestana } from '../el-ano/colegio';
import { TEXTOS, YEAR_ID, disposicion, rectCampoCorte, rectCorte } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «COMPROMISO ACADÉMICO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     «Todavía no ha guardado» no es «está en blanco».
 *
 * Es el aviso azul de la pestaña (`colegio-compromisos.html`, `!guardada()`): el GET trae los
 * valores de fábrica ya resueltos, así que la pantalla sale llena y es lo que se imprime; guardar
 * es lo que crea la fila del colegio, que se hereda en enero (cabecera «TODAVÍA NO HA GUARDADO» NO
 * ES «ESTÁ EN BLANCO», `colegio-compromisos.ts:49-55`). El vídeo lo enseña guardando: el aviso se
 * va sólo cuando vuelve el PUT.
 *
 * Los valores que se ven son los de fábrica de verdad (`CompromisosConfigController::pintarConfig`).
 * La pestaña «Plantilla del compromiso» (el texto del papel) sólo se señala: es otra tabla, otro
 * guardar, y tiene su propio aviso de «todavía no ha tocado ningún texto».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA   Configuración -> El colegio (Periodos) -> Compromisos
 *     2. DE FÁBRICA   el aviso azul: no es «en blanco», es lo que se imprime
 *     3. GUARDAR      el corte a 2: «sin guardar», barra, «Guardar los cambios», el aviso se va
 *     4. EL PAPEL     su texto está en la pestaña de al lado
 */

export const FPS = 30;

export const T = {
	cursorEntra: 12,
	llegaConfig: 40,
	pulsaConfig: 46,
	abreConfig: 48,
	llegaColegio: 100,
	pulsaColegio: 112,
	montaColegio: 120,
	llegaPestana: 200,
	pulsaPestana: 212,
	montaCompromisos: 216,

	llegaCorte: 575,
	/** Doble clic: el 3 queda seleccionado; se teclea el 2. */
	pulsaCorte: 587,
	teclea: 609,

	llegaGuardar: 720,
	pulsaGuardar: 740,
	/** El PUT vuelve: aviso verde, se va la barra y se pliega el aviso azul. */
	guardado: 756,
	cursorSale: 1090,
};

const cas = (r: Rect) => enLaCascara(r);
const barra: Rect = { x: CG.lado, y: MEDIDAS.alto - MEDIDAS.barra - 16 - 60, ancho: ANCHO_PANEL, alto: 60 };
export const ANCHO_GUARDAR = 176;

const d1 = disposicion(1);
const d0 = disposicion(0);

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	config: puntoDelMenu('Configuración'),
	colegio: puntoDelMenu('Configuración', 'El colegio'),
	pestana: centro(cas(rectPestana(P_COMPROMISOS))),
	corte: centro(cas(rectCorte(1))),
	guardar: centro(cas(rectGuardarDeLaBarra(ANCHO_GUARDAR))),
};

export const FOCOS = {
	config: focoDelMenu('Configuración'),
	pestana: alFotograma(cas(rectPestana(P_COMPROMISOS)), 4, 6),
	aviso: alFotograma(cas(d1.alerta), 4, 10),
	valores: alFotograma(cas({ x: d1.quien.x, y: d1.quien.y, ancho: d1.plazo.x + d1.plazo.ancho - d1.quien.x, alto: d1.quien.alto }), 4, 12),
	quien: alFotograma(cas(d1.quien), 4, 12),
	corte: alFotograma(cas(rectCampoCorte(1)), 8, 8),
	barra: alFotograma(cas(barra), 4, 12),
	/** Después de guardar: la cabecera y el primer panel, que ha subido a donde estaba el aviso. */
	guardado: alFotograma(cas({ x: CG.lado, y: rectNav(0).y, ancho: ANCHO_PANEL, alto: d0.quien.y - 6 - rectNav(0).y }), 4, 12),
	plantilla: alFotograma(cas(rectPestana(P_PLANTILLA)), 4, 6),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Configuración', url: 'micolegio.micolevirtual.com/up2/' };
const EN_PERIODOS = { ubicacion: 'Menú ▸ Configuración ▸ El colegio ▸ Periodos', url: `/colegio/${YEAR_ID}/periodos` };
const AQUI = { ubicacion: 'Menú ▸ Configuración ▸ El colegio ▸ Compromisos', url: `/colegio/${YEAR_ID}/compromisos` };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Está en Configuración, El colegio.', ...EN_EL_MENU, foco: FOCOS.config, focoHasta: T.pulsaConfig + 20 },
	{ desde: T.montaColegio, texto: 'Abre en Periodos; el compromiso tiene su pestaña.', ...EN_PERIODOS, foco: FOCOS.pestana, focoHasta: T.pulsaPestana + 12 },
	{ desde: 255, texto: 'En azul: aún va la configuración de fábrica, y es lo que se imprime.', ...AQUI, foco: FOCOS.aviso },
	{ desde: 420, texto: 'Sólo «A quién se le propone» decide qué alumnos salen.', ...AQUI, foco: FOCOS.quien },
	{ desde: 555, texto: 'El corte baja a 2, y queda sin guardar.', ...AQUI, foco: FOCOS.corte },
	{ desde: 675, texto: 'Nada se guarda solo: con «Guardar los cambios».', ...AQUI, foco: FOCOS.barra, focoHasta: T.guardado },
	{ desde: 815, texto: 'Guardado, el aviso azul se va; en enero lo hereda el año nuevo.', ...AQUI, foco: FOCOS.guardado },
	{ desde: 975, texto: 'El texto del papel va aparte, en «Plantilla del compromiso».', ...AQUI, foco: FOCOS.plantilla },
];

export const AVISO = { desde: T.guardado, dura: 60, texto: TEXTOS.guardado };

export const TARJETA = 1140;
export const DURACION = TARJETA + 120;

export const CLAVE = 'compromiso-academico';
export const TITULO = 'Compromiso académico';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: El colegio, Compromisos' },
	{ desde: 255, titulo: 'Por defecto no es en blanco' },
	{ desde: 420, titulo: 'A quién se le propone' },
	{ desde: 675, titulo: 'Guardar, y que se herede' },
	{ desde: 975, titulo: 'El texto del papel' },
];

export const CIERRE: Cierre = {
	hiciste: 'Bajaste el corte del compromiso a 2 perdidas y lo guardaste.',
	seVe: 'El aviso «Guardado el compromiso académico de 2026.», y que el aviso azul ya no sale.',
	voz: 'Guardado: el aviso azul ya no sale.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (T.teclea >= PASOS[5].desde || T.pulsaCorte < PASOS[4].desde) {
	throw new Error('Guion: el corte no se cambia dentro de su paso.');
}
if (T.guardado < PASOS[5].desde || T.guardado >= PASOS[6].desde) {
	throw new Error('Guion: el aviso de guardado no cae en su paso.');
}
