/*
 * LA ENCUESTA, TAL COMO ESTÁ EN EL PORTAL. Sale de `Encuestas.dc.html`
 * (`myvc_ucn/diseno/gen_encuestas.py`): mismas preguntas, mismas condiciones, mismos tipos.
 */

export type Tipo = 'unica' | 'multiple' | 'escala' | 'abierta' | 'numero';

export const TIPOS: Record<Tipo, { color: string; etiqueta: string }> = {
	unica: { color: '#2073AE', etiqueta: 'Opción única' },
	multiple: { color: '#7B4FB0', etiqueta: 'Varias opciones' },
	escala: { color: '#12876B', etiqueta: 'Escala' },
	abierta: { color: '#9C8A0F', etiqueta: 'Texto libre' },
	numero: { color: '#56534A', etiqueta: 'Número' },
};

export interface Pregunta {
	num: string;
	texto: string;
	tipo: Tipo;
	opciones?: string;
	nivel: number;
	condicion?: string;
	/** De qué rama cuelga: `no`, `si`, `honda`. Las de tronco no llevan ninguna. */
	rama?: 'no' | 'si' | 'honda';
}

export const ARBOL: Pregunta[] = [
	{ num: '1', texto: '¿Cuántos años lleva enseñando en un colegio adventista?', tipo: 'unica', opciones: 'Menos de 1 · De 1 a 3 · De 4 a 10 · Más de 10', nivel: 0 },
	{ num: '2', texto: '¿Ha recibido capacitación en evaluación por competencias?', tipo: 'unica', opciones: 'Sí · No', nivel: 0 },
	{ num: '2.1', texto: '¿Le interesaría recibirla este año?', tipo: 'unica', opciones: 'Sí · No · Ya la tengo por otra vía', nivel: 1, condicion: 'si en la 2 responde «No»', rama: 'no' },
	{ num: '2.2', texto: '¿En qué año la recibió?', tipo: 'numero', nivel: 1, condicion: 'si en la 2 responde «Sí»', rama: 'si' },
	{ num: '2.3', texto: '¿La aplica hoy en su aula?', tipo: 'escala', opciones: 'De 1 «nunca» a 5 «en todas las asignaturas»', nivel: 1, condicion: 'si en la 2 responde «Sí»', rama: 'si' },
	{ num: '2.3.1', texto: '¿Qué se lo impide?', tipo: 'abierta', nivel: 2, condicion: 'si en la 2.3 responde 1 o 2', rama: 'honda' },
	{ num: '3', texto: '¿Desde qué aparato entra a MyVC?', tipo: 'multiple', opciones: 'Teléfono · Computador del colegio · Computador propio · Tableta', nivel: 0 },
];

export const ENCUESTA = {
	titulo: 'Diagnóstico docente 2026',
	sub: 'Nueve preguntas, de las que cada docente sólo verá las que le toquen.',
	resumen: '9 preguntas · 4 condicionales · entre 3 y 6 minutos',
	cierra: '12 de septiembre',
};

/** Lo que se le pregunta al docente en el teléfono, con sus opciones. */
export const MOVIL_PREGUNTAS = {
	dos: { texto: '¿Ha recibido capacitación en evaluación por competencias?', opciones: ['Sí', 'No'] },
	dosUno: { texto: '¿Le interesaría recibirla este año?', opciones: ['Sí, me interesa', 'No este año', 'Ya la tengo por otra vía'] },
	dosDos: { texto: '¿En qué año la recibió?', valor: '2019' },
	dosTres: { texto: '¿La aplica hoy en su aula?', escala: ['1', '2', '3', '4', '5'], pie: ['nunca', 'en todas'] },
	dosTresUno: { texto: '¿Qué se lo impide?', respuesta: 'No tengo las rúbricas hechas y el periodo se me va en...' },
};

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LOS RESULTADOS. **Esta pantalla no está en el diseño de `myvc_ucn`**: se inventa aquí para el
 * vídeo, a petición de Joseth, y por eso las preguntas del informe no son exactamente las mismas
 * que se ven contestar en el teléfono. Si algún día se dibuja de verdad, este fichero es el borrador
 * de qué tendría que llevar.
 *
 * LAS CIFRAS SON DE MUESTRA, coherentes entre sí --249 de 363, y los 97 del «No» reparten 85 + 9 +
 * 3-- pero **no medidas**. Ninguna debe acabar citada como medición.
 */

export const RESULTADOS = {
	kpi: [
		{ etiqueta: 'Respuestas', valor: 249, pie: 'De 363 docentes de la red' },
		{ etiqueta: 'Participación', valor: 68.6, decimales: 1, sufijo: ' %', pie: 'Cierra el 12 de septiembre' },
		{ etiqueta: 'Minutos de media', valor: 4, pie: 'Entre abrirla y enviarla' },
		{ etiqueta: 'Piden capacitación', valor: 85, pie: 'Y se sabe en qué colegio está cada uno' },
	],

	/** La pregunta que manda, y la que se le abrió a quien dijo «No». */
	capacitacion: [
		{ etiqueta: 'Sí', valor: 152, pct: 61, color: '#2073AE' },
		{ etiqueta: 'No', valor: 97, pct: 39, color: '#C0521C' },
	],
	interes: [
		{ etiqueta: 'Sí, me interesa', valor: 85, pct: 88, color: '#12876B' },
		{ etiqueta: 'No este año', valor: 9, pct: 9, color: '#B5AF9F' },
		{ etiqueta: 'Ya la tengo', valor: 3, pct: 3, color: '#B5AF9F' },
	],

	/** «¿La aplica hoy en su aula?», de 1 a 5. Sólo la contestaron los 152 del «Sí». */
	aplica: [
		{ etiqueta: '1', valor: 18 }, { etiqueta: '2', valor: 34, color: '#C0521C', fuerte: true },
		{ etiqueta: '3', valor: 47 }, { etiqueta: '4', valor: 33 }, { etiqueta: '5', valor: 20 },
	],

	/** «¿Cuántos años lleva enseñando en un colegio adventista?» */
	experiencia: [
		{ etiqueta: '< 1', valor: 22 }, { etiqueta: '1 a 3', valor: 61 },
		{ etiqueta: '4 a 10', valor: 98 }, { etiqueta: '+ 10', valor: 68 },
	],

	/** Quién ha contestado, por campo. */
	campos: [
		{ etiqueta: 'Sur Occidental', valor: 78, extra: '105 de 134' },
		{ etiqueta: 'Oriente Colombiano', valor: 71, extra: '31 de 43' },
		{ etiqueta: 'Centro Occidental', valor: 67, extra: '11 de 16' },
		{ etiqueta: 'Noreste Colombiano', valor: 63, extra: '90 de 143' },
		{ etiqueta: 'Islas Colombianas', valor: 44, extra: '12 de 27' },
	],

	/** Las respuestas que fueron llegando, día a día desde que se publicó. */
	porDia: { dias: ['1 sep', '2', '3', '4', '5', '6', '7', '8 sep'], valores: [64, 118, 152, 178, 199, 219, 236, 249] },
};
