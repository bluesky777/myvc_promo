import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { MEDIDAS } from '../medidas';
import { ENTRADA_DEL_PUNTERO, alFotograma, focoDelMenu, puntoDelMenu } from '../el-ano/Aplicacion';
import { rectPestanaPlan } from '../el-ano/plan';
import { ANCHO_CONTENIDO, PG, rectDelMando } from '../cierre-2/datos';
import { ASIGNATURAS_AL_LLEGAR } from '../grupos-crear/datos';
import { rectCuadre } from '../montar-el-ano/planoAsignaturas';
import { HASTA_LA_IH, rectColumnasGrupos, type EstadoGrupos } from '../montar-el-ano/planoGrupos';
import { GRUPOS } from '../montar-el-ano/reparto';
import { pagMaterias } from '../areas-materias/datos';
import { PONDERADO, pestanas } from '../plan-evaluacion-modelo/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «EL ORDEN DE MONTAR UN AÑO» — el mapa, el que se ve primero.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     Qué depende de qué: grupos antes que asignaturas, plantilla antes que la primera nota.
 *
 * El vídeo recorre las pantallas en el orden en que se montan, y cada parada nombra el vídeo que
 * la explica. Lo que sostiene cada «antes» está en el código, no en el gusto:
 *
 *   - el grado pide nivel y el grupo pide grado (`grados.ts:178`, `grupos.ts:357`);
 *   - la materia pide área (`materias.ts:181`); la asignatura, grupo, materia y docente;
 *   - la plantilla se copia a cada asignatura «cuando el docente la abre por primera vez»
 *     (`plan-evaluacion/quien-edita.html`): por eso va antes de la primera nota;
 *   - y lo último es el periodo en «Calificando», que es lo que abre notas y asistencia
 *     (`colegio-periodos.html`, la pista del tramo).
 *
 * Las pantallas son las que ya están dibujadas en los otros vídeos (cierre-2, montar-el-ano,
 * áreas-materias, plan-evaluacion-modelo): aquí no se dibuja ninguna nueva.
 *
 * LA DURACIÓN: 58 s, dentro del tope. Seis paradas con su vídeo cada una.
 */

export const FPS = 30;

export const T = {
	cursorEntra: 12,
	llegaConfig: 40,
	pulsaConfig: 48,
	abreConfig: 50,
	llegaColegio: 72,
	pulsaColegio: 80,
	montaColegio: 84,

	llegaRef: 370,
	pulsaRef: 378,
	llegaGrupos: 412,
	pulsaGrupos: 420,
	montaGrupos: 434,

	llegaMaterias: 700,
	pulsaMaterias: 708,
	montaMaterias: 722,

	llegaAsignaturas: 836,
	pulsaAsignaturas: 844,
	montaAsignaturas: 858,

	llegaPlan: 1096,
	pulsaPlan: 1104,
	montaPlan: 1118,

	/*
	 * Antes de volver a Configuración se pliega Referencias: abierta, sus nueve hijas empujan
	 * Configuración al pie del menú, debajo del rótulo.
	 */
	llegaRefCierra: 1330,
	pulsaRefCierra: 1338,
	llegaConfig2: 1384,
	pulsaConfig2: 1392,
	llegaColegio2: 1420,
	pulsaColegio2: 1428,
	montaColegio2: 1442,
	cursorSale: 1520,
};

/** Cuánto tarda en plegarse una sección y desplegarse la otra. */
export const PLIEGA = 12;

export const ESTADO_GRUPOS: EstadoGrupos = {
	ficha: null,
	juntos: { forma: 'vacio' },
	filas: GRUPOS.map((g) => ({ nombre: g.nombre, juntos: '' })),
	desplazada: 0,
	desplazadaRejilla: HASTA_LA_IH,
};
export { ASIGNATURAS_AL_LLEGAR };

const contenido = (r: { x: number; y: number; ancho: number; alto: number }) => ({ ...r, x: r.x + MEDIDAS.menu, y: r.y + MEDIDAS.barra });
const f = (r: { x: number; y: number; ancho: number; alto: number }, margen = 6, radio = 10) => alFotograma(r, margen, radio);

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	config: puntoDelMenu('Configuración'),
	colegio: puntoDelMenu('Configuración', 'El colegio'),
	referencias: puntoDelMenu('Referencias'),
	grupos: puntoDelMenu('Referencias', 'Grupos'),
	materias: puntoDelMenu('Referencias', 'Materias'),
	asignaturas: puntoDelMenu('Referencias', 'Asignaturas'),
	plan: puntoDelMenu('Referencias', 'Plan de evaluación'),
};

export const FOCOS = {
	config: focoDelMenu('Configuración'),
	pestanas: f(contenido({ x: PG.lados, y: PG.pestanas, ancho: ANCHO_CONTENIDO - PG.lados * 2, alto: PG.pestanasAlto }), 4, 8),
	grupos: f(rectColumnasGrupos(ESTADO_GRUPOS, 'grado', 'ih'), 2, 8),
	ordenar: f(pagMaterias().encima, 4, 10),
	cuadre: f(rectCuadre(ASIGNATURAS_AL_LLEGAR), 4, 10),
	plantilla: f(rectPestanaPlan(pestanas(PONDERADO), 'plantilla'), 6, 8),
	tramo: f(contenido(rectDelMando(1)), 6, 8),
};

