import { MENU_DIRECTIVO } from '../medidas';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, LLEGADA, centro, crece, foco, puntoDelMenu, rectDelMenu } from '../personas/comun';
import { disposicionDirectorio, rectAccion, rectGrupo } from '../secretaria/planoDirectorio';
import { HOJA } from '../certificado-imprimir/datos';
import { BOTON_CERTIFICADOS, CERTIFICADOS, EL_ALUMNO, GRUPO, NOMBRE, SEPTIMO_A } from './Pantalla';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SECRETARÍA: «CERTIFICADOS DE UN ALUMNO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Sólo cuentan años matriculado o asistente; un retiro no es un año que certificar.** Es
 *     `CURSADOS = ['MATR', 'ASIS']` en `certificados-alumno.ts`, con su porqué escrito: «Un retiro
 *     (RETI) o una prematrícula (PREM) no son un año que certificar, y meterlos imprimiría un
 *     certificado de algo que no ocurrió — en un documento que se firma. La lista es BLANCA».
 *
 * El alumno del vídeo (inventado) tiene tres matrículas: 2024 en 6°A, 2025 en 7°A --retirado-- y
 * 2026 otra vez en 7°A. Salen dos hojas, y la cabecera de la pantalla lo dice: «2 años de …»
 * (`descripcion()`). La matrícula de 2025 no se enseña (vive en una pestaña de la ficha que el
 * vídeo no abre): lo dice el rótulo.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA   Personas -> Alumnos -> 7A -> la ficha (el primer botón de Acciones)
 *     2. LA FICHA     «Ver todos los certificados», arriba
 *     3. LOS PAPELES  un plano quieto con la cabecera de las dos hojas, lado a lado
 *
 * NO TIENE ENTRADA DE MENÚ Y NO ES UN OLVIDO (`app.routes.ts`): lleva el id del alumno en la
 * dirección, y «el contrato del menú prohíbe entradas con un id escrito». Por eso la llegada pasa
 * por la ficha.
 *
 * LAS HOJAS SON EL CERTIFICADO DEL AÑO DE `certificado-imprimir/Certificado.tsx`, con el año y el
 * grado de cada matrícula. Sólo se ve la cabecera y el párrafo: la tabla de 2024 tendría sus cuatro
 * periodos, y ese dibujo es de septiembre de 2026; recortar arriba no afirma ninguna nota.
 */

export const FPS = 30;
const MENU = MENU_DIRECTIVO;

export const T = {
	...LLEGADA,
	/* La llegada por el menú, más corta que la de `LLEGADA`: trayectos de 20 fotogramas. */
	cursorEntra: 12,
	llegaPersonas: 34,
	pulsaPersonas: 40,
	abrePersonas: 42,
	llegaEntrada: 62,
	pulsaEntrada: 72,
	monta: 76,
	llegaGrupo: 130,
	pulsaGrupo: 142,
	llegaLaLista: 156,
	llenaLaLista: 180,
	llegaFicha: 202,
	pulsaFicha: 216,
	montaFicha: 221,
	llegaCertificados: 284,
	pulsaCertificados: 300,
	cursorSale: 306,
	seVaLaCascara: 308,
	entranLasHojas: 353,
};

/* ── El plano de las hojas ─────────────────────────────────────────────────────────────────── */

export const RECORTE = { alto: 328 };
export const HOJAS = (() => {
	const escala = 1.02;
	const hueco = 40;
	const ancho = HOJA.ancho * escala;
	const x0 = (1920 - (ancho * 2 + hueco)) / 2;
	const alto = RECORTE.alto * escala;
	const tira = { x: x0, y: 250, ancho: ancho * 2 + hueco, alto: 64 };
	const y = tira.y + tira.alto + 20 + 40;
	return { escala, hueco, ancho, alto, y, x: [x0, x0 + ancho + hueco], tira };
})();
export const IMPRIMIR = { x: HOJAS.tira.x + HOJAS.tira.ancho - 20 - 116, y: HOJAS.tira.y + 16, ancho: 116, alto: 32 };

