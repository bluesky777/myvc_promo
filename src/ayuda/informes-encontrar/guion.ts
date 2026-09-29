import { Punto } from '../../comunes/Cursor';
import { escrito } from '../../comunes/movimiento';
import { ClaveFamilia } from '../cierre-6/datos-catalogo';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { EN_EL_MENU, EN_INFORMES, FOCO_INFORMES, LLEGADA, PUNTOS_DE_LLEGADA, foco, holgura, punto, union } from '../informes/Comun';
import { Disposicion, INF, Rect, disponer, rectDeFicha, rectDePastilla } from '../informes/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * INFORMES: «ENCONTRAR EL PAPEL QUE NECESITAS». Serie «informes».
 *
 * LA DUDA QUE MATA (PLAN §4.D): el buscador entiende los sinónimos --«sábana», «paz y salvo»-- y
 * las nueve familias son un FILTRO, no una puerta.
 *
 * Todo sale de `catalogo-informes.ts` e `impresos.ts`, y se comprobó contra el código:
 *   · `casa()`: todas las palabras, sin tildes y en minúscula, sobre nombre + «para» + sinónimos.
 *     «sabana» sólo encuentra el consolidado; «paz y salvo», sólo «Cartera por grupo»; «boletas»,
 *     nada (probado con la misma cuenta, `buscarImpresos`, sobre las 63 entradas).
 *   · Las pastillas cuentan CON la búsqueda puesta, y las que se quedan en cero no se pintan
 *     (`@if (cuentas().get(f.clave))`).
 *   · Lo que vive en otra pantalla lleva «Vive fuera» en la tarjeta, una nota en el configurador y
 *     un botón que dice adónde va: «Abrir «Definitivas por periodo»».
 *   · Sin resultados: «Nada se llama así. Prueba con boletín, planilla, certificado, quién falta o
 *     puestos.»
 *   · La ficha elegida se queda elegida aunque la búsqueda la esconda (`impresoElegido` busca en
 *     todo el catálogo), y por eso el configurador no se vacía al volver a buscar.
 *
 * CINCO ACTOS: llegar · las familias filtran · buscar «sabana» · «Vive fuera» · «paz y salvo» y la
 * búsqueda sin resultados. 45 s, con voz.
 */

export const FPS = 30;

export const T = {
	llegaQuienVino: 258,
	pulsaQuienVino: 270,
	llegaTodo: 388,
	pulsaTodo: 400,
	llegaBuscador: 490,
	pulsaBuscador: 500,
	teclea1: 510,
	llegaFicha: 852,
	pulsaFicha: 864,
	llegaBorrar1: 970,
	pulsaBorrar1: 980,
	teclea2: 990,
	llegaCartera: 1044,
	pulsaCartera: 1056,
	llegaBorrar2: 1100,
	pulsaBorrar2: 1110,
	teclea3: 1120,
	cursorSale: 1185,
};
export const POR_TECLA = 4;

export const BUSCA1 = 'sabana';
export const BUSCA2 = 'paz y salvo';
export const BUSCA3 = 'boletas';

/* ── Lo que hay en pantalla en cada fotograma ─────────────────────────────────────────────── */

export interface Momento {
	consulta: string;
	familia: ClaveFamilia | 'todo';
	elegida: string | null;
	elegidaDesde: number;
	/** Cuándo se pintó por última vez la lista (cada tecla, cada pastilla). */
	listaDesde: number;
	buscadorConFoco: boolean;
}

const tecleado = (frame: number, texto: string, desde: number) => escrito(frame, texto, desde, POR_TECLA);
const desdeLaTecla = (frame: number, texto: string, desde: number) =>
	frame < desde ? desde : desde + Math.min(texto.length, Math.floor((frame - desde) / POR_TECLA)) * POR_TECLA;