const EN_EL_MENU = { ubicacion: 'Menú', url: 'micolegio.micolevirtual.com/up2/' };
const EN_PERIODOS = { ubicacion: 'Menú ▸ Configuración ▸ El colegio ▸ Periodos', url: '/colegio/14/periodos' };
const EN_GRUPOS = { ubicacion: 'Menú ▸ Referencias ▸ Grupos', url: '/grupos' };
const EN_MATERIAS = { ubicacion: 'Menú ▸ Referencias ▸ Materias', url: '/materias' };
const EN_ASIGNATURAS = { ubicacion: 'Menú ▸ Referencias ▸ Asignaturas', url: '/asignaturas' };
const EN_PLAN = { ubicacion: 'Menú ▸ Referencias ▸ Plan de evaluación', url: '/plan-evaluacion' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Montar el año va en orden: cada paso pide el anterior.', ...EN_EL_MENU, foco: FOCOS.config, focoHasta: T.pulsaConfig + 16 },
	{ desde: 145, texto: '1. El colegio: el año en curso, sus periodos y la ficha.', voz: 'Primero, el colegio: año, periodos y ficha.', ...EN_PERIODOS, foco: FOCOS.pestanas },
	{ desde: 286, texto: 'Vídeos: «Los ajustes del año» y «La ficha del colegio y el membrete».', voz: 'Vídeos: los ajustes del año y la ficha.', ...EN_PERIODOS, foco: FOCOS.pestanas, focoHasta: T.pulsaRef - 4 },
	{ desde: 438, texto: '2. Niveles, grados y grupos, con la IH de cada grupo.', voz: 'Segundo: niveles, grados y grupos.', ...EN_GRUPOS, foco: FOCOS.grupos },
	{ desde: 573, texto: 'Vídeos: «Niveles, grados y grupos» y «Crear los grupos del año».', voz: 'Vídeos: niveles y grados, y crear los grupos.', ...EN_GRUPOS, foco: FOCOS.grupos, focoHasta: T.pulsaMaterias - 4 },
	{ desde: 726, texto: '3. Áreas y materias. Vídeo: «Áreas, materias y directores».', voz: 'Tercero: áreas, materias y directores.', ...EN_MATERIAS, foco: FOCOS.ordenar, focoHasta: T.pulsaAsignaturas - 4 },
	{ desde: 862, texto: '4. Asignaturas: materia, grupo y docente. Van después de los grupos.', voz: 'Cuarto: asignaturas, con grupo y docente.', ...EN_ASIGNATURAS, foco: FOCOS.cuadre },
	{ desde: 999, texto: 'Vídeos: «Crear una asignatura» y «Copiar las asignaturas de un grupo a otro».', voz: 'Vídeos: crear y copiar asignaturas.', ...EN_ASIGNATURAS, foco: FOCOS.cuadre, focoHasta: T.pulsaPlan - 4 },
	{ desde: 1122, texto: '5. Plan de evaluación: aplica la plantilla antes de la primera nota.', voz: 'Quinto, el plan: aplica la plantilla antes de la primera nota.', ...EN_PLAN, foco: FOCOS.plantilla },
	{ desde: 1278, texto: 'Vídeos: «Plan de evaluación: el modelo» y «Plan de evaluación: la plantilla».', voz: 'Vídeos: el modelo y la plantilla.', ...EN_PLAN, foco: FOCOS.plantilla, focoHasta: T.pulsaConfig2 - 4 },
	{ desde: 1446, texto: '6. Al final, el periodo en «Calificando»: ya se pone nota.', voz: 'Al final, el periodo en Calificando.', ...EN_PERIODOS, foco: FOCOS.tramo },
	{ desde: 1551, texto: 'Vídeo: «Cerrar el periodo: el semáforo».', voz: 'Vídeo: cerrar el periodo.', ...EN_PERIODOS, foco: FOCOS.tramo },
];

export const TARJETA = 1650;
export const DURACION = TARJETA + 100;

export const CLAVE = 'montar-el-ano-mapa';
export const TITULO = 'El orden de montar un año';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: '1. El colegio: año, periodos y ficha' },
	{ desde: 438, titulo: '2. Niveles, grados y grupos' },
	{ desde: 726, titulo: '3. Áreas y materias' },
	{ desde: 862, titulo: '4. Asignaturas' },
	{ desde: 1122, titulo: '5. Plan de evaluación' },
	{ desde: 1446, titulo: '6. Abrir el periodo' },
];

export const CIERRE: Cierre = {
	hiciste: 'Viste el orden: colegio, grupos, materias, asignaturas, plan y periodo.',
	seVe: 'Cada paso tiene su vídeo, con el nombre que salió abajo.',
	despues: 'Empiece por: los ajustes del año.',
	voz: 'Empiece por los ajustes del año.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* Cada pantalla se monta antes de que su paso la señale. */
([[T.montaColegio, 1], [T.montaGrupos, 3], [T.montaMaterias, 5], [T.montaAsignaturas, 6], [T.montaPlan, 8], [T.montaColegio2, 10]] as const).forEach(([monta, i]) => {
	if (monta + 4 > PASOS[i].desde) { throw new Error(`Guion: la pantalla del paso ${i + 1} se monta después de que el paso la señale.`); }
});
