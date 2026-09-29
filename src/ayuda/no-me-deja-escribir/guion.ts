import { Ritmo } from '../../notas/guion';
import { MEDIDAS, MENU_DIRECTIVO, alturaEnMenu, entradaDe } from '../medidas';
import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { RITMO_AYUDA } from '../planilla/guion';
import { FOCOS_LLEGADA, TiemposDeLlegada } from '../planilla-nota-rapida/Llegada';
import { EL_QUE_SE_CIERRA, YEAR_ID, enLaCascara, rectDelMando, rectDelTramo } from '../cierre-2/datos';
import { CAJA_AVISO, Caso, ESCRIBE, GEOMETRIA, MATEO, SELECTOR, fotograma } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «NO ME DEJA ESCRIBIR».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Las casillas grises no son una avería: el periodo está cerrado, y el aviso azul de arriba
 *     dice cuál de los cuatro casos es.** Y lo abre un administrador en Configuración ▸ El colegio
 *     ▸ Periodos, no el docente. Los cuatro textos son los de `avisoDePeriodo` (ver `datos.ts`).
 *
 * De propina, en la llegada: **el selector del periodo de la barra**. El aviso y las casillas
 * salen de las banderas DEL PERIODO ELEGIDO (la sesión las recalcula al cambiarlo), así que mirar
 * sin querer un periodo ya cerrado da exactamente esta pantalla.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA        Académico -> Mis asignaturas (el selector) -> Planilla de 9°B
 *     2. CERRADO           el aviso, y un clic en una nota y en Aus que no hace nada
 *     3. LOS OTROS TRES    Nivelando, cerrado para nivelar, y el administrador
 *     4. QUIÉN LO ABRE     menú de administrador -> Configuración -> El colegio -> Periodos
 *
 * Son 74 s y no los 45 del plan: los cuatro avisos son el vídeo, y cada uno necesita su rótulo; y
 * la planilla dice «Logro», así que lleva también el rótulo del vocabulario (PLAN §2.12).
 */

export const FPS = 30;

/* ── ACTO 1: la llegada, con una parada en el selector del periodo ────────────────────────── */

export const LLEGADA: TiemposDeLlegada = {
	cursorEntra: 4,
	llegaAcademico: 30,
	pulsaAcademico: 36,
	abreAcademico: 38,
	llegaMisAsignaturas: 80,
	pulsaMisAsignaturas: 88,
	montaLista: 92,
	llegaBoton: 280,
	pulsaBoton: 340,
	cursorSale: 350,
	seVaLaCascara: 354,
	entraLaPlanilla: 380,
};

/** El puntero va al selector del periodo y se queda ahí mientras el rótulo habla de él. */
export const PARADA = { llega: 140, sale: 240 };

export const ENTRA = LLEGADA.entraLaPlanilla;
const L = (f: number) => ENTRA + f;

/* ── ACTOS 2 y 3: la planilla, en fotogramas LOCALES ──────────────────────────────────────── */

export const PLANILLA = {
	cursorEntra: 125,
	llegaNota: 160,
	pulsaNota: 170,
	llegaAus: 196,
	pulsaAus: 206,
	nivelando: 260,
	admin: 395,
	cursorSale: 244,
	sale: 479,
};

/** Lo que tarda el relevo de un caso a otro: el texto, y las casillas cuando cambian. */
export const RELEVO = 10;

export function casoEn(f: number): Caso {
	if (f >= PLANILLA.admin) { return 'admin'; }
	if (f >= PLANILLA.nivelando) { return 'nivelando'; }
	return 'cerrado';
}

/** El caso de antes de `f`, mientras dura el relevo; `null` fuera de él. */
export function casoAnterior(f: number): Caso | null {
	for (const [cambio, antes] of [[PLANILLA.nivelando, 'cerrado'], [PLANILLA.admin, 'nivelando']] as const) {
		if (f >= cambio && f < cambio + RELEVO) { return antes; }
	}
	return null;
}

