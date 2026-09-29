import type { Rect } from '../el-ano/Aplicacion';
import { ANCHO_PANEL, CG, NOMBRE_COLEGIO, arribaDelCuerpo } from '../el-ano/colegio';
import { ALMENDROS, COLEGIO, type Persona } from '../colegio';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «EL COLEGIO ▸ FICHA DEL COLEGIO» (`/colegio/:yearId/ficha`): LO QUE SE VE Y DÓNDE CAE.
 *
 * LO QUE ES DE LA APLICACIÓN (`colegio-ficha.html` y `.ts`): el panel de arriba («Esta ficha no se
 * guarda sola…»), los cinco paneles con sus títulos, subtítulos y etiquetas, «sin guardar» junto a
 * la etiqueta tocada, la barra de abajo («1 campo sin guardar», «Descartar», «Guardar los
 * cambios»), el aviso «Guardado: …», y el diálogo de la guarda de salida
 * (`comunes/salir-con-cambios.ts`). En la ficha NO hay escudo, ni membrete, ni firmas: eso está en
 * Certificados e Imágenes.
 *
 * LO INVENTADO: todos los valores. El colegio es el de `competencias/datos.ts`; el rector y el
 * secretario, dos de los docentes inventados de `montar-el-ano/reparto.ts`; los números son de
 * relleno.
 */

export const YEAR_ID = 14;

export const TEXTOS = {
	intro: ['Esta ficha ', { b: 'no se guarda sola' }, ': se escribe y se pulsa «Guardar los cambios». Lo que no toques se guarda como está.'],
	identificacion: 'Identificación',
	identificacionSub: 'Sale en la cabecera de los boletines y de los certificados.',
	contacto: 'Contacto',
	cargos: 'Cargos del año',
	cargosSub: 'Son los que firman los boletines y los certificados de este año.',
	mensaje: 'Mensaje para los alumnos bloqueados',
	mensajeSub: 'Es lo que ve un alumno cuando no puede ver sus notas. Se escribe en su pantalla tal cual.',
	vocabulario: 'Cómo llama este colegio a sus cosas',
	vocabularioSub:
		'Estas cuatro palabras son como este colegio llama a sus cosas. Salen en las pantallas del docente —en la web y en la app del móvil— y en los informes de planeación y de notas perdidas. No salen en el boletín de la familia, que imprime lo que el docente escribió en cada unidad.',
	muestra: 'Así quedan las pantallas con lo que hay escrito arriba.',
	muestraSub: 'Ponte en un campo de arriba, o tócalo, para ver dónde sale su palabra.',
	barra: (n: number) => `${n} ${n === 1 ? 'campo sin guardar' : 'campos sin guardar'}`,
	guardar: 'Guardar los cambios',
	guardado: `Guardado: ${NOMBRE_COLEGIO}`,
	salirTitulo: 'Tienes cambios sin guardar',
	salirTexto: 'Si sales ahora se pierden. ¿Salir de todas formas?',
	salirSi: 'Salir sin guardar',
	salirNo: 'Seguir aquí',
};

export type Trozo = string | { b: string };

export interface Campo { etiqueta: string; valor: string; extra?: string }

export const IDENTIFICACION: Campo[] = [
	{ etiqueta: 'Nombre del colegio', valor: NOMBRE_COLEGIO },
	{ etiqueta: 'Abreviatura', valor: COLEGIO.abreviatura },
	{ etiqueta: 'Resolución', valor: 'Resolución 0000 de 2019' },
	{ etiqueta: 'Código DANE', valor: '000000000000' },
];

export const CONTACTO: Campo[] = [
	{ etiqueta: 'Teléfono', valor: '606 000 0000' },
	{ etiqueta: 'Celular', valor: '300 000 0000' },
	{ etiqueta: 'Sitio web', valor: ALMENDROS.sitioWeb },
];

/** El teléfono que se teclea: un número de relleno, como los demás. */
export const TELEFONO_NUEVO = '606 000 1234';

/* El rector y la secretaria son los del colegio de todos los vídeos (`colegio/`), los que firman. */
export const CARGOS: { etiqueta: string; persona: Persona | null }[] = [
	{ etiqueta: 'Rector', persona: ALMENDROS.rector },
	{ etiqueta: 'Secretario', persona: ALMENDROS.secretaria },
	{ etiqueta: 'Tesorero', persona: null },
];

