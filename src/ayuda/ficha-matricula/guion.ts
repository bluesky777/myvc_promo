import { Punto } from '../../comunes/Cursor';
import { escrito } from '../../comunes/movimiento';
import { impresoDe } from '../cierre-6/datos-catalogo';
import { acercamientoAUnaHoja } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { EN_EL_MENU, EN_INFORMES, FOCO_INFORMES, LLEGADA, PUNTOS_DE_LLEGADA, enElPlano, foco, holgura, punto, union } from '../informes/Comun';
import { MESA, Rect, Valores, disponer, rectDeFicha } from '../informes/datos';
import { SEPTIMO_A, nombreDe } from '../informes/gente';
import { rectDeOpcion } from '../informes/Piezas';
import { HOJA, RECTS, Y } from './Ficha';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SECRETARÍA: «LA FICHA DE MATRÍCULA». Serie «informes».
 *
 * LA DUDA QUE MATA (PLAN §4.F): «abrirla crea los requisitos que falten: es de UN alumno, nunca de
 * un grupo». Confirmado en `ficha-matricula.ts`, cabecera: `PUT alumnos/show` «NO ES UNA LECTURA:
 * INSERTA» --le crea al alumno las filas de requisitos que le falten para su año-- y «por eso este
 * informe es de UN alumno y no de un grupo». El configurador pide `grupo` y `alumno`, en ese orden
 * («la lista de estudiantes cuelga del grupo»), y NUNCA «¿Para quién?» (`impresos.ts`).
 *
 * El papel: membrete «Ficha de matrícula · Año lectivo», la franja con foto y matrícula, «Datos del
 * estudiante», «Acudientes», «Requisitos de matrícula» (Sí / No aplica / ☐) y el pie con la
 * declaración, tres firmas y la huella.
 *
 * 39 s, con voz.
 */

export const FPS = 30;

export const T = {
	llegaBuscador: 124,
	pulsaBuscador: 134,
	teclea: 142,
	llegaFicha: 212,
	pulsaFicha: 224,
	llegaGrupo: 256,
	abreGrupo: 266,
	llegaOpcion: 280,
	eligeGrupo: 292,
	llegaAlumno: 310,
	abreAlumno: 320,
	llegaOpcionAl: 334,
	eligeAlumno: 346,
	llegaCargar: 490,
	pulsaCargar: 502,
	monta: 508,
	trae: 530,
	cursorSale: 580,
	seVa: 630,
	plano: 636,
	plano2: 758,
};
export const POR_TECLA = 3;
export const BUSCA = 'ficha de matricula';

export const IMPRESO = impresoDe('ficha-matricula');
export const GRUPOS_VISIBLES = ['5°A', '6°A', '6°B', '7°A', '7°B', '8°A'];
export const ALUMNOS_VISIBLES = SEPTIMO_A.slice(0, 6).map(nombreDe);

export const consulta = (f: number) => escrito(f, BUSCA, T.teclea, POR_TECLA);
export const valores = (f: number): Valores => ({ grupo: f >= T.eligeGrupo ? '7°A' : null, alumno: f >= T.eligeAlumno ? ALUMNOS_VISIBLES[1] : null });
export const estadoEn = (f: number) => ({ consulta: consulta(f), familia: 'todo' as const, elegida: f >= T.pulsaFicha ? IMPRESO.clave : null, valores: valores(f), ajustes: { hoja: 0 } });

/* ── Geometría ────────────────────────────────────────────────────────────────────────────── */

const D_BUSCA = disponer(estadoEn(T.teclea + BUSCA.length * POR_TECLA));
const D_GRUPO = disponer(estadoEn(T.pulsaFicha));
const D_ALUMNO = disponer(estadoEn(T.eligeGrupo));
const D_LISTO = disponer(estadoEn(T.eligeAlumno));

export const EN_LA_MESA = { x: (MESA.ancho - HOJA.ancho) / 2, y: 18 };
const enLaMesa = (r: Rect): Rect => ({ ...r, x: MESA.x + EN_LA_MESA.x + r.x, y: MESA.y + EN_LA_MESA.y + r.y });