export const RITMO_CERRADA: Ritmo = { ...RITMO_AYUDA, TECLEOS: [], CONFIRMA: 100000, SALIDA: PLANILLA.sale };

/* ── ACTO 4: la cáscara del administrador, en fotogramas del clip ─────────────────────────── */

const CONFIG = entradaDe(MENU_DIRECTIVO, 'Configuración');
const EL_COLEGIO = entradaDe(MENU_DIRECTIVO, 'Configuración', 'El colegio');
export const SECCION_CONFIG = CONFIG.seccion;
export const HIJA_EL_COLEGIO = EL_COLEGIO.hija!;

export const ADMIN = {
	aparece: 380 + 479 + 46,
	cursorEntra: 913,
	llegaConfig: 936,
	pulsaConfig: 942,
	abreConfig: 944,
	llegaColegio: 990,
	pulsaColegio: 998,
	montaColegio: 1004,
	llegaCalificando: 1194,
	cursorSale: 1279,
};

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
const holgado = (r: { x: number; y: number; ancho: number; alto: number }, h = 6) => ({ x: r.x - h, y: r.y - h, ancho: r.ancho + h * 2, alto: r.alto + h * 2 });

export const PUNTOS_ADMIN = {
	entrada: { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 160 },
	config: { x: 150, y: alturaEnMenu(MENU_DIRECTIVO, SECCION_CONFIG, null, null) + MEDIDAS.seccion / 2 },
	colegio: { x: 150, y: alturaEnMenu(MENU_DIRECTIVO, SECCION_CONFIG, HIJA_EL_COLEGIO, SECCION_CONFIG) + MEDIDAS.hija / 2 },
	calificando: centro(enLaCascara(rectDelTramo(EL_QUE_SE_CIERRA, 'calificando'))),
};

/* ── Los focos ────────────────────────────────────────────────────────────────────────────── */

const filaDeMateo = (() => {
	const a = GEOMETRIA.celda(MATEO, 'num');
	const b = GEOMETRIA.celda(MATEO, 'tardanzas');
	return { x: a.x, y: a.y, ancho: b.x + b.ancho - a.x, alto: a.alto };
})();

