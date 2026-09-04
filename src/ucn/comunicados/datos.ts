/*
 * LO QUE SE PUBLICA Y A QUIÉN. Sale de la pantalla `Comunicados.dc.html` del portal
 * (`myvc_ucn/diseno/gen_comunicados.py`): mismo evento, mismos destinatarios, misma cuenta.
 */

export const EVENTO = {
	titulo: 'Jornada nacional de capacitación docente',
	cuando: 'sábado 19 de septiembre · 8:00 a 12:00',
	donde: 'Virtual · el enlace va dentro del mensaje',
	mes: 'SEP',
	dia: '19',
	cuerpo:
		'Convocamos a todos los docentes de la red a la jornada de capacitación en evaluación por ' +
		'competencias. Son cuatro horas, con certificado. El enlace se abre a las 7:45 y la asistencia ' +
		'se toma dentro de la sala.',
};

/** Los tres roles que se encienden, con lo que suma cada uno. 363 + 13 + 25 = 401. */
export const ROLES = [
	{ nombre: 'Docentes', cuantos: 363 },
	{ nombre: 'Rectores', cuantos: 13 },
	{ nombre: 'Coordinadores', cuantos: 25 },
];

export const DESTINATARIOS = 401;

/** Lo que se enciende en «Cómo se envía». El cuarto --el urgente-- se queda apagado a propósito. */
export const OPCIONES = [
	{ texto: 'Pedir confirmación de asistencia', sub: 'El docente contesta desde la notificación, sin abrir nada más.' },
	{ texto: 'Añadirlo al calendario de los trece colegios', sub: 'Aparece en «Clases de hoy» y en el calendario del colegio.' },
];

/** El calendario de la red, a la derecha. El primero es el que se está publicando. */
export const PROXIMOS = [
	{ mes: 'SEP', dia: '28', titulo: 'Semana de énfasis espiritual', alcance: 'Los 13 colegios · toda la comunidad', pie: 'sin confirmación' },
	{ mes: 'OCT', dia: '06', titulo: 'Reunión de rectores · cierre del tercer periodo', alcance: 'Los 13 colegios · sólo rectores', pie: '9 de 13 confirmados' },
	{ mes: 'OCT', dia: '17', titulo: 'Olimpiadas académicas de la red', alcance: 'Sur Occidental y Oriente', pie: 'por abrir', ocre: true },
];

/** Lo que ya han confirmado cuando el docente del clip toca su botón. */
export const CONFIRMADOS = { antes: 250, despues: 251, total: 401, pct: 62 };
