import { enElFotograma } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, GRUPOS as GRUPOS_EN_EL_MENU, puntoDelMenu, rectDelMenu } from '../montar-el-ano/EnLaCascara';
import { centro, type Rect } from '../montar-el-ano/planoAsignaturas';
import { rectCeldasGrupos, rectConjunto, rectFichaDelEditor, rectFrase, rectGuardarJuntos, rectJuntar, rectJuntos, rectSeparar } from '../montar-el-ano/planoGrupos';
import { fotogramasDe } from '../montar-el-ano/tiempo';
import { AVISO_JUNTOS, JUNTOS, M, estadoEn } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «GRUPOS QUE VAN SIEMPRE JUNTOS».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **SÓLO afecta al horario: no mezcla listas, ni notas, ni boletines.** Lo único que se guarda
 *     es `grupos.juntos_con`, y fuera de esta pantalla sólo lo leen el importador del programa de
 *     horarios y la copia del año nuevo (`YearsController`). El rótulo 7 lo dice sobre la rejilla,
 *     donde cada grupo sigue en su fila y con sus alumnos.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA   Referencias -> Grupos; el recuadro de arriba
 *     2. JUNTAR       Juntar grupos: tres fichas, la frase que se escribe sola, Guardar
 *     3. QUÉ CAMBIA   el conjunto y «Va junto con»; y nada más; Separar
 *
 * El aviso «Prejardín, Jardín y Transición van juntos» dura 2,5 s (`nzDuration: 2500`).
 */

export const FPS = 30;

const f = (r: Rect, margen = 6) => {
	const y = Math.max(r.y - margen, MEDIDAS.barra);
	const abajo = Math.min(r.y + r.alto + margen, MEDIDAS.alto - 6);
	return enElFotograma({ x: r.x - margen, y, ancho: r.ancho + margen * 2, alto: abajo - y });
};

const conEditor = estadoEn(M.pulsaFicha[2] + 4);
const despues = estadoEn(M.guardado + 20);

export const FOCOS = {
	menu: enElFotograma(rectDelMenu(null, false)),
	recuadro: f(rectJuntos(estadoEn(200)), 4),
	frase: f(rectFrase(conEditor), 2),
	conjunto: f(rectConjunto(despues), 4),
	filas: f(rectCeldasGrupos(despues, 0, 'nombre', 'cant', 3), 2),
	separar: f(rectSeparar(despues)),
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	referencias: puntoDelMenu(null, false),
	grupos: puntoDelMenu(GRUPOS_EN_EL_MENU, true),
	juntar: centro(rectJuntar(estadoEn(M.llegaJuntar))),
	fichas: JUNTOS.map((g, i) => centro(rectFichaDelEditor(estadoEn(M.llegaFicha[i]), g))),
	guardar: centro(rectGuardarJuntos(estadoEn(M.llegaGuardar))),
	separar: centro(rectSeparar(despues)),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Referencias', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Referencias ▸ Grupos', url: '/grupos' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Ve a Referencias ▸ Grupos.', voz: 'Ve a Referencias, Grupos.', ...EN_EL_MENU, foco: FOCOS.menu, focoHasta: M.pulsaReferencias + 10 },
	{ desde: 115, texto: 'Arriba: grupos que reciben las clases a la vez.', ...AQUI, foco: FOCOS.recuadro },
	{ desde: 241, texto: 'Juntar grupos, y se pulsan los que van juntos.', ...AQUI },
	{ desde: 369, texto: 'La frase dice qué pasará; y Guardar.', ...AQUI, foco: FOCOS.frase, focoHasta: M.llegaGuardar - 2 },
	{ desde: 476, texto: 'El horario los ve como un grupo: 42 alumnos.', voz: 'El horario los ve como un solo grupo: cuarenta y dos alumnos.', ...AQUI, foco: FOCOS.conjunto },
	{ desde: 617, texto: 'Sólo el horario: listas y notas siguen aparte.', ...AQUI, foco: FOCOS.filas },
	{ desde: 741, texto: 'Separar los devuelve a ir por su lado.', ...AQUI, foco: FOCOS.separar },
];

export const AVISO = { desde: M.guardado, dura: fotogramasDe(2500), texto: AVISO_JUNTOS };

export const TARJETA = 836;
export const DURACION = 946;

export const CLAVE = 'grupos-juntos';
export const TITULO = 'Grupos que van siempre juntos';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Referencias, Grupos' },
	{ desde: 241, titulo: 'Juntar grupos' },
	{ desde: 476, titulo: 'Qué cambia: sólo el horario' },
];

export const CIERRE: Cierre = {
	hiciste: 'Juntaste Prejardín, Jardín y Transición para el horario.',
	seVe: 'Las tres pastillas unidas arriba, y «Va junto con» en la rejilla.',
	despues: 'Cada grupo sigue con su lista, sus notas y su boletín.',
	voz: 'Cada grupo sigue con lo suyo.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[4].desde < M.guardado) {
	throw new Error(`Guion: el paso 5 señala el conjunto en ${PASOS[5].desde} y se guarda en ${M.guardado}.`);
}
M.pulsaFicha.forEach((p) => {
	if (p < PASOS[2].desde || p >= PASOS[3].desde) { throw new Error(`Guion: una ficha se pulsa en ${p}, fuera del paso 3.`); }
});