export function momento(frame: number): Momento {
	let consulta = '';
	let listaDesde = LLEGADA.monta + 6;
	if (frame >= T.pulsaBorrar2) {
		consulta = tecleado(frame, BUSCA3, T.teclea3);
		listaDesde = frame < T.teclea3 ? T.pulsaBorrar2 : desdeLaTecla(frame, BUSCA3, T.teclea3);
	} else if (frame >= T.pulsaBorrar1) {
		consulta = tecleado(frame, BUSCA2, T.teclea2);
		listaDesde = frame < T.teclea2 ? T.pulsaBorrar1 : desdeLaTecla(frame, BUSCA2, T.teclea2);
	} else if (frame >= T.teclea1) {
		consulta = tecleado(frame, BUSCA1, T.teclea1);
		listaDesde = desdeLaTecla(frame, BUSCA1, T.teclea1);
	}
	let familia: ClaveFamilia | 'todo' = 'todo';
	if (frame >= T.pulsaQuienVino && frame < T.pulsaTodo) {
		familia = 'asistencia';
		listaDesde = T.pulsaQuienVino;
	} else if (frame >= T.pulsaTodo && frame < T.teclea1) {
		listaDesde = T.pulsaTodo;
	}
	const elegida = frame >= T.pulsaCartera ? 'cartera' : frame >= T.pulsaFicha ? 'consolidado' : null;
	const elegidaDesde = frame >= T.pulsaCartera ? T.pulsaCartera : T.pulsaFicha;
	/* El cursor se va de la caja al pulsar una ficha, y vuelve con el aspa de borrar (`cajaBusqueda.focus()`). */
	const buscadorConFoco = (frame >= T.pulsaBuscador && frame < T.pulsaFicha) || (frame >= T.pulsaBorrar1 && frame < T.pulsaCartera) || frame >= T.pulsaBorrar2;
	return { consulta, familia, elegida, elegidaDesde, listaDesde, buscadorConFoco };
}

const d = (consulta: string, familia: ClaveFamilia | 'todo' = 'todo', elegida: string | null = null): Disposicion =>
	disponer({ consulta, familia, elegida, valores: {} });

const D_TODO = d('');
const D_QUIEN = d('', 'asistencia');
const D_SABANA = d(BUSCA1);
const D_SABANA_ELEGIDA = d(BUSCA1, 'todo', 'consolidado');
const D_PAZ = d(BUSCA2, 'todo', 'consolidado');
const D_PAZ_ELEGIDA = d(BUSCA2, 'todo', 'cartera');
const D_NADA = d(BUSCA3, 'todo', 'cartera');

/** El aspa de «Borrar la búsqueda», al final de la caja. */
const borrar = (dd: Disposicion): Rect => ({ x: dd.buscador.x + dd.buscador.ancho - 40, y: dd.buscador.y + 7, ancho: 36, alto: 36 });

const configDe = (dd: Disposicion): Rect => ({ ...dd.config });
const listaDe = (dd: Disposicion): Rect => {
	const s = dd.secciones[0];
	const ultima = s.fichas[s.fichas.length - 1].rect;
	return { x: s.fichas[0].rect.x, y: s.y, ancho: dd.secciones[0].fichas.length > 1 ? s.fichas[1].rect.x + s.fichas[1].rect.ancho - s.fichas[0].rect.x : s.fichas[0].rect.ancho, alto: ultima.y + ultima.alto - s.y };
};

export const FOCOS = {
	informes: FOCO_INFORMES,
	pastillas: foco(holgura(union(...D_TODO.pastillas.map((p) => p.rect)), 6)),
	quienVino: foco(holgura(listaDe(D_QUIEN), 8)),
	todo: foco(holgura(rectDePastilla(D_TODO, 'todo'), 4), 20),
	buscador: foco(holgura(D_TODO.buscador, 4)),
	ficha: foco(holgura(rectDeFicha(D_SABANA, 'consolidado'), 6)),
	pastillasSabana: foco(holgura(union(...D_SABANA.pastillas.map((p) => p.rect)), 6), 20),
	configFuera: foco(holgura(union(D_SABANA_ELEGIDA.conf!.nota!, D_SABANA_ELEGIDA.conf!.cargar), 8)),
	cartera: foco(holgura(rectDeFicha(D_PAZ, 'cartera'), 6)),
	nada: foco({ x: 18, y: D_NADA.tarjeta.y + D_NADA.tarjeta.alto + INF.trasTarjeta - 10, ancho: 700, alto: 46 }),
};