/** De cerca: la mitad de arriba (datos y acudientes) y la de abajo (requisitos y firmas). */
export const ARRIBA = acercamientoAUnaHoja(HOJA, { y: 20, alto: Y.requisitos - 24 });
export const ABAJO = acercamientoAUnaHoja(HOJA, { y: Y.requisitos - 40, alto: HOJA.alto - Y.requisitos + 34 });

const campoGrupo = D_GRUPO.conf!.campos.grupo!;
const campoAlumno = D_ALUMNO.conf!.campos.alumno!;

export const FOCOS = {
	informes: FOCO_INFORMES,
	buscador: foco(holgura(union(D_BUSCA.buscador, rectDeFicha(D_BUSCA, IMPRESO.clave)), 6)),
	campos: foco(holgura(union({ ...campoGrupo, y: campoGrupo.y - 26 }, D_LISTO.conf!.campos.alumno!), 8)),
	cargar: foco(holgura(union({ ...campoGrupo, y: campoGrupo.y - 26 }, D_LISTO.conf!.cargar), 8)),
	hoja: foco(holgura(enLaMesa({ x: 0, y: 0, ancho: HOJA.ancho, alto: 700 }), 2)),
	datos: enElPlano(ARRIBA, { ...RECTS.datos, x: RECTS.datos.x - 6, y: RECTS.datos.y - 6, ancho: RECTS.datos.ancho + 12, alto: RECTS.datos.alto + RECTS.acudientes.alto + 18 }),
	requisitos: enElPlano(ABAJO, { x: RECTS.requisitos.x - 6, y: RECTS.requisitos.y - 6, ancho: RECTS.requisitos.ancho + 12, alto: RECTS.requisitos.alto + 6 }),
	pie: enElPlano(ABAJO, { x: RECTS.pie.x - 6, y: RECTS.pie.y - 6, ancho: RECTS.pie.ancho + 12, alto: RECTS.pie.alto + 14 }),
};

const P = {
	buscador: punto(D_BUSCA.buscador, -200),
	ficha: punto(rectDeFicha(D_BUSCA, IMPRESO.clave), 30),
	grupo: punto(campoGrupo, 60),
	opcion: punto(rectDeOpcion(campoGrupo, 3), -40),
	alumno: punto(campoAlumno, 60),
	opcionAl: punto(rectDeOpcion(campoAlumno, 1), -40),
	cargar: punto(D_LISTO.conf!.cargar, 40),
};

export const PUNTOS: Punto[] = [
	...PUNTOS_DE_LLEGADA,
	{ frame: T.llegaBuscador, ...P.buscador },
	{ frame: T.pulsaBuscador + 6, ...P.buscador },
	{ frame: T.teclea + 30, x: P.buscador.x + 60, y: P.buscador.y + 150 },
	{ frame: T.llegaFicha, ...P.ficha },
	{ frame: T.pulsaFicha + 6, ...P.ficha },
	{ frame: T.llegaGrupo, ...P.grupo },
	{ frame: T.abreGrupo + 4, ...P.grupo },
	{ frame: T.llegaOpcion, ...P.opcion },
	{ frame: T.eligeGrupo + 4, ...P.opcion },
	{ frame: T.llegaAlumno, ...P.alumno },
	{ frame: T.abreAlumno + 4, ...P.alumno },
	{ frame: T.llegaOpcionAl, ...P.opcionAl },
	{ frame: T.eligeAlumno + 30, ...P.opcionAl },
	{ frame: T.llegaCargar - 20, ...P.opcionAl },
	{ frame: T.llegaCargar, ...P.cargar },
	{ frame: T.pulsaCargar + 30, ...P.cargar },
	{ frame: T.cursorSale - 10, x: P.cargar.x - 300, y: P.cargar.y + 60 },
];

export const CLICS = [LLEGADA.pulsaInformes, T.pulsaBuscador, T.pulsaFicha, T.abreGrupo, T.eligeGrupo, T.abreAlumno, T.eligeAlumno, T.pulsaCargar];