export const MENSAJE = 'Tus notas se publican cuando el colegio cierre el periodo.';

export const VOCABULARIO: Campo[] = [
	{ etiqueta: 'Una «unidad»', valor: 'Logro', extra: 'Por ejemplo: Desempeño, Logro.' },
	{ etiqueta: 'Varias «unidades»', valor: 'Logros' },
	{ etiqueta: 'Una «subunidad»', valor: 'Indicador', extra: 'Por ejemplo: Instrumento de Evaluación.' },
	{ etiqueta: 'Varias «subunidades»', valor: 'Indicadores' },
];

/* ── La geometría, en coordenadas del contenido (antes del scroll) ─────────────────────────── */

export const F = { etiqueta: 24, control: 32, extra: 20, entre: 12, cabecera: 34, sub: 20 };
export const ANCHO_MEDIO = (ANCHO_PANEL - CG.hueco) / 2;
const Y0 = arribaDelCuerpo(0);

const campo = (conExtra: boolean) => F.etiqueta + F.control + (conExtra ? F.extra : 0);

export const INTRO: Rect = { x: CG.lado, y: Y0, ancho: ANCHO_PANEL, alto: 60 };

const FILA1 = INTRO.y + INTRO.alto + CG.hueco;
const ALTO_IDENT = CG.relleno * 2 + F.cabecera + F.sub + 8 + 4 * campo(false) + 3 * F.entre;
export const P_IDENT: Rect = { x: CG.lado, y: FILA1, ancho: ANCHO_MEDIO, alto: ALTO_IDENT };
export const P_CONTACTO: Rect = { x: CG.lado + ANCHO_MEDIO + CG.hueco, y: FILA1, ancho: ANCHO_MEDIO, alto: ALTO_IDENT };

const FILA2 = FILA1 + ALTO_IDENT + CG.hueco;
const ALTO_CARGOS = CG.relleno * 2 + F.cabecera + F.sub + 8 + 3 * campo(true) + 2 * F.entre;
export const P_CARGOS: Rect = { x: CG.lado, y: FILA2, ancho: ANCHO_MEDIO, alto: ALTO_CARGOS };
export const P_MENSAJE: Rect = { x: CG.lado + ANCHO_MEDIO + CG.hueco, y: FILA2, ancho: ANCHO_MEDIO, alto: ALTO_CARGOS };

const FILA3 = FILA2 + ALTO_CARGOS + CG.hueco;
export const P_VOCABULARIO: Rect = { x: CG.lado, y: FILA3, ancho: ANCHO_PANEL, alto: 410 };

/** El rectángulo de un campo (etiqueta + control) dentro de un panel, contando si hay subtítulo. */
export function rectCampo(panel: Rect, i: number, conSub: boolean, conExtra = false): Rect {
	const y = panel.y + CG.relleno + F.cabecera + (conSub ? F.sub + 8 : 0) + i * (campo(conExtra) + F.entre);
	return { x: panel.x + CG.relleno, y, ancho: panel.ancho - CG.relleno * 2, alto: campo(conExtra) };
}

export function rectControl(panel: Rect, i: number, conSub: boolean, conExtra = false): Rect {
	const c = rectCampo(panel, i, conSub, conExtra);
	return { x: c.x, y: c.y + F.etiqueta, ancho: c.ancho, alto: F.control };
}

/** Los campos del vocabulario van de dos en dos. */
export function rectCampoVocabulario(i: number): Rect {
	const p = P_VOCABULARIO;
	const ancho = (p.ancho - CG.relleno * 2 - CG.hueco) / 2;
	const col = i % 2;
	const fila = Math.floor(i / 2);
	const y = p.y + CG.relleno + F.cabecera + 64 + fila * (campo(true) + F.entre);
	return { x: p.x + CG.relleno + col * (ancho + CG.hueco), y, ancho, alto: campo(true) };
}

export const SCROLL = { arriba: 0, cargos: FILA2 - 150, vocabulario: FILA3 - 60 };