const d = disposicionDirectorio(false, false, true);

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	personas: puntoDelMenu(MENU, null, false),
	alumnos: puntoDelMenu(MENU, 'Alumnos', true),
	grupo: centro(rectGrupo(GRUPO)),
	ficha: centro(rectAccion(d, EL_ALUMNO, 0)),
	certificados: centro(BOTON_CERTIFICADOS),
};

export const FOCOS = {
	personas: foco(rectDelMenu(MENU, null, false), 8),
	ficha: foco(crece(rectAccion(d, EL_ALUMNO, 0), 3), 8),
	certificados: foco(crece(BOTON_CERTIFICADOS, 6), 8),
	lasDos: { x: HOJAS.x[0] - 12, y: HOJAS.tira.y - 10, ancho: HOJAS.tira.ancho + 24, alto: HOJAS.y + HOJAS.alto - HOJAS.tira.y + 22, radio: 12 },
	tira: { x: HOJAS.tira.x - 8, y: HOJAS.tira.y - 8, ancho: 760, alto: HOJAS.tira.alto + 16, radio: 10 },
	imprimir: { x: IMPRIMIR.x - 8, y: IMPRIMIR.y - 8, ancho: IMPRIMIR.ancho + 16, alto: IMPRIMIR.alto + 16, radio: 10 },
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Personas', url: 'micolegio.micolevirtual.com/up2/' };
const EN_ALUMNOS = { ubicacion: 'Menú ▸ Personas ▸ Alumnos', url: '/alumnos' };
const alumno = SEPTIMO_A[EL_ALUMNO];
const EN_LA_FICHA = { ubicacion: 'Menú ▸ Personas ▸ Alumnos ▸ Ficha del alumno', url: `/persona/${alumno.id}/alumno` };
const EN_CERTIFICADOS = { ubicacion: 'Ficha del alumno ▸ Ver todos los certificados', url: `/informes/certificados-alumno/${alumno.id}` };

export const PASOS: Paso[] = [
	{ desde: 7, texto: 'Se llega por Personas, Alumnos.', ...EN_EL_MENU, foco: FOCOS.personas, focoHasta: T.pulsaPersonas + 16 },
	{ desde: 113, texto: 'Elige el grupo y abre la ficha del alumno.', ...EN_ALUMNOS, foco: FOCOS.ficha, focoHasta: T.pulsaFicha - 2 },
	{ desde: T.montaFicha, texto: 'En la ficha: Ver todos los certificados.', ...EN_LA_FICHA, foco: FOCOS.certificados, focoHasta: T.pulsaCertificados - 2 },
	{ desde: 354, texto: 'Un certificado por cada año cursado: aquí, dos.', ...EN_CERTIFICADOS, foco: FOCOS.lasDos },
	{ desde: 502, texto: '2025 no sale: ese año se retiró.', ...EN_CERTIFICADOS, foco: FOCOS.tira },
	{ desde: 632, texto: 'Tampoco sale una prematrícula.', ...EN_CERTIFICADOS },
	{ desde: 722, texto: 'Cada año va en su hoja; Imprimir los saca todos.', ...EN_CERTIFICADOS, foco: FOCOS.imprimir },
];

export const TARJETA = 853;
export const DURACION = TARJETA + 120;

export const CLAVE = 'certificados-alumno';
export const TITULO = 'Certificados de un alumno';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: la ficha del alumno' },
	{ desde: 354, titulo: 'Un certificado por año cursado' },
	{ desde: 502, titulo: 'El retiro no se certifica' },
];

export const CIERRE: Cierre = {
	hiciste: `Abriste todos los certificados de ${NOMBRE} desde su ficha.`,
	seVe: `Arriba dice «${CERTIFICADOS.length} años de ${NOMBRE}»: ${CERTIFICADOS.map((c) => c.year).join(' y ')}, sin 2025.`,
	despues: 'Siguiente: la constancia de estudio, que no lleva notas.',
	voz: 'Siguiente: la constancia de estudio.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (CERTIFICADOS.length !== 2) {
	throw new Error('Guion: el vídeo dice «dos» y las matrículas cursadas no son dos.');
}