export const FOCOS = {
	...FOCOS_LLEGADA,
	selector: enElFotograma(holgado(SELECTOR, 4)),
	aviso: fotograma(holgado(CAJA_AVISO, 6)),
	fila: fotograma(holgado(filaDeMateo, 3)),
	/* La cabecera del logro, «Logro 2 · Álgebra»: la fila de arriba de las tres columnas de nota. */
	unidad: fotograma(holgado({ x: GEOMETRIA.cabecera(0).x, y: GEOMETRIA.cabecera(0).y - 45, ancho: GEOMETRIA.anchos.nota * 3, alto: 45 }, 3)),
	config: enElFotograma({ x: 0, y: alturaEnMenu(MENU_DIRECTIVO, SECCION_CONFIG, null, null), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	mando: enElFotograma(holgado(enLaCascara(rectDelMando(EL_QUE_SE_CIERRA)))),
	calificando: enElFotograma(holgado(enLaCascara(rectDelTramo(EL_QUE_SE_CIERRA, 'calificando')), 4)),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_LISTA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };
const EN_LA_PLANILLA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Planilla', url: '/planilla-notas/1222' };
const EN_CONFIG = { ubicacion: 'Menú ▸ Configuración', url: 'micolegio.micolevirtual.com/up2/' };
const EN_PERIODOS = { ubicacion: 'Menú ▸ Configuración ▸ El colegio ▸ Periodos', url: `/colegio/${YEAR_ID}/periodos` };

export const PASOS: Paso[] = [
	{ desde: 8, texto: 'Si no te deja escribir, abre Mis asignaturas.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.pulsaAcademico + 20 },
	{ desde: 130, texto: 'Mira el periodo de arriba: cada uno se cierra aparte.', ...EN_LA_LISTA, foco: FOCOS.selector, focoHasta: PARADA.sale },
	{ desde: 259, texto: 'En la fila de 9°B, pulsa Planilla.', voz: 'En la fila de noveno B, pulsa Planilla.', ...EN_LA_LISTA, foco: FOCOS.botonPlanilla, focoHasta: LLEGADA.seVaLaCascara - 6 },
	{ desde: L(8), texto: 'Casillas grises: el aviso de arriba dice por qué.', ...EN_LA_PLANILLA, foco: FOCOS.aviso },
	{ desde: L(137), texto: 'Un clic no hace nada: ni notas ni faltas.', ...EN_LA_PLANILLA, foco: FOCOS.fila },
	{ desde: L(PLANILLA.nivelando), texto: 'Semana de nivelaciones: sólo se nivela lo perdido.', ...EN_LA_PLANILLA, foco: FOCOS.aviso },
	{ desde: L(PLANILLA.admin), texto: 'Como administrador te avisa igual, pero te deja escribir.', ...EN_LA_PLANILLA, foco: FOCOS.aviso, focoHasta: L(PLANILLA.sale) },
	{ desde: ADMIN.aparece, texto: 'Lo abre un administrador: Configuración, El colegio.', ...EN_CONFIG, foco: FOCOS.config, focoHasta: ADMIN.pulsaConfig + 20 },
	{ desde: 1050, texto: 'Pestaña Periodos: el 2 está en «Cerrado».', voz: 'Pestaña Periodos: el dos está en Cerrado.', ...EN_PERIODOS, foco: FOCOS.mando },
	{ desde: 1172, texto: '«Calificando» devuelve las notas y la asistencia.', voz: 'Calificando devuelve las notas y la asistencia.', ...EN_PERIODOS, foco: FOCOS.calificando },
];

export const TARJETA = 1292;
export const DURACION = TARJETA + 145;

export const CLAVE = 'no-me-deja-escribir';

export const TITULO = '«No me deja escribir»';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: la planilla, y el periodo' },
	{ desde: L(8), titulo: 'Casillas grises: el aviso de arriba' },
	{ desde: L(PLANILLA.nivelando), titulo: 'Los otros dos avisos' },
	{ desde: ADMIN.aparece, titulo: 'Quién lo abre: El colegio, Periodos' },
];

export const CIERRE: Cierre = {
	hiciste: 'Leíste en el aviso de arriba por qué la planilla no deja escribir.',
	seVe: 'Con el periodo en «Calificando», las casillas vuelven a ser blancas.',
	despues: 'Si es semana de nivelaciones: «Nivelar no es corregir».',
	voz: 'Si es semana de nivelaciones: nivelar no es corregir.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* ── Las puertas propias ──────────────────────────────────────────────────────────────────── */

/* Cada rótulo de un caso empieza cuando el aviso ya dice ese caso, y dice lo que el caso deja. */
([['nivelando', 5], ['admin', 6]] as const).forEach(([caso, i]) => {
	if (casoEn(PASOS[i].desde - ENTRA) !== caso) {
		throw new Error(`Guion: el paso ${i + 1} habla de «${caso}» y el aviso dice «${casoEn(PASOS[i].desde - ENTRA)}».`);
	}
});
/* Los dos clics sin efecto caen con el periodo cerrado de verdad. */
if (ESCRIBE[casoEn(PLANILLA.pulsaNota)] || ESCRIBE[casoEn(PLANILLA.pulsaAus)]) {
	throw new Error('Guion: los clics que «no hacen nada» caen en un caso que sí escribe.');
}
/* La planilla se ha ido entera (filas y panel) antes de que aparezca la cáscara del administrador. */
if (L(PLANILLA.sale + 46) > ADMIN.aparece) {
	throw new Error('Guion: la cáscara del administrador aparece antes de que la planilla se haya ido.');
}