export function senal(f: number): string | null {
	const entre = (a: number, b: number) => f >= a && f < b;
	if (entre(T.llegaBuscador, T.pulsaBuscador)) { return 'buscador'; }
	if (entre(T.llegaFicha, T.pulsaFicha + 8)) { return `ficha-${IMPRESO.clave}`; }
	if (entre(T.llegaGrupo, T.abreGrupo)) { return 'campo-grupo'; }
	if (entre(T.llegaAlumno, T.abreAlumno)) { return 'campo-alumno'; }
	if (entre(T.llegaCargar, T.pulsaCargar + 4)) { return 'cargar'; }
	return null;
}

export function desplegable(f: number) {
	if (f >= T.abreGrupo && f < T.eligeGrupo + 4) {
		return { campo: 'grupo' as const, opciones: GRUPOS_VISIBLES, senalada: f >= T.llegaOpcion ? 3 : null, elegida: f >= T.eligeGrupo ? 3 : null, desde: T.abreGrupo };
	}
	if (f >= T.abreAlumno && f < T.eligeAlumno + 4) {
		return { campo: 'alumno' as const, opciones: ALUMNOS_VISIBLES, senalada: f >= T.llegaOpcionAl ? 1 : null, elegida: f >= T.eligeAlumno ? 1 : null, desde: T.abreAlumno };
	}
	return null;
}

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_LA_FICHA = { ubicacion: 'Menú ▸ Informes ▸ Ficha de matrícula del alumno', url: '/informes/ficha-matricula/2107' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'La ficha de matrícula se saca en Informes.', ...EN_EL_MENU, foco: FOCO_INFORMES, focoHasta: LLEGADA.pulsaInformes + 16 },
	{ desde: 120, texto: 'Búscala: «ficha de matricula» la encuentra.', ...EN_INFORMES, foco: FOCOS.buscador, focoHasta: T.pulsaFicha },
	{ desde: 248, texto: 'Pide el grupo y, después, el estudiante.', ...EN_INFORMES, foco: FOCOS.campos },
	{ desde: 380, texto: 'Es de uno en uno: abrirla crea los requisitos que falten.', ...EN_INFORMES, foco: FOCOS.cargar, focoHasta: T.pulsaCargar + 4 },
	{ desde: 519, texto: 'Sale una hoja para firmar, con todo lo suyo.', ...EN_LA_FICHA, foco: FOCOS.hoja, focoHasta: T.seVa - 10 },
	{ desde: 639, texto: 'Arriba, sus datos y los de sus acudientes.', ...EN_LA_FICHA, foco: FOCOS.datos, focoHasta: T.plano2 - 8 },
	{ desde: 762, texto: 'Requisitos del año: «Sí», «No aplica» o casilla para marcar.', ...EN_LA_FICHA, foco: FOCOS.requisitos },
	{ desde: 925, texto: 'Al pie, las tres firmas y la huella.', ...EN_LA_FICHA, foco: FOCOS.pie },
];

/* El foco de la hoja se enciende cuando la hoja llega (`trae`), no sobre el «Cargando…». */
export const FOCO_DESDE: Record<number, number> = { 4: T.trae };

export const TARJETA = 1035;
export const DURACION = 1155;

export const CLAVE = 'ficha-matricula';
export const TITULO = 'La ficha de matrícula';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Buscarla' },
	{ desde: PASOS[2].desde, titulo: 'Un alumno, no un grupo' },
	{ desde: PASOS[4].desde, titulo: 'La hoja: datos, requisitos y firmas' },
];

export const CIERRE: Cierre = {
	hiciste: `Sacaste la ficha de matrícula de ${nombreDe(SEPTIMO_A[1])}.`,
	seVe: 'Datos, acudientes, requisitos y las firmas, en una hoja.',
	despues: 'Siguiente: la constancia de estudio.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

const dentro = (f: number, i: number) => f >= PASOS[i].desde && (i + 1 >= PASOS.length || f < PASOS[i + 1].desde);
if (!dentro(T.pulsaFicha, 1) || !dentro(T.eligeAlumno, 2) || !dentro(T.pulsaCargar, 3)) {
	throw new Error('Guion: un clic cae fuera del paso que lo explica.');
}
