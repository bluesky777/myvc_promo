import { VOCABULARIO } from '../../comunes/vocabulario';
import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { FOCOS_LLEGADA, TiemposDeLlegada } from '../planilla-nota-rapida/Llegada';
import { LA_QUE_SE_ABRE, UNIDADES, rectanguloDelBoton } from '../planilla/datos';
import { PG, UN, UTIL, Y, alFotograma, botonDeUnidades, rectEtiquetaNotas, rectMandos, rectTarjeta } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «COPIAR UNIDADES A OTRA ASIGNATURA».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Si el destino es de otro grupo, las notas no se copian.** Las notas son de alumnos
 *     concretos (`mismoGrupo` en `copiar-unidades.ts`), y la pantalla no apaga un interruptor sin
 *     explicar: lo quita y pone la etiqueta «Las notas no se copian: el destino es de otro grupo».
 *     El resumen del final lo confirma: «· 0 notas».
 *
 * Y la de la palabra: la pantalla dice «Logros» porque así las llama este colegio (PLAN §2.12).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA   Académico -> Mis asignaturas -> «Unidades» de 9°B -> «Copiar a otra asignatura»
 *     2. EL DESTINO   docente, año, periodo 3 y Matemáticas de 9°A; sale la etiqueta de las notas
 *     3. COPIAR       «Copiar lo marcado (1)»: «Copiado con éxito» y el resumen con «0 notas»
 */

export const FPS = 30;

export const LLEGADA: TiemposDeLlegada & { montaUnidades: number; llegaCopiar: number; pulsaCopiar: number } = {
	cursorEntra: 4,
	llegaAcademico: 30,
	pulsaAcademico: 36,
	abreAcademico: 38,
	llegaMisAsignaturas: 96,
	pulsaMisAsignaturas: 104,
	montaLista: 108,
	llegaBoton: 160,
	pulsaBoton: 232,
	montaUnidades: 250,
	llegaCopiar: 305,
	pulsaCopiar: 330,
	cursorSale: 340,
	seVaLaCascara: 334,
	entraLaPlanilla: 370,
};

export const ENTRA = LLEGADA.entraLaPlanilla;
const L = (f: number) => ENTRA + f;

export const BOTON_UNIDADES = rectanguloDelBoton(LA_QUE_SE_ABRE, UNIDADES);

/* ── El destino, en fotogramas LOCALES del panel ──────────────────────────────────────────── */

export const PANEL = {
	cursorEntra: 40,
	pulsaCampo: [160, 195, 230, 265],
	llegaCopiar: 650,
	pulsaCopiar: 667,
	cursorSale: 750,
};
export const BAJA = 12;
export const ELIGE = 22;
export const COPIADO = PANEL.pulsaCopiar + 15;
export const AVISO = { desde: L(COPIADO), dura: 90 };

/* ── Los focos ────────────────────────────────────────────────────────────────────────────── */

const holgado = (r: { x: number; y: number; ancho: number; alto: number }, h = 5) => ({ x: r.x - h, y: r.y - h, ancho: r.ancho + h * 2, alto: r.alto + h * 2 });

export const FOCOS = {
	...FOCOS_LLEGADA,
	unidades: enElFotograma(BOTON_UNIDADES),
	logro: enElFotograma(holgado({ x: MEDIDAS.menu + UN.lados, y: MEDIDAS.barra + UN.arriba + UN.tarjeta.y, ancho: MEDIDAS.ancho - MEDIDAS.menu - UN.lados * 2, alto: 150 }, 4)),
	copiar: enElFotograma(holgado(botonDeUnidades(2), 4)),
	origen: alFotograma(holgado(rectTarjeta(0), 4)),
	/* Con 60 más por abajo: la lista de asignaturas abierta sobresale de la tarjeta. */
	destino: alFotograma(holgado({ ...rectTarjeta(1), alto: rectTarjeta(1).alto + 60 }, 4)),
	etiqueta: alFotograma(holgado(rectEtiquetaNotas(), 5)),
	resultado: alFotograma(holgado({ x: PG.relleno, y: Y.mandos + PG.mandos + 8, ancho: UTIL, alto: PG.resultado }, 4)),
	mandos: alFotograma(holgado(rectMandos(), 4)),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_LISTA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };
