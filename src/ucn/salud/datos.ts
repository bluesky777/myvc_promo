/* Salen de `SaludEscolar.dc.html` (`myvc_ucn/diseno/gen_salud_escolar.py`). */

export const KPI = [
	{ etiqueta: 'Atenciones en el año', valor: 11008, pie: '1,48 por alumno matriculado', delta: ['sube', '8,4 %', '+854 vs 2025'] as const },
	{ etiqueta: 'Alumnos atendidos', valor: 3716, pie: 'Al menos una vez en el año', delta: ['plano', '50,1 %', 'de la matrícula'] as const },
	{ etiqueta: 'Remitidos a hospital', valor: 189, pie: '1,7 % de las atenciones', delta: ['baja', '10', '−4,9 % vs 2025'] as const },
	{ etiqueta: 'Acudientes avisados', valor: 2741, pie: 'Desde la app, sin llamar', delta: ['plano', '24,9 %', 'de las atenciones'] as const },
	{ etiqueta: 'Tiempo medio de aviso', valor: 6, sufijo: ' min', pie: 'Peor: 21 min en COAF', delta: ['baja', '3 min', 'más rápido'] as const },
];

export const MESES = [
	{ etiqueta: 'Ene', valor: 864 }, { etiqueta: 'Feb', valor: 1341 }, { etiqueta: 'Mar', valor: 1482 },
	{ etiqueta: 'Abr', valor: 1314 }, { etiqueta: 'May', valor: 1420 }, { etiqueta: 'Jun', valor: 1252 },
	{ etiqueta: 'Jul', valor: 988 }, { etiqueta: 'Ago', valor: 1394 }, { etiqueta: 'Sep', valor: 953, tenue: true },
];

export const MOTIVOS = [
	{ etiqueta: 'Dolor de cabeza', valor: 2128 },
	{ etiqueta: 'Dolor abdominal', valor: 1750 },
	{ etiqueta: 'Golpe o caída', valor: 1505 },
	{ etiqueta: 'Fiebre', valor: 1069, color: '#C0521C' },
	{ etiqueta: 'Malestar general', valor: 974 },
];

/** Los tres avisos abiertos. El primero es el que ningún colegio solo podría ver. */
export const AVISOS = [
	{
		color: '#C0521C',
		icono: 'alerta',
		titulo: 'Bethel Explora: 34 casos de fiebre en cinco días',
		texto: 'Tres veces su media. Es el patrón de un brote, y ningún colegio solo puede saber que es anormal para la red.',
		cuando: 'hoy 03:12',
	},
	{
		color: '#9C8A0F',
		icono: 'sube',
		titulo: 'Maranatha: los golpes en recreo se duplicaron',
		texto: 'De 6 a 13 por semana desde que se abrió la cancha nueva. Sin remisiones, pero es una tendencia.',
		cuando: 'ayer',
	},
	{
		color: '#7B4FB0',
		icono: 'cama',
		titulo: 'Cuatro colegios sin enfermería permanente',
		texto: 'Auxiliar por horas. En esos cuatro, el aviso al acudiente tarda 19 minutos de media, contra 6 en el resto.',
		cuando: 'este mes',
	},
];
