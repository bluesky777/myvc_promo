import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { MEDIDAS, SECCIONES, alturaEnMenu } from '../medidas';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { DISCIPLINA, LEYENDA, UNIFORMES_DE_SARA, altoDeUniformes, contador, detalle, selectorSinGrupo } from '../disciplina/datos';
import type { TiemposDeLlegada } from '../disciplina/Llegada';
import { MOTIVOS, PIEZAS_UNIFORME } from '../disciplina/UniformesModal';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * DOCENTE: «UNIFORME Y LLEGADAS TARDE».
 *
 * LA DUDA QUE MATA, CORREGIDA CONTRA EL CÓDIGO: van en la MISMA rejilla que las situaciones, pero
 * **no con color propio**: los dos primeros contadores de cada celda son grises y se distinguen por
 * el icono (`contador--menor` en `disciplina.scss`); el color es sólo de los tres tipos. Y lo que
 * nadie adivina: **las tardanzas aquí sólo se miran**. El detalle de tardanzas no se puede pulsar;
 * se ponen en Disciplina ▸ Asistencias, en «Tardanzas a la institución».
 *
 * TRES ACTOS: la llegada (la misma de las situaciones), el uniforme (contador → detalle → diálogo →
 * «+ Agregar falla de uniforme» → «Guardar», que no avisa → «Aceptar»), y las tardanzas.
 */

export const FPS = 30;

export const LLEGADA: TiemposDeLlegada = {
	cursorEntra: 14,
	llegaSeccion: 40,
	pulsaSeccion: 46,
	llegaEntrada: 90,
	pulsaEntrada: 100,
	montaPagina: 104,
	llegaGrupo: 205,
	pulsaGrupo: 215,
	seVaLaCascara: 225,
	entraLaRejilla: 255,
};

export const UNIFORME = {
	llegaContador: 415,
	pulsaContador: 425,
	llegaDetalle: 520,
	pulsaDetalle: 530,
	abre: 536,
	llegaAgregar: 635,
	pulsaAgregar: 645,
	llegaMotivo: 675,
	marca: 685,
	llegaGuardar: 740,
	pulsaGuardar: 752,
	llegaAceptar: 790,
	pulsaAceptar: 800,
};

/** El puntero vuelve a la rejilla y se queda sobre el contador de tardanzas. */
export const TARDANZAS = { desde: 860, llega: 890, hasta: 990 };

export const EL_MOTIVO = MOTIVOS.indexOf('Accesorios');

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
const aire = (r: { x: number; y: number; ancho: number; alto: number }, a = 6) => ({ x: r.x - a, y: r.y - a, ancho: r.ancho + a * 2, alto: r.alto + a * 2 });

const Y_SECCION = alturaEnMenu(SECCIONES, DISCIPLINA.seccion, null, null);
const dosGrises = (() => { const a = contador(0, 1, 0); const b = contador(0, 1, 1); return { x: a.x, y: a.y, ancho: b.x + b.ancho - a.x, alto: a.alto }; })();

export const FOCOS = {
	/*
	 * Sólo la sección «Disciplina»: un recuadro del alto de sus hijas, encendido antes de que se
	 * desplieguen, cubría Compromisos…Configuración. Se apaga al desplegarse.
	 */
	disciplina: enElFotograma({ x: 0, y: Y_SECCION, ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	selector: enElFotograma(selectorSinGrupo()),
	grises: aire(dosGrises, 5),
	leyenda: aire({ ...LEYENDA, ancho: 290 }),
	uniforme: aire(contador(0, 1, 0), 5),
	detalle: aire(detalle(0, 1, altoDeUniformes(UNIFORMES_DE_SARA.length)), 4),
	agregar: aire(PIEZAS_UNIFORME.agregar),
	motivos: aire({ ...PIEZAS_UNIFORME.motivo(0), ancho: 134 * 6 + 130 }),
	guardar: aire(PIEZAS_UNIFORME.guardar),
	tardanzas: aire(contador(0, 1, 1), 5),
};

export const PUNTOS = {
	uniforme: centro(contador(0, 1, 0)),
	detalle: { x: detalle(0, 1, 0).x + 120, y: detalle(0, 1, 0).y + 40 },
	agregar: centro(PIEZAS_UNIFORME.agregar),
	motivo: { x: PIEZAS_UNIFORME.motivo(EL_MOTIVO).x + 9, y: centro(PIEZAS_UNIFORME.motivo(EL_MOTIVO)).y },
	guardar: centro(PIEZAS_UNIFORME.guardar),
	aceptar: centro(PIEZAS_UNIFORME.aceptar),
	tardanzas: centro(contador(0, 1, 1)),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Disciplina', url: 'micolegio.micolevirtual.com/up2/' };
const EN_DISCIPLINA = { ubicacion: 'Menú ▸ Disciplina ▸ Disciplina', url: '/disciplina' };
const EN_EL_DIALOGO = { ubicacion: 'Menú ▸ Disciplina ▸ Disciplina ▸ Fallas de uniforme', url: '/disciplina' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Uniforme y tardanzas están en Disciplina.', ...EN_EL_MENU, foco: FOCOS.disciplina, focoHasta: LLEGADA.pulsaSeccion + 22 },
	{ desde: 128, texto: 'Elige el grupo: es la rejilla de las situaciones.', ...EN_DISCIPLINA, foco: FOCOS.selector, focoHasta: LLEGADA.seVaLaCascara - 6 },
	{ desde: 258, texto: 'Los dos grises de cada celda: uniforme y tardanzas.', ...EN_DISCIPLINA, foco: FOCOS.grises },
	{ desde: 400, texto: 'Pulsa el contador de uniforme.', ...EN_DISCIPLINA, foco: FOCOS.uniforme, focoHasta: UNIFORME.pulsaContador + 4 },
	{ desde: 490, texto: 'Pulsa el detalle: se abren las fallas del periodo.', ...EN_DISCIPLINA, foco: FOCOS.detalle, focoHasta: UNIFORME.pulsaDetalle },
	{ desde: 615, texto: 'Agregar falla, y marca el motivo.', ...EN_EL_DIALOGO, foco: FOCOS.motivos, focoHasta: UNIFORME.llegaGuardar - 10 },
	{ desde: 724, texto: 'Guardar la añade, sin aviso; Aceptar cierra.', ...EN_EL_DIALOGO },
	{ desde: TARDANZAS.desde, texto: 'Las tardanzas aquí sólo se miran: se ponen en Asistencias.', ...EN_DISCIPLINA, foco: FOCOS.tardanzas },
];

export const TARJETA = 1010;
export const DURACION = 1130;

export const CLAVE = 'docente-uniforme-tardanzas';
export const TITULO = 'Uniforme y llegadas tarde';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Disciplina, y el grupo' },
	{ desde: LLEGADA.entraLaRejilla, titulo: 'Uniforme y tardanzas en la celda' },
	{ desde: 400, titulo: 'Agregar una falla de uniforme' },
	{ desde: TARDANZAS.desde, titulo: 'Las tardanzas: dónde se ponen' },
];

export const CIERRE: Cierre = {
	hiciste: 'Agregaste una falla de uniforme desde el detalle de la celda.',
	seVe: 'La falla sale en la lista del diálogo, y el contador de uniforme sube.',
	despues: 'Las tardanzas: Disciplina, Asistencias, «Tardanzas a la institución».',
	voz: 'La falla queda en la lista.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);
