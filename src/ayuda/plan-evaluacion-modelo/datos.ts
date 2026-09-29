import type { Rect } from '../el-ano/Aplicacion';
import { PL, type PestanaPlan } from '../el-ano/plan';
import { MAIN } from '../montar-el-ano/planoAsignaturas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «PLAN DE EVALUACIÓN ▸ ① MODELO»: LO QUE SE VE Y DÓNDE CAE.
 *
 * Todo lo escrito es de `plan-evaluacion/modelo.html` y `modelo.ts`, palabra por palabra: las dos
 * tarjetas con su ejemplo («Cognitivo 70 %», «Examen 1», «Taller 2»…), los dos párrafos de abajo y
 * el aviso «Modelo del año: «Por competencias».». Lo inventado es sólo el año y su id.
 *
 * EN COORDENADAS DE LA CÁSCARA.
 */

export const YEAR = 2026;

export const PONDERADO = 0;
export const COMPETENCIAS = 1;

export interface Tarjeta {
	etiqueta: string;
	subtitulo: string;
	columnas: { texto: string; porcentaje: string; peso: string }[];
	boletin: string;
	corto: string;
}

export const TARJETAS: Tarjeta[] = [
	{
		etiqueta: 'Ponderado',
		subtitulo: 'El logro va en la columna y boletín',
		columnas: [
			{ texto: '«Identifica los tipos de fracción…»', porcentaje: '35 %', peso: '40' },
			{ texto: '«Opera con fracciones heterogéneas…»', porcentaje: '65 %', peso: '60' },
		],
		boletin: 'Esas mismas columnas, cada una con su nota. Sin definición de competencias por aparte (así funcionaba la versión antigua de Mi Cole Virtual).',
		corto: 'Ponderado',
	},
	{
		etiqueta: 'Por competencias',
		subtitulo: 'Hay competencias además de logros',
		columnas: [
			{ texto: 'Examen 1', porcentaje: '35 %', peso: '40' },
			{ texto: 'Taller 2', porcentaje: '65 %', peso: '60' },
		],
		/* `desempenos_displayname` sin poner: «Desempeños», en minúscula. */
		boletin: 'Los desempeños del periodo —«Identifica los tipos de fracción…»— con el nivel de cada alumno: «Fortaleza en…».',
		corto: 'Competencias',
	},
];

export const CONSECUENCIAS = {
	uno: { b: 'Cambiar el modelo no borra ni recalcula nada.', resto: ' Lo que ya está escrito se queda en su sitio; deja de verse. Volver atrás es volver a elegir aquí, y ninguna nota definitiva se vuelve a calcular.' },
	dos: { b: 'Es del año.', resto: ` Sólo cambia ${YEAR}. Los demás años lectivos conservan el que tengan, también los ya cerrados.` },
};

export const aviso = (t: number) => `Modelo del año: «${TARJETAS[t].etiqueta}».`;

/** Las pestañas del plan con el modelo que haya. La ③ sólo existe por competencias. */
export function pestanas(modelo: number): PestanaPlan[] {
	const lista: PestanaPlan[] = [
		{ clave: 'modelo', numero: '①', etiqueta: 'Modelo', marca: { tono: 'resuelto', glifo: '✓', texto: TARJETAS[modelo].corto } },
		{ clave: 'plantilla', numero: '②', etiqueta: 'Plantilla de notas', marca: { tono: 'resuelto', glifo: '✓' } },
	];
	if (modelo === COMPETENCIAS) { lista.push({ clave: 'competencias', numero: '③', etiqueta: 'Competencias' }); }
	lista.push({ clave: 'reparto', numero: '④', etiqueta: 'Reparto de notas' });
	lista.push({ clave: 'frases', numero: '⑤', etiqueta: 'Escalas de valoración' });
	return lista;
}

/* ── La geometría ─────────────────────────────────────────────────────────────────────────── */

export const MD = { titulo: 30, tarjetaAlto: 312, hueco: 16, relleno: 16 };
export const ANCHO_TARJETA = (MAIN.ancho - MD.hueco) / 2;

export const rectTitulo = (): Rect => ({ x: MAIN.x, y: PL.cuerpo, ancho: MAIN.ancho, alto: MD.titulo });

export function rectTarjeta(i: number): Rect {
	return { x: MAIN.x + i * (ANCHO_TARJETA + MD.hueco), y: PL.cuerpo + MD.titulo + 12, ancho: ANCHO_TARJETA, alto: MD.tarjetaAlto };
}

export function rectRadio(i: number): Rect {
	const t = rectTarjeta(i);
	return { x: t.x + MD.relleno, y: t.y + MD.relleno + 4, ancho: 16, alto: 16 };
}

/** La cabecera de la tarjeta: radio + nombre, que es donde se pulsa. */
export function rectCabeceraTarjeta(i: number): Rect {
	const t = rectTarjeta(i);
	return { x: t.x + MD.relleno, y: t.y + MD.relleno, ancho: 220, alto: 24 };
}

export function rectEjemplo(i: number): Rect {
	const t = rectTarjeta(i);
	return { x: t.x + MD.relleno, y: t.y + MD.relleno + 24 + 10 + 22 + 10, ancho: t.ancho - MD.relleno * 2, alto: t.alto - (MD.relleno * 2 + 24 + 10 + 22 + 10) };
}

export function rectConsecuencia(cual: 1 | 2): Rect {
	const y0 = rectTarjeta(0).y + MD.tarjetaAlto + 20;
	return cual === 1 ? { x: MAIN.x, y: y0, ancho: MAIN.ancho, alto: 46 } : { x: MAIN.x, y: y0 + 46 + 12, ancho: MAIN.ancho, alto: 24 };
}
