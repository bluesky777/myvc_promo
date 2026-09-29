import { Easing } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { LLEGADA, avance, entre, parpadea, tecleado } from '../montar-el-ano/tiempo';
import { opcionesDeDocentes } from '../montar-el-ano/opciones';
import { GRADOS, HASTA_LA_IH, type EstadoGrupos, type FichaGrupo } from '../montar-el-ano/planoGrupos';
import type { EstadoAsignaturas } from '../montar-el-ano/planoAsignaturas';
import { AL_ENTRAR, GRUPOS, enElCuadre, grupo } from '../montar-el-ano/reparto';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «CREAR LOS GRUPOS DEL AÑO»: LO QUE SE VE, Y CUÁNDO CAMBIA.
 *
 * LA HISTORIA: el colegio tiene catorce grupos y falta 11°A. Se crea con su grado (Undécimo), su
 * titular (Hernán Darío Vélez Mora), orden 15 e IH semanal 30. Entra al final de la rejilla con 0
 * alumnos y el cupo sin poner --el alta no lo escribe: eso es de la aplicación, no del vídeo--.
 * Después se va a Asignaturas, y el cuadre ya lo nombra: «(11A) 11°A · 0 de 30 h · faltan 30 horas».
 *
 * La fila entra al final y no en su orden porque así lo hace `crear()` (`[...lista, fila]`), sin
 * volver a pedir la lista.
 */

export const G11 = grupo('11°A');
export const ANTES = GRUPOS.filter((g) => g.nombre !== '11°A');

export const M = {
	/* La llegada de siempre, apretada: el camino por el menú se conserva, sólo va más deprisa. */
	...LLEGADA,
	cursorEntra: 14,
	llegaReferencias: 40,
	pulsaReferencias: 46,
	abreReferencias: 48,
	llegaEntrada: 88,
	pulsaEntrada: 98,
	monta: 102,
	llegaCrear: 150,
	pulsaCrear: 158,
	abreFicha: 160,
	llegaNombre: 176,
	pulsaNombre: 182,
	tecleaNombre: 188,
	llegaAbrev: 216,
	pulsaAbrev: 222,
	tecleaAbrev: 228,
	llegaGrado: 252,
	pulsaGrado: 258,
	/* La lista de grados no tiene buscador: se baja con la rueda hasta Undécimo. */
	/*
	 * A velocidad constante y despacio (8 px por fotograma, la fila mide 34): más deprisa, dos
	 * fotogramas separados por uno caen con las filas casi alineadas y el del medio se lee como parpadeo.
	 */
	bajaListaDesde: 268,
	bajaListaHasta: 298,
	llegaOpcionGrado: 308,
	pulsaOpcionGrado: 314,
	llegaTitular: 328,
	pulsaTitular: 334,
	tecleaTitular: 342,
	llegaOpcionTitular: 376,
	pulsaOpcionTitular: 382,
	llegaOrden: 396,
	pulsaOrden: 402,
	tecleaOrden: 408,
	llegaIh: 432,
	pulsaIh: 438,
	tecleaIh: 444,
	llegaCrearFicha: 564,
	pulsaCrearFicha: 572,
	/** `postStore` vuelve: «Grupo 11°A creado», la ficha se cierra y la fila se añade al final. */
	creado: 584,
	bajaDesde: 600,
	bajaHasta: 630,
	llegaBarra: 642,
	agarraBarra: 648,
	sueltaBarra: 678,
	llegaAsignaturas: 878,
	pulsaAsignaturas: 888,
	/** Grupos se va entera antes de que Asignaturas se monte: no se desmonta a mitad de salida. */
	seVaGrupos: 890,
	montaAsignaturas: 910,
};

export const TECLEO = { nombre: '11°A', abrev: '11A', titular: 'Hernán', orden: '15', ih: '30' };

/** Lo que baja la página para ver la última fila y la barra de la rejilla. */
export const BAJADA = 240;
export const VISIBLES_GRADO = 7;
const ALTO_OPCION = 34;

const conCurva = (t: number) => Easing.inOut(Easing.cubic)(t);

