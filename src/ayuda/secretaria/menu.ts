import { MEDIDAS, MENU_DIRECTIVO, alturaEnMenu, entradaDe } from '../medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL MENÚ DE SECRETARÍA, EN NÚMEROS. Las pantallas de alumnos cuelgan de «Personas» y las del día de
 * matrículas de «Matrículas» (`app2/src/app/cascara/menu/menu.ts`, 749 y 888). El vídeo abre una
 * sección a la vez, como la aplicación, y el foco y el puntero salen de aquí.
 */

export const PERSONAS = entradaDe(MENU_DIRECTIVO, 'Personas').seccion;
export const REFERENCIAS = entradaDe(MENU_DIRECTIVO, 'Referencias').seccion;

/** El índice de una hija de «Personas» por su texto. Revienta si no está. */
export const dePersonas = (hija: string) => entradaDe(MENU_DIRECTIVO, 'Personas', hija).hija!;

/** Una entrada del menú en coordenadas de la cáscara, con `abierta` desplegada (o ninguna). */
export function rectDelMenu(seccion: number, hija: number | null, abierta: number | null) {
	return {
		x: 0,
		y: alturaEnMenu(MENU_DIRECTIVO, seccion, hija, abierta),
		ancho: MEDIDAS.menu,
		alto: hija === null ? MEDIDAS.seccion : MEDIDAS.hija,
	};
}

export const puntoDelMenu = (seccion: number, hija: number | null, abierta: number | null) => {
	const r = rectDelMenu(seccion, hija, abierta);
	return { x: 150, y: r.y + r.alto / 2 };
};

/** De dónde sale el puntero al empezar: abajo, sobre la pantalla vacía. */
export const ENTRADA_DEL_PUNTERO = { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 150 };
