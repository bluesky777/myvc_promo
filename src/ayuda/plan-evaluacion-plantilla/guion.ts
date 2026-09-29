import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, alFotograma, centro, focoDelMenu, puntoDelMenu } from '../el-ano/Aplicacion';
import { PL, rectPestanaPlan } from '../el-ano/plan';
import { finDelTecleo } from '../montar-el-ano/tiempo';
import {
	NUEVO, disposicion, pestanas, rectAplicar, rectBotonAplicarDialogo, rectBotonCriterio, rectCampoCriterio, rectCasilla,
	rectConteo, rectDialogoPregunta, rectLimites, rectParrafo, rectPorcentajeCriterio,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * MONTAR EL AÑO: «PLAN DE EVALUACIÓN: LA PLANTILLA». Con cartel rojo.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     «Aplicar la plantilla» multiplica por todo el colegio.
 *
 * Lo dice la propia pantalla («La plantilla **multiplica**…», `plantilla.html`) y lo cuenta el
 * diálogo de aplicar (`sembrar-plantilla.html`): se escribe en las asignaturas del año que todavía
 * no tienen nada, y con la casilla marcada también en las que ya tienen columnas, **aunque tengan
 * notas**: «Eso mueve la definitiva». Sin rojo: ADVERTENCIAS-AYUDA.md no lo da por irreversible;
 * la advertencia es aplicarla antes de la primera nota.
 *
 * LO QUE EL CATÁLOGO DECÍA Y EL CÓDIGO NO: «hay que hacerlo antes de la primera nota». Desde
 * `fbcdda1` el aplicar entra también donde hay notas si se marca la casilla; lo que el vídeo dice
 * es eso, no una fecha. No hay deshacer en la pantalla (`sembrar-plantilla.ts:67`).
 *
 * Precondición, en su cartel: la entrada sólo la ve quien tiene el permiso de editar la plantilla
 * (`puedeEditarPlantillaNotas`, que es permiso y no cargo: `menu.ts:518`).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CINCO ACTOS
 *
 *     1. LA LLEGADA   Referencias -> Plan de evaluación -> pestaña ② Plantilla de notas
 *     2. EL MOLDE     criterios y columnas; suma 75 %: aviso amarillo y botón apagado
 *     3. CUADRAR      se añade «Actitudinal 25 %»: ✓, se va el aviso, se enciende el botón
 *     4. APLICAR      el diálogo: multiplica; la casilla mueve definitivas; lo que nunca toca
 *     5. EL RESUMEN   asignaturas × periodos
 */

export const FPS = 30;

const TECLEO = { texto: NUEVO.definicion, porcentaje: String(NUEVO.porcentaje) };

export const T = {
	cursorEntra: 20,
	llegaReferencias: 50,
	pulsaReferencias: 56,
	abreReferencias: 58,
	llegaEntrada: 100,
	pulsaEntrada: 110,
	monta: 114,
	llegaPestana: 200,
	pulsaPestana: 212,
	montaPlantilla: 216,

	llegaCampo: 586,
	pulsaCampo: 596,
	tecleaTexto: 604,
	llegaPorcentaje: 666,
	pulsaPorcentaje: 674,
	tecleaPorcentaje: 680,
	llegaAnadir: 704,
	pulsaAnadir: 714,
	/** El POST vuelve: la fila entra, el aviso se pliega, la marca pasa a ✓. */
	anadido: 726,

	llegaAplicar: 883,
	pulsaAplicar: 895,
	dialogo: 899,

	llegaAplicarDialogo: 1452,
	pulsaAplicarDialogo: 1472,
	/** `PUT plantilla-notas/sembrar`: un segundo con el botón cargando. */
	aplicada: 1502,
	cursorSale: 1605,
};

export const TEXTO_NUEVO = TECLEO;
export const FIN_TEXTO = finDelTecleo(TECLEO.texto, T.tecleaTexto);
export const FIN_PORCENTAJE = finDelTecleo(TECLEO.porcentaje, T.tecleaPorcentaje);

const ANTES = { aviso: 1, tercera: 0 };
const DESPUES = { aviso: 0, tercera: 1 };

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	referencias: puntoDelMenu('Referencias'),
	plan: puntoDelMenu('Referencias', 'Plan de evaluación'),
	pestana: centro(rectPestanaPlan(pestanas(75), 'plantilla')),
	campo: centro(rectCampoCriterio(ANTES)),
	porcentaje: centro(rectPorcentajeCriterio(ANTES)),
	anadir: centro(rectBotonCriterio(ANTES)),
	aplicar: centro(rectAplicar(DESPUES)),
	aplicarDialogo: centro(rectBotonAplicarDialogo()),
};

const d0 = disposicion(ANTES);
const d1 = disposicion(DESPUES);

