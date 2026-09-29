import { BANDA } from '../encuadre';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PÁGINA DEL OBSERVADOR (`paginas/disciplina/observador/observador.html` de app2), en el
 * FOTOGRAMA, y lo que dice la hoja de Sara.
 *
 *   · arriba, sin imprimirse: el título «Observador completo — Noveno B», «Recargar» e «Imprimir»;
 *   · la tira de ajustes: la imagen de fondo («fondo-observador.png»), «Firma estudiante»,
 *     «Incluir compromisos» (sólo en el completo), «Margen superior» (150) y «Margen izquierdo»
 *     (200), en píxeles, **que no se guardan** (son señales sueltas: al recargar vuelven a 150/200);
 *   · y una hoja por alumno: el membrete detrás, el contenido corrido por los dos márgenes.
 *
 * EL MEMBRETE ES INVENTADO: «Colegio Los Almendros», con su escudo dibujado. Los datos del alumno
 * también (dirección, teléfono, documento y acudiente): esto se publica.
 */

export const PAGINA = {
	x: 80,
	y: BANDA.arriba + 6,
	ancho: 1760,
	barra: 60,
	tira: 86,
};

/** La hoja: una carta a 96 ppp, pintada a escala 1. */
export const HOJA = { ancho: 816, alto: 1056 };
export const X_HOJA = (1920 - HOJA.ancho) / 2;
export const Y_HOJA = PAGINA.y + PAGINA.barra + PAGINA.tira + 22;

export const MARGEN_SUPERIOR = 150;
export const MARGEN_IZQUIERDO = 200;
/** Lo que se sube en el vídeo: tres clics a la flecha, de 10 en 10. */
export const MARGEN_NUEVO = 180;

/** Los controles de la tira, en el fotograma. */
const Y_CONTROL = PAGINA.y + PAGINA.barra + 32;
export const CONTROLES = {
	imagen: { x: PAGINA.x + 28, y: Y_CONTROL, ancho: 360, alto: 38 },
	firma: { x: PAGINA.x + 420, y: Y_CONTROL, ancho: 160, alto: 38 },
	compromisos: { x: PAGINA.x + 610, y: Y_CONTROL, ancho: 180, alto: 38 },
	superior: { x: PAGINA.x + 830, y: Y_CONTROL, ancho: 150, alto: 38 },
	izquierdo: { x: PAGINA.x + 1010, y: Y_CONTROL, ancho: 150, alto: 38 },
};

/** La flecha de subir del campo de número (la que Ant enseña al pasar por encima). */
export const FLECHA_ARRIBA = { x: CONTROLES.superior.x + CONTROLES.superior.ancho - 24, y: CONTROLES.superior.y, ancho: 24, alto: 19 };

export const IMPRIMIR = { x: PAGINA.x + PAGINA.ancho - 28 - 150, y: PAGINA.y + 12, ancho: 150, alto: 40 };

/* ── Lo que dice la hoja ──────────────────────────────────────────────────────────────────── */

export const DATOS_DE_SARA = [
	'Grado: Noveno B - 2026',
	'Dirección: Calle 14 # 22-35, barrio El Prado',
	'Teléfono: 321 456 7890',
	'Tarjeta de identidad: 1.098.765.432',
	'Acudiente: Rivera Gómez Patricia',
];

export const CONVIVENCIA = [
	'Per1: Buen trato con sus compañeras.',
	'Per2: Resolvió con calma un conflicto en el descanso.',
];

export const ACADEMICO = [
	'Per1: Participa en clase con buenas preguntas.',
	'Per2: Subió dos puntos el promedio.',
];

export const FALLAS = [
	'Per2 Tipo 1: Salió del aula sin permiso en clase de Sociales.',
	'Per2 Tipo 1: Usó el celular durante la evaluación de Matemáticas.',
];

/** Dónde caen, dentro de la hoja y a partir del margen: los tres paneles. */
export const EN_LA_HOJA = {
	titulo: 0,
	nombre: 30,
	datos: 62,
	renglon: 21,
	paneles: 180,
	panelAlto: 118,
	fallas: 312,
	fallasAlto: 86,
	firmas: 430,
};