const EN_UNIDADES = { ubicacion: `Menú ▸ Académico ▸ Mis asignaturas ▸ ${VOCABULARIO.unidades}`, url: '/unidades/1222' };
const EN_COPIAR = { ubicacion: `Menú ▸ Académico ▸ Mis asignaturas ▸ ${VOCABULARIO.unidades} ▸ Copiar`, url: '/copiar-unidades' };

export const PASOS: Paso[] = [
	{ desde: 8, texto: 'Abre Académico y entra en Mis asignaturas.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.pulsaAcademico + 20 },
	{ desde: 130, texto: `En la fila de 9°B, pulsa ${VOCABULARIO.unidades}.`, voz: `En la fila de noveno B, pulsa ${VOCABULARIO.unidades}.`, ...EN_LA_LISTA, foco: FOCOS.unidades, focoHasta: LLEGADA.pulsaBoton + 8 },
	{ desde: 262, texto: 'Arriba, «Copiar a otra asignatura».', voz: 'Arriba, Copiar a otra asignatura.', ...EN_UNIDADES, foco: FOCOS.copiar, focoHasta: LLEGADA.seVaLaCascara - 4 },
	{ desde: L(8), texto: 'El origen ya viene elegido, con su logro marcado.', ...EN_COPIAR, foco: FOCOS.origen },
	{ desde: L(133), texto: 'El destino se elige: aquí, el periodo 3 de 9°A.', voz: 'El destino se elige: aquí, el periodo tres de noveno A.', ...EN_COPIAR, foco: FOCOS.destino },
	/* La advertencia de ADVERTENCIAS-AYUDA.md: copiar encima de otras las AÑADE. */
	{ desde: L(281), texto: 'Copia sólo a asignaturas vacías: si no, se añaden y pasan de 100.', voz: 'Copia sólo a asignaturas vacías: si no, se añaden y pasan de cien.', ...EN_COPIAR, foco: FOCOS.destino },
	{ desde: L(450), texto: 'De otro grupo, las notas no se copian: lo dice la etiqueta.', ...EN_COPIAR, foco: FOCOS.etiqueta },
	{ desde: L(602), texto: 'Pulsa «Copiar lo marcado».', voz: 'Pulsa Copiar lo marcado.', ...EN_COPIAR },
	{ desde: L(COPIADO), texto: 'Sale el resumen: 1 logro, 3 indicadores, 0 notas.', voz: 'Sale el resumen de lo copiado.', ...EN_COPIAR, foco: FOCOS.resultado },
	{ desde: L(777), texto: 'En el mismo grupo saldría «Copiar con las notas».', voz: 'En el mismo grupo saldría: Copiar con las notas.', ...EN_COPIAR, foco: FOCOS.mandos },
];

export const TARJETA = L(909);
export const DURACION = TARJETA + 110;

export const CLAVE = 'copiar-unidades';

export const TITULO = 'Copiar unidades a otra asignatura';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: `Dónde está: ${VOCABULARIO.unidades}, Copiar` },
	{ desde: L(8), titulo: 'Origen y destino' },
	{ desde: L(450), titulo: 'Otro grupo: las notas no se copian' },
	{ desde: L(602), titulo: 'Copiar lo marcado' },
];

export const CIERRE: Cierre = {
	hiciste: 'Copiaste el logro de 9°B, periodo 2, al periodo 3 de 9°A.',
	seVe: 'Sale «Copiado con éxito», y el resumen: 1 logro, 3 indicadores, 0 notas.',
	despues: 'Revisa que sumen 100 %: «Unidades e indicadores: el 100 %».',
	voz: 'Revisa que sumen cien por ciento.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[8].desde !== AVISO.desde) { throw new Error('Guion: el resumen no sale donde empieza el paso que lo cuenta.'); }
if (L(PANEL.pulsaCampo[3] + ELIGE) > PASOS[6].desde) { throw new Error('Guion: la etiqueta sale después de que el rótulo la cuente.'); }
