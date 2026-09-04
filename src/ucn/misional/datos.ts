/* Salen de `Misional.dc.html` (`myvc_ucn/diseno/gen_misional.py`). */

export const KPI = [
	{ etiqueta: 'De familia adventista', valor: 4630, pie: 'En 2019 eran el 68,9 %', delta: ['baja', '1,8 pp', '62,4 % de la matrícula'] as const },
	{ etiqueta: 'Bautismos en el año', valor: 192, pie: 'En 11 de los 13 colegios', delta: ['sube', '11,6 %', '+20 vs 2025'] as const },
	{ etiqueta: 'En clases bíblicas', valor: 3452, pie: 'Nación: 46,5 %', delta: ['sube', '6,2 %', '46,5 % del total'] as const },
	{ etiqueta: 'Clubes juveniles', valor: 37, pie: 'Conquistadores y aventureros', delta: ['plano', '976', 'alumnos inscritos'] as const },
	{ etiqueta: 'Colegios con capellán', valor: 11, pie: 'Faltan Bethel y COAF', delta: ['plano', 'de 13', '85 % de la red'] as const },
];

export const BAUTISMOS = [
	{ etiqueta: '2019', valor: 236 }, { etiqueta: '2020', valor: 85 }, { etiqueta: '2021', valor: 107 },
	{ etiqueta: '2022', valor: 153 }, { etiqueta: '2023', valor: 168 }, { etiqueta: '2024', valor: 179 },
	{ etiqueta: '2025', valor: 172 }, { etiqueta: '2026', valor: 192, color: '#124B76', fuerte: true },
];

export const CAMPOS = [
	{ etiqueta: 'Noreste Colombiano', valor: 71.5 },
	{ etiqueta: 'Centro Occidental', valor: 68.4 },
	{ etiqueta: 'Islas Colombianas', valor: 66.0 },
	{ etiqueta: 'Sur Occidental', valor: 61.2 },
	{ etiqueta: 'Oriente Colombiano', valor: 60.2 },
];

export const ACTIVIDADES = [
	{ etiqueta: 'Clases bíblicas', valor: 3452 },
	{ etiqueta: 'Grupos pequeños', valor: 1932 },
	{ etiqueta: 'Coro y música', valor: 1625 },
	{ etiqueta: 'Conquistadores', valor: 976 },
	{ etiqueta: 'Aventureros', valor: 603 },
];
