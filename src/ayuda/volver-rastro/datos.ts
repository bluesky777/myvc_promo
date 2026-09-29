import { MEDIDAS } from '../medidas';
import { MIGAS_ALTO, Rect, posicionesDeMigas } from '../moverse/comun';
import { FILAS } from '../mis-asignaturas/datos';
import { G, Logro, MIGAS_LOGROS } from '../unidades-100/datos';
import { UNIDADES_9B } from '../docente-portada/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN «VOLVER SOBRE TUS PASOS».
 *
 * EL RASTRO DE HOY NO RECUERDA EL CAMINO. Desde el 2026-09-23 cada ruta declara de qué pantalla
 * cuelga (`data.cuelgaDe` en `app.routes.ts`; `cascara/migas/cuelga-de.ts`), y la pila que guardaba
 * «por dónde entraste» se quitó (`cascara/migas/rastro.ts:13-59`): los favoritos, el buscador y un
 * enlace pegado daban rastros de caminos que nadie había hecho. Así que:
 *
 *   - Logros (`unidades/:id`) dice SIEMPRE «Panel › Académico › Mis asignaturas › Logros», aunque se
 *     llegue desde la portada (`app.routes.ts:1150-1158`, `cuelgaDe: listadoDeAsignaturas`);
 *   - las migas con destino son enlaces; la sección («Académico») y la última no (`migas.html`);
 *   - en la portada no hay rastro (`Rastro.enLaPortada`);
 *   - el Atrás del navegador vuelve a la pantalla anterior y el rastro se calcula para ésa: «el
 *     botón atrás sale gratis y correcto» (`rastro.ts:53-54`).
 *
 * El plan decía «el rastro recuerda por dónde entraste; Atrás devuelve el rastro tal cual»: eso era
 * la versión anterior. El vídeo enseña la de hoy.
 *
 * LA CLASE ES 9°B, la que la portada abre en su propio vídeo (`docente-portada`), con sus dos
 * Logros: «Números reales» todavía sin Indicadores y «Álgebra» con los tres de la planilla. Los
 * porcentajes, que la portada no enseña, son inventados y suman 100: aquí no se habla de eso.
 */

export const DE_9B = { ...FILAS.find((f) => f.grupo === '9°B')!, docente: 'Andrés Felipe Rojas Mejía' };

const [REALES, ALGEBRA] = UNIDADES_9B;
export const LOGROS_9B: Logro[] = [
	{ definicion: REALES.definicion, porcentaje: 40, indicadores: [] },
	{
		definicion: ALGEBRA.definicion,
		porcentaje: 60,
		indicadores: ALGEBRA.indicadores.map((d, i) => ({ definicion: d, porcentaje: [30, 30, 40][i] })),
	},
];

/** Una miga, en coordenadas de la cáscara (el rastro de Logros y el de Mis asignaturas empiezan igual). */
export function rectDeMiga(i: number): Rect {
	const p = posicionesDeMigas(MIGAS_LOGROS, G.lados)[i];
	return { x: MEDIDAS.menu + p.x - 6, y: MEDIDAS.barra + G.arriba + 4, ancho: p.ancho + 12, alto: MIGAS_ALTO - 8, radio: 6 };
}

/** La fila del rastro entera. */
export const RECT_RASTRO: Rect = { x: MEDIDAS.menu + G.lados - 10, y: MEDIDAS.barra + G.arriba + 2, ancho: 420, alto: MIGAS_ALTO - 4, radio: 8 };

/**
 * «Mis asignaturas» con la fila de 9°B diciendo los Logros que tiene aquí (dos): la lista compartida
 * le da tres, y en este vídeo se ven los dos en la portada y en Logros.
 */
export const FILAS_MIS = FILAS.map((f) => (f.grupo === '9°B' ? { ...f, logros: LOGROS_9B.length } : f));
