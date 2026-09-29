import { MENU_DIRECTIVO } from '../medidas';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, LLEGADA, MENU_SECRETARIA, centro, crece, foco, puntoDelMenu, rectDelMenu } from '../personas/comun';
import { COLUMNA_BOTON, FILTROS, GRUPO, REJILLA, rectGrupo } from './Pantalla';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SECRETARÍA: «ACUDIENTES».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **La entrada se ve y la puerta no deja pasar a una secretaria que no sea superusuaria.** El
 *     menú la enseña con `esPersonal` --administración, secretaría y coordinación disciplinaria--
 *     y la ruta se guarda con `puertaViejaDeAcudientes`: superusuario, docente, coordinación
 *     académica o disciplinaria (`menu.ts:307`). La ruta lo dice: «es la unica ruta del proyecto»
 *     donde menú y puerta no coinciden, y se reproduce tal cual la aplicación vieja.
 *
 *     Lo que pasa al pulsar lo dice `pidePermiso` (`permisos.guard.ts`): apunta «Esa pantalla no
 *     es para tu perfil.» y manda a `/`; el panel lo pinta como aviso informativo de 5 s
 *     (`panel.ts`, `pintaElPendiente`). Eso es lo que enseña el primer acto.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * DOS ACTOS
 *
 *     1. LA SECRETARIA   su menú (el de `personas/comun.tsx`), pulsa Acudientes y vuelve a Inicio
 *     2. QUIEN SÍ ENTRA  con superusuario, la misma entrada; se elige 9B y sale la lista
 *
 * NO SE DICE QUE UN ADMIN SIN SUPERUSUARIO ENTRE: `puertaViejaDeAcudientes` no incluye `esAdmin`,
 * así que tampoco. El vídeo nombra sólo a quien sí entra, que es lo que la función deja escrito.
 * Y NO SE ABRE «Ver sus alumnos»: el diálogo (`alumnos-de-acudiente.ts`) no se dibuja; se dice
 * lo que dice su ayuda, que el botón enseña sus alumnos.
 */

export const FPS = 30;

export const T = {
	...LLEGADA,
	llegaEntrada: 100,
	pulsaEntrada: 110,
	/** El guarda redirige: Inicio se monta y sale el aviso. */
	inicio: 128,
	seVaLaSecretaria: 405,
	llegaLaOtra: 431,
	/* La pantalla monta donde empieza su paso: antes la miga decía «Personas» sobre ella. */
	llegaEntradaB: 533,
	pulsaEntradaB: 545,
	montaB: 549,
	llegaGrupo: 619,
	pulsaGrupo: 631,
	llegaLaLista: 645,
	llenaLaLista: 665,
	llegaBoton: 811,
	cursorSale: 879,
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	personas: puntoDelMenu(MENU_SECRETARIA, null, false),
	acudientes: puntoDelMenu(MENU_SECRETARIA, 'Acudientes', true),
	acudientesB: puntoDelMenu(MENU_DIRECTIVO, 'Acudientes', true),
	grupo: centro(rectGrupo(GRUPO)),
	boton: { x: COLUMNA_BOTON.x + 28, y: REJILLA.y + 98 + 21 },
};

export const FOCOS = {
	personas: foco(rectDelMenu(MENU_SECRETARIA, null, false), 8),
	entradaSecretaria: foco(rectDelMenu(MENU_SECRETARIA, 'Acudientes', true), 8),
	entradaB: foco(rectDelMenu(MENU_DIRECTIVO, 'Acudientes', true), 8),
	filtros: foco(crece(FILTROS, 6), 10),
	rejilla: foco(crece(REJILLA, 4), 10),
	boton: foco(crece(COLUMNA_BOTON, 2), 8),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Personas', url: 'micolegio.micolevirtual.com/up2/' };
const EN_INICIO = { ubicacion: 'Menú ▸ Inicio', url: '/' };
const EN_ACUDIENTES = { ubicacion: 'Menú ▸ Personas ▸ Acudientes', url: '/acudientes' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Acudientes está en el menú, en Personas.', ...EN_EL_MENU, foco: FOCOS.personas, focoHasta: T.pulsaPersonas + 16 },
	{ desde: T.inicio, texto: 'Una secretaria ve la entrada, pero vuelve a Inicio.', ...EN_INICIO, foco: FOCOS.entradaSecretaria },
	{ desde: 249, texto: 'No es un fallo: sólo entran superusuarios, docentes y coordinadores.', ...EN_INICIO },
	{ desde: T.llegaLaOtra, texto: 'Con superusuario, la misma entrada sí abre.', ...EN_EL_MENU, foco: FOCOS.entradaB, focoHasta: T.pulsaEntradaB - 2 },
	{ desde: T.montaB, texto: 'Elige un grupo, o «Mostrar los NO asignados».', voz: 'Elige un grupo, o muestra los no asignados.', ...EN_ACUDIENTES, foco: FOCOS.filtros, focoHasta: T.pulsaGrupo - 2 },
	{ desde: 673, texto: 'Una fila por acudiente, con su cuenta y datos.', ...EN_ACUDIENTES, foco: FOCOS.rejilla },
	{ desde: 801, texto: 'El botón de la fila enseña sus alumnos.', ...EN_ACUDIENTES, foco: FOCOS.boton },
];

export const AVISO = { desde: T.inicio, dura: 150, texto: 'Esa pantalla no es para tu perfil.' };

export const TARJETA = 909;
export const DURACION = TARJETA + 120;

export const CLAVE = 'acudientes';
export const TITULO = 'Acudientes';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está, y por qué no deja entrar' },
	{ desde: T.llegaLaOtra, titulo: 'Quién sí entra: la lista por grupo' },
];

export const CIERRE: Cierre = {
	hiciste: 'Viste por qué la entrada de Acudientes devuelve a una secretaria a Inicio.',
	seVe: '«Esa pantalla no es para tu perfil.»; con superusuario, los acudientes del grupo.',
	despues: 'Siguiente: editar docentes y contratar.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[1].desde !== AVISO.desde) {
	throw new Error('Guion: el aviso de la puerta no cae donde empieza el paso que lo explica.');
}