export const FOCOS = {
	referencias: focoDelMenu('Referencias'),
	pestana: alFotograma(rectPestanaPlan(pestanas(75), 'plantilla'), 6, 8),
	intro: alFotograma(d0.intro, 8, 8),
	lista: alFotograma({ ...d0.criterios[0], alto: d0.criterios[1].y + d0.criterios[1].alto - d0.criterios[0].y }, 8, 10),
	suma: alFotograma({ ...d0.reparto, alto: d0.aviso.y + d0.aviso.alto - d0.reparto.y }, 6, 10),
	apagado: alFotograma(d0.aplicar, 6, 8),
	anadir: alFotograma(d0.anadir, 6, 8),
	cuadra: alFotograma({ ...d1.reparto, y: PL.pestanas, alto: d1.criterios[2].y + d1.criterios[2].alto - PL.pestanas }, 6, 10),
	aplicar: alFotograma(rectAplicar(DESPUES), 8, 8),
	parrafo: alFotograma(rectParrafo(), 8, 8),
	casilla: alFotograma(rectCasilla(), 8, 8),
	limites: alFotograma(rectLimites(), 8, 8),
	dialogo: alFotograma(rectDialogoPregunta(), 4, 10),
	conteo: alFotograma(rectConteo(), 8, 8),
	/** La pestaña ②, que ya dice ✓. */
	marca: alFotograma(rectPestanaPlan(pestanas(100), 'plantilla'), 6, 8),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Referencias', url: 'micolegio.micolevirtual.com/up2/' };
const EN_MODELO = { ubicacion: 'Menú ▸ Referencias ▸ Plan de evaluación ▸ Modelo', url: '/plan-evaluacion' };
const AQUI = { ubicacion: 'Menú ▸ Referencias ▸ Plan de evaluación ▸ Plantilla de notas', url: '/plan-evaluacion?paso=plantilla' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Referencias, Plan de evaluación, Plantilla de notas.', ...EN_EL_MENU, foco: FOCOS.referencias, focoHasta: T.pulsaReferencias + 20 },
	{ desde: 160, texto: 'Sólo la ve quien puede editar la plantilla.', ...EN_MODELO, foco: FOCOS.pestana },
	{ desde: 260, texto: 'El molde del año: criterios, porcentajes y columnas.', ...AQUI, foco: FOCOS.lista },
	{ desde: 412, texto: 'Suma 75 %: aviso amarillo y aplicar apagado.', voz: 'Suma setenta y cinco por ciento: aviso amarillo y aplicar apagado.', ...AQUI, foco: FOCOS.suma },
	{ desde: 570, texto: 'Falta Actitudinal, 25 %: se añade.', voz: 'Falta Actitudinal, veinticinco por ciento: se añade.', ...AQUI, foco: FOCOS.anadir, focoHasta: T.pulsaAnadir + 6 },
	{ desde: 730, texto: 'Suma 100: se va el aviso y la pestaña marca ✓.', voz: 'Suma cien: se va el aviso y la pestaña queda marcada.', ...AQUI, foco: FOCOS.cuadra },
	{ desde: 865, texto: 'Aplicar pregunta antes de escribir nada.', ...AQUI, foco: FOCOS.aplicar, focoHasta: T.pulsaAplicar + 4 },
	{ desde: 969, texto: 'Escribe en todas las asignaturas que aún no tienen nada.', ...AQUI, foco: FOCOS.parrafo },
	{ desde: 1089, texto: 'Con esta casilla, también en las que ya tienen notas.', ...AQUI, foco: FOCOS.casilla },
	{ desde: 1217, texto: 'Eso cambia sus definitivas: aplícala antes de la primera nota.', ...AQUI, foco: FOCOS.casilla },
	{ desde: 1370, texto: 'Nunca toca periodos cerrados ni lo que añadió el docente.', ...AQUI, foco: FOCOS.limites, focoHasta: T.llegaAplicarDialogo - 4 },
	{ desde: T.aplicada, texto: 'El resumen: 540 recibieron la plantilla.', voz: 'El resumen: quinientas cuarenta recibieron la plantilla.', ...AQUI, foco: FOCOS.conteo },
];

export const TARJETA = 1638;
export const DURACION = TARJETA + 120;

export const CLAVE = 'plan-evaluacion-plantilla';
export const TITULO = 'Plan de evaluación: la plantilla';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Plan de evaluación, Plantilla de notas' },
	{ desde: 260, titulo: 'Criterios, columnas y la suma' },
	{ desde: 570, titulo: 'Cuadrar a 100' },
	{ desde: 865, titulo: 'Aplicar la plantilla: lo que toca' },
	{ desde: T.aplicada, titulo: 'El resumen' },
];

export const CIERRE: Cierre = {
	hiciste: 'Cuadraste la plantilla de 2026 a 100 % y la aplicaste a las asignaturas.',
	seVe: 'La marca «✓» en la pestaña ② y el resumen «Plantilla aplicada» con sus cifras.',
	despues: 'Siguiente: fotos y firmas.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (FIN_PORCENTAJE >= T.llegaAnadir) {
	throw new Error('Guion: el porcentaje no termina de teclearse antes de ir a «Añadir criterio».');
}
if (T.anadido >= PASOS[5].desde || T.pulsaAnadir < PASOS[4].desde) {
	throw new Error('Guion: la fila nueva no entra dentro del paso que la añade.');
}
if (T.pulsaAplicarDialogo < PASOS[10].desde + 100) {
	throw new Error('Guion: se pulsa Aplicar antes de leer lo que nunca se toca.');
}
