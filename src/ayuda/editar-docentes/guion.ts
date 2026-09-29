import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, LLEGADA, MENU_SECRETARIA, centro, crece, foco, puntoDelMenu, rectDelMenu } from '../personas/comun';
import { ACCION_CONTRATADOS, BOTON_CONTRATO, CELDA_TODOS, COLUMNA_CONTRATO, DOCENTES, EL_NUEVO, FILA_CONTRATADOS, PISTA } from './Pantalla';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SECRETARÍA: «EDITAR DOCENTES Y CONTRATAR».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     1. **Editar la ficha es de superusuario.** `puedeEditar = is_superuser === 1`
 *        (`profesores.ts:320`): sin eso no hay «Nuevo profesor», las celdas no se editan, el
 *        usuario y la cuenta activa van de sólo lectura, y la pantalla lo dice («Sólo un
 *        superusuario puede editar la ficha de un docente, así que aquí se ve pero no se toca»).
 *     2. **Contratar es la columna del año.** «Contrato 2026» es un botón por fila («Contratar» /
 *        «Rescindir») que NO depende del superusuario: sólo se apaga con el año cerrado
 *        (`soloLectura`, `noSePuedeEscribirEnEsteAnio`). Y `ContratosController::postIndex` no
 *        mira el rol: sólo exige poder escribir en el año. Al contratar sale «X contratado para
 *        este año» y la fila aparece abajo, en «Contratados para 2026».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA      Personas -> Editar docentes (menú de secretaria)
 *     2. LO QUE NO TOCA  la pista de sólo lectura
 *     3. CONTRATAR       Camilo Andrés, el nuevo: el botón, el aviso, y la rejilla de abajo
 *
 * NO SE PULSA EL LÁPIZ: abre `/profesores/editar/:id`, cuya ruta pide `esAdmin` (una secretaria
 * vuelve a Inicio). El vídeo dice lo que dice la pista, que la ficha es de superusuario, y no
 * enseña el rebote, que ya sale en el vídeo de acudientes.
 */

export const FPS = 30;
const MENU = MENU_SECRETARIA;

export const T = {
	...LLEGADA,
	/* La llegada por el menú, apretada (como en alumnos-directorio): el camino se ve entero. */
	cursorEntra: 12,
	llegaPersonas: 34,
	pulsaPersonas: 40,
	abrePersonas: 42,
	llegaEntrada: 70,
	pulsaEntrada: 80,
	monta: 84,
	llegaContrato: 383,
	pulsaContrato: 403,
	/** La ida y vuelta del POST. */
	contratado: 418,
	bajaDesde: 513,
	bajaHasta: 553,
	llegaAccion: 728,
	cursorSale: 838,
};

export const BAJA = 230;

const nuevo = DOCENTES[EL_NUEVO];
/** En «Contratados» entra al final (`[...lista, contrato]`): detrás de los cuatro que ya estaban. */
const filaNueva = DOCENTES.filter((d) => d.contratado).length;

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	personas: puntoDelMenu(MENU, null, false),
	docentes: puntoDelMenu(MENU, 'Editar docentes', true),
	contrato: centro(BOTON_CONTRATO(EL_NUEVO)),
	accion: centro(ACCION_CONTRATADOS(filaNueva, 1, BAJA)),
};

export const FOCOS = {
	personas: foco(rectDelMenu(MENU, null, false), 8),
	pista: foco(crece(PISTA(), 6), 8),
	columna: foco(crece(COLUMNA_CONTRATO(), 2), 8),
	celda: foco(crece({ ...CELDA_TODOS(EL_NUEVO, 'nombres'), ancho: CELDA_TODOS(EL_NUEVO, 'contrato').x + 145 - CELDA_TODOS(EL_NUEVO, 'nombres').x }, 2), 8),
	filaNueva: foco(crece(FILA_CONTRATADOS(filaNueva, BAJA), 2), 8),
	lapiz: foco(crece(ACCION_CONTRATADOS(filaNueva, 0, BAJA), 3), 8),
	quitar: foco(crece(ACCION_CONTRATADOS(filaNueva, 1, BAJA), 3), 8),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Personas', url: 'micolegio.micolevirtual.com/up2/' };
const EN_DOCENTES = { ubicacion: 'Menú ▸ Personas ▸ Editar docentes', url: '/profesores' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Está en Personas, Editar docentes.', ...EN_EL_MENU, foco: FOCOS.personas, focoHasta: T.pulsaPersonas + 16 },
	{ desde: 125, texto: 'Sin superusuario, la ficha se ve pero no se toca.', ...EN_DOCENTES, foco: FOCOS.pista },
	{ desde: 256, texto: 'Contratar no pide superusuario: columna Contrato 2026.', ...EN_DOCENTES, foco: FOCOS.columna, focoHasta: T.pulsaContrato - 4 },
	{ desde: T.contratado, texto: `${nuevo.nombres} queda contratado: el botón dice Rescindir.`, ...EN_DOCENTES, foco: FOCOS.celda, focoHasta: T.bajaDesde - 4 },
	{ desde: 553, texto: 'Y aparece abajo, en Contratados para 2026.', ...EN_DOCENTES, foco: FOCOS.filaNueva },
	{ desde: 697, texto: 'Para quitarle el año: Rescindir arriba, o este botón abajo.', ...EN_DOCENTES, foco: FOCOS.quitar },
];

export const AVISO = { desde: T.contratado, dura: 150, texto: `${nuevo.nombres} contratado para este año` };

export const TARJETA = 848;
export const DURACION = TARJETA + 120;

export const CLAVE = 'editar-docentes';
export const TITULO = 'Editar docentes y contratar';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está, y qué no se toca' },
	{ desde: 256, titulo: 'Contratar para el año' },
	{ desde: 553, titulo: 'Contratados para 2026' },
];

export const CIERRE: Cierre = {
	hiciste: `Contrataste a ${nuevo.nombres} ${nuevo.apellidos} para 2026 sin ser superusuaria.`,
	seVe: `Sale «${AVISO.texto}» y su fila, abajo, en «Contratados para 2026».`,
	despues: 'Siguiente: certificados de un alumno.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[3].desde !== T.contratado || T.contratado - T.pulsaContrato !== 15) {
	throw new Error('Guion: el aviso del contrato no cae donde empieza su paso.');
}
