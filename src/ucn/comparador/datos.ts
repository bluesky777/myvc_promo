/* Salen de `Comparador.dc.html` (`myvc_ucn/diseno/gen_comparador.py`). */

/** El primer valor de cada fila es el del colegio que mira; los otros doce son los demás. */
export const INDICADORES = [
	{ nombre: 'Promedio académico', valores: [4.21, 4.15, 4.10, 4.08, 4.05, 4.04, 4.02, 3.99, 3.98, 3.94, 3.91, 3.88, 3.86], mio: '4,21', rango: '1.º', bueno: true },
	{ nombre: 'Recaudo del año', valores: [92.1, 90.4, 89.4, 88.2, 87.0, 86.1, 85.4, 84.9, 84.6, 83.1, 82.6, 80.4, 78.3], mio: '92,1 %', rango: '1.º', bueno: true },
	{ nombre: 'Matrícula', valores: [1284, 962, 874, 731, 688, 542, 498, 470, 431, 318, 294, 186, 142], mio: '1.284', rango: '1.º', bueno: true },
	{ nombre: 'Deserción', valores: [3.9, 3.2, 4.1, 4.4, 4.8, 4.9, 5.0, 5.2, 5.6, 5.8, 6.1, 6.4, 7.1], mio: '3,9 %', rango: '2.º', bueno: true },
	{ nombre: 'De familia adventista', valores: [58.1, 60.2, 61.4, 64.0, 66.0, 66.8, 68.4, 69.3, 71.0, 71.8, 73.5, 74.1, 75.2], mio: '58,1 %', rango: '13.º', bueno: false },
	{ nombre: 'Alumnos por docente', valores: [27.9, 26.4, 24.8, 23.1, 22.0, 20.4, 19.8, 18.6, 17.9, 17.1, 16.4, 15.8, 15.2], mio: '27,9', rango: '13.º', bueno: false },
];

/** A cuánto está de la mediana, en una sola cifra por indicador. */
export const DISTANCIA = [
	{ nombre: 'Promedio académico', valor: 0.16, etiqueta: '+0,16', mejor: true },
	{ nombre: 'Recaudo del año', valor: 6.0, etiqueta: '+6,0 pp', mejor: true },
	{ nombre: 'Deserción', valor: 0.9, etiqueta: '−0,9 pp', mejor: true },
	{ nombre: 'De familia adventista', valor: 7.9, etiqueta: '−7,9 pp', mejor: false },
	{ nombre: 'Alumnos por docente', valor: 7.5, etiqueta: '+7,5', mejor: false },
];

/** Quién ve qué. Es la razón por la que un rector abre esta pantalla más de una vez. */
export const NIVELES = [
	{ titulo: 'El rector de un colegio', texto: 'Ve su punto en color y los otros doce en gris, sin nombre. Sabe si va bien o mal, y no puede señalar a nadie.' },
	{ titulo: 'El campo', texto: 'Ve con nombre a los suyos, y en gris al resto de la red.' },
	{ titulo: 'La Unión', texto: 'Ve la tabla entera con nombres. Es la única que puede.' },
];