export function estadoGruposEn(f: number, fps = 30): EstadoGrupos {
	const creado = f >= M.creado;
	const lista = creado ? GRUPOS : ANTES;
	const baja = avance(f, M.bajaDesde, M.bajaHasta);
	return {
		ficha: f >= M.abreFicha && !creado ? fichaEn(f, fps) : null,
		juntos: { forma: 'vacio' },
		filas: lista.map((g) => ({ nombre: g.nombre, juntos: '', nuevo: g.nombre === '11°A' })),
		desplazada: Math.round(baja * BAJADA),
		desplazadaRejilla: Math.round(conCurva(avance(f, M.agarraBarra, M.sueltaBarra)) * HASTA_LA_IH),
		desplegable: desplegableEn(f, fps),
		encimaCrear: entre(f, M.llegaCrear, M.pulsaCrear + 8),
	};
}

function fichaEn(f: number, fps: number): FichaGrupo {
	const activo = entre(f, M.pulsaNombre, M.pulsaAbrev) ? 'nombre'
		: entre(f, M.pulsaAbrev, M.pulsaGrado) ? 'abrev'
			: entre(f, M.pulsaGrado, M.pulsaOpcionGrado) ? 'grado'
				: entre(f, M.pulsaTitular, M.pulsaOpcionTitular) ? 'titular'
					: entre(f, M.pulsaOrden, M.pulsaIh) ? 'orden'
						: entre(f, M.pulsaIh, M.pulsaCrearFicha) ? 'ih'
							: null;
	const escrito = (texto: string, desde: number) => (f >= desde ? tecleado(f, texto, desde) : '');
	return {
		nombre: escrito(TECLEO.nombre, M.tecleaNombre),
		abrev: escrito(TECLEO.abrev, M.tecleaAbrev),
		grado: f >= M.pulsaOpcionGrado ? G11.grado : null,
		titular: f >= M.pulsaOpcionTitular ? G11.titular : null,
		valormatricula: '0',
		valorpension: '0',
		/* El alta nace con orden 1; al pulsar se selecciona y lo tecleado lo sustituye. */
		orden: f >= M.tecleaOrden ? tecleado(f, TECLEO.orden, M.tecleaOrden) : '1',
		ih: escrito(TECLEO.ih, M.tecleaIh),
		activo,
		cursor: parpadea(f),
		encima: entre(f, M.llegaCrearFicha, M.pulsaCrearFicha + 8),
		aparece: entra(f, fps, M.abreFicha, 12),
	};
}

function desplegableEn(f: number, fps: number): EstadoGrupos['desplegable'] {
	if (entre(f, M.pulsaGrado + 2, M.pulsaOpcionGrado + 2)) {
		const sobran = GRADOS.length - VISIBLES_GRADO;
		const elegida = GRADOS.indexOf(G11.grado);
		return {
			donde: 'grado',
			opciones: GRADOS.map((g) => ({ texto: g })),
			visibles: VISIBLES_GRADO,
			desplazada: Math.round(avance(f, M.bajaListaDesde, M.bajaListaHasta) * sobran * ALTO_OPCION),
			resaltada: f >= M.llegaOpcionGrado - 6 ? elegida : null,
			elegida: f >= M.pulsaOpcionGrado ? elegida : null,
			aparece: entra(f, fps, M.pulsaGrado + 2, 8),
		};
	}
	if (entre(f, M.pulsaTitular + 2, M.pulsaOpcionTitular + 2)) {
		const b = f >= M.tecleaTitular ? tecleado(f, TECLEO.titular, M.tecleaTitular) : null;
		return {
			donde: 'titular',
			opciones: opcionesDeDocentes(b),
			resaltada: 0,
			elegida: f >= M.pulsaOpcionTitular ? 0 : null,
			aparece: entra(f, fps, M.pulsaTitular + 2, 8),
			busqueda: b,
			cursor: parpadea(f),
		};
	}
	return null;
}

/** Asignaturas al llegar: el cuadre ya nombra a 11°A, que tiene IH y ninguna asignatura. */
export const ASIGNATURAS_AL_LLEGAR: EstadoAsignaturas = {
	cuadre: {
		forma: 'lista',
		mensaje: '1 de 15 grupos no cuadra con su intensidad horaria',
		filas: [{ grupo: enElCuadre(G11), cifras: `0 de ${G11.ih} h`, diferencia: `faltan ${G11.ih} horas` }],
	},
	ficha: null,
	filtroGrupo: null,
	filtroProfesor: null,
	viendo: null,
	filas: AL_ENTRAR,
	copia: { origen: null, destino: null },
	papelera: { abierta: false, filas: [] },
};