const P = {
	quienVino: punto(rectDePastilla(D_TODO, 'asistencia')),
	todo: punto(rectDePastilla(D_QUIEN, 'todo')),
	buscador: punto(D_TODO.buscador, -200),
	ficha: punto(rectDeFicha(D_SABANA, 'consolidado'), 40),
	borrar1: punto(borrar(D_SABANA_ELEGIDA)),
	cartera: punto(rectDeFicha(D_PAZ, 'cartera'), 40),
	borrar2: punto(borrar(D_PAZ_ELEGIDA)),
};

export const PUNTOS: Punto[] = [
	...PUNTOS_DE_LLEGADA,
	{ frame: T.llegaQuienVino - 30, x: P.quienVino.x - 60, y: P.quienVino.y + 90 },
	{ frame: T.llegaQuienVino, ...P.quienVino },
	{ frame: T.pulsaQuienVino + 20, ...P.quienVino },
	{ frame: T.llegaTodo - 18, ...P.quienVino },
	{ frame: T.llegaTodo, ...P.todo },
	{ frame: T.pulsaTodo + 20, ...P.todo },
	{ frame: T.llegaBuscador - 18, ...P.todo },
	{ frame: T.llegaBuscador, ...P.buscador },
	{ frame: T.pulsaBuscador + 10, ...P.buscador },
	/* Mientras se escribe, el puntero se aparta un poco hacia abajo: no tapa lo que sale. */
	{ frame: T.teclea1 + 30, x: P.buscador.x + 40, y: P.buscador.y + 160 },
	{ frame: T.llegaFicha - 20, x: P.buscador.x + 40, y: P.buscador.y + 160 },
	{ frame: T.llegaFicha, ...P.ficha },
	{ frame: T.pulsaFicha + 20, ...P.ficha },
	{ frame: T.llegaBorrar1 - 18, ...P.ficha },
	{ frame: T.llegaBorrar1, ...P.borrar1 },
	{ frame: T.pulsaBorrar1 + 10, ...P.borrar1 },
	{ frame: T.llegaCartera, ...P.cartera },
	{ frame: T.pulsaCartera + 20, ...P.cartera },
	{ frame: T.llegaBorrar2 - 18, ...P.cartera },
	{ frame: T.llegaBorrar2, ...P.borrar2 },
	{ frame: T.pulsaBorrar2 + 10, ...P.borrar2 },
	{ frame: T.cursorSale - 20, x: P.borrar2.x - 80, y: P.borrar2.y + 260 },
];

export const CLICS = [LLEGADA.pulsaInformes, T.pulsaQuienVino, T.pulsaTodo, T.pulsaBuscador, T.pulsaFicha, T.pulsaBorrar1, T.pulsaCartera, T.pulsaBorrar2];

/** Lo que el ratón tiene encima en cada momento. */
export function senal(frame: number): string | null {
	if (frame >= T.llegaQuienVino && frame < T.pulsaQuienVino + 8) { return 'pastilla-asistencia'; }
	if (frame >= T.llegaTodo && frame < T.pulsaTodo + 8) { return 'pastilla-todo'; }
	if (frame >= T.llegaBuscador && frame < T.pulsaBuscador) { return 'buscador'; }
	if (frame >= T.llegaFicha && frame < T.pulsaFicha + 8) { return 'ficha-consolidado'; }
	if (frame >= T.llegaCartera && frame < T.pulsaCartera + 8) { return 'ficha-cartera'; }
	return null;
}

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Todo lo que se imprime está en el menú, en Informes.', ...EN_EL_MENU, foco: FOCOS.informes, focoHasta: LLEGADA.pulsaInformes + 16 },
	{ desde: 134, texto: 'Arriba, nueve familias con su cuenta.', ...EN_INFORMES, foco: FOCOS.pastillas, focoHasta: T.pulsaQuienVino - 20 },
	{ desde: 246, texto: 'Son un filtro: «Quién vino» deja sólo sus tres.', ...EN_INFORMES, foco: FOCOS.quienVino },
	{ desde: 384, texto: '«Todo» los enseña otra vez.', ...EN_INFORMES, foco: FOCOS.todo, focoHasta: T.pulsaTodo + 40 },
	{ desde: 481, texto: 'Busca con tu palabra, aunque no sea la de la pantalla.', ...EN_INFORMES, foco: FOCOS.buscador },
	{ desde: 607, texto: '«sabana», sin tilde, encuentra el consolidado.', ...EN_INFORMES, foco: FOCOS.ficha },
	{ desde: 742, texto: 'Las pastillas cuentan sólo lo que salió.', ...EN_INFORMES, foco: FOCOS.pastillasSabana, focoHasta: T.llegaFicha - 10 },
	{ desde: 849, texto: '«Vive fuera»: el botón te lleva a su pantalla.', ...EN_INFORMES, foco: FOCOS.configFuera },
	{ desde: 967, texto: '«paz y salvo» lleva a Cartera, donde se saca.', ...EN_INFORMES, foco: FOCOS.cartera },
	{ desde: 1097, texto: 'Si nada se llama así, te propone otras palabras.', ...EN_INFORMES, foco: FOCOS.nada },
];

/*
 * Cuándo se enciende el foco, en los pasos donde lo que señala aún no está al empezar el rótulo:
 * la lista se vuelve a pintar tecla a tecla, y un recuadro sobre la ficha de antes (o sobre el hueco)
 * señala lo que el rótulo no dice. Se enciende al terminar de escribir.
 */
export const FOCO_DESDE: Record<number, number> = {
	8: T.teclea2 + BUSCA2.length * POR_TECLA,
	9: T.teclea3 + BUSCA3.length * POR_TECLA,
};

export const TARJETA = 1225;
export const DURACION = 1345;

export const CLAVE = 'informes-encontrar';
export const TITULO = 'Encontrar el papel que necesitas';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde: Informes' },
	{ desde: PASOS[1].desde, titulo: 'Las familias son un filtro' },
	{ desde: PASOS[4].desde, titulo: 'Buscar con tus palabras: «sabana»' },
	{ desde: PASOS[7].desde, titulo: '«Vive fuera»: se saca en otra pantalla' },
	{ desde: PASOS[8].desde, titulo: '«paz y salvo», y cuando no sale nada' },
];

export const CIERRE: Cierre = {
	hiciste: 'Encontraste un papel buscándolo con tus propias palabras.',
	seVe: 'Las pastillas cuentan en qué familia quedó cada resultado.',
	despues: 'Siguiente: los ajustes de impresión.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* Cada clic cae dentro del paso que lo cuenta. */
const dentro = (f: number, i: number) => f >= PASOS[i].desde && (i + 1 >= PASOS.length || f < PASOS[i + 1].desde);
if (!dentro(T.pulsaQuienVino, 2) || !dentro(T.pulsaTodo, 3) || !dentro(T.pulsaFicha, 7) || !dentro(T.pulsaCartera, 8) || !dentro(T.teclea3, 9)) {
	throw new Error('Guion: un clic cae fuera del paso que lo explica.');
}
if (T.teclea1 + BUSCA1.length * POR_TECLA > PASOS[5].desde) {
	throw new Error('Guion: «sabana» no ha terminado de escribirse cuando el rótulo ya lo nombra.');
}
