import { avance, entre, parpadea, tecleado } from '../montar-el-ano/tiempo';
import type { EstadoDirectorio, FilaDirectorio } from '../secretaria/Directorio';
import { NOVENO_B, OCTAVO_2025, buscar, type Alumno } from '../secretaria/personas';
import { MAIN } from '../secretaria/piezas';
import { anchoTotal } from '../montar-el-ano/Rejilla';
import { ALTO_REJILLA_LISTA, COLUMNAS_DIRECTORIO, disposicionDirectorio } from '../secretaria/planoDirectorio';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «EL DIRECTORIO DE ALUMNOS»: lo que se ve, fotograma a fotograma. Todo inventado.
 *
 * En 9°B, el apellido de Valentina está mal escrito («Escobar Lozno») y se corrige en la celda. Luego
 * Martín Gallego Soto va a la papelera por error, y se saca con el buscador de abajo.
 */

export const CORREGIDA = buscar(NOVENO_B, 'Valentina');
export const FILA_CORREGIDA = NOVENO_B.indexOf(CORREGIDA);
export const MAL = 'Escobar Lozno';
export const BIEN = CORREGIDA.apellidos;

export const BORRADO = buscar(NOVENO_B, 'Martín');
export const FILA_BORRADA = NOVENO_B.indexOf(BORRADO);

/** El otro Martín que sale al buscar: de 5°A, y sin nada que ver. */
const OTRO_MARTIN: Alumno = { ...BORRADO, id: 3877, nombres: 'Martín Elías', apellidos: 'Bustamante Ríos', variante: 4, matricula: '118', documento: '1000003877' };
export const BUSQUEDA = 'Martín';

export const M = {
	cursorEntra: 12,
	llegaPersonas: 34,
	pulsaPersonas: 40,
	abrePersonas: 42,
	llegaAlumnos: 88,
	pulsaAlumnos: 98,
	monta: 102,

	llega9B: 158,
	pulsa9B: 168,
	cargan: 180,

	llegaCelda: 292,
	pulsaCelda: 302,
	/** Tres borrados y cuatro letras, a cuatro fotogramas. */
	borra: 316,
	escribe: 330,
	llegaFuera: 362,
	sale: 372,
	/** `alumnos/guardar-valor` va y vuelve. */
	guardado: 384,

	/* La regla: el puntero se posa en «Reti» (no lo pulsa) mientras suena en rojo. */
	llegaReti: 440,

	/* LA OPCIÓN RÁPIDA, HECHA: se baja, se abre «Ver alumnos sin matrícula», y la página baja con ella. */
	bajaRapidaDesde: 622,
	bajaRapidaHasta: 648,
	llegaSinMatricula: 668,
	pulsaSinMatricula: 680,
	bajaListaDesde: 694,
	bajaListaHasta: 722,
	/* Su rejilla se corre de lado para ver la fecha de retiro de la que se fue, y vuelve. */
	ladoDesde: 790,
	ladoHasta: 812,
	vuelveLadoDesde: 866,
	vuelveLadoHasta: 888,
	/* El año de la barra: antes de «Matric», tiene que ser el nuevo. */
	llegaAno: 916,
	/* «Matric» en la primera fila: el aviso, se va de la lista y entra en la rejilla de arriba. */
	llegaMatric: 1092,
	pulsaMatric: 1104,
	matriculado: 1116,
	subeDesde1: 1250,
	subeHasta1: 1278,

	llegaPapelera: 1296,
	pulsaPapelera: 1330,
	abreBorrar: 1332,
	llegaEliminar: 1366,
	pulsaEliminar: 1378,
	eliminado: 1388,

	bajaDesde: 1442,
	bajaHasta: 1470,
	llegaCaja: 1484,
	pulsaCaja: 1492,
	teclea: 1500,
	llegaPorNombre: 1536,
	pulsaPorNombre: 1546,
	encontrados: 1558,
	bajaMasDesde: 1566,
	bajaMasHasta: 1588,

	llegaRestaurar: 1612,
	pulsaRestaurar: 1622,
	restaurado: 1632,

	subeDesde: 1660,
	subeHasta: 1685,
	llegaRecargar: 1700,
	pulsaRecargar: 1710,
	recargado: 1722,
};

/* ── La lista «sin matrícula» de 9°B: los de 8° de 2025, inventados, y una que se retiró ─────── */

export const SIN_MATRICULA = OCTAVO_2025.slice(0, 3);
/** La que sigue y se matricula: Isabella Montoya. */
export const QUIEN_SIGUE = SIN_MATRICULA[0];
/** La que se retiró el año pasado: sale igual, con su fecha, y se ignora. */
export const RETIRADA = SIN_MATRICULA[1];
export const FECHA_RETIRO = '2025-09-12';
/** Por apellido, «Montoya» cae entre «Londoño» y «Naranjo»: detrás de Valentina y de Martín, que no se mueven. */
export const FILA_QUE_ENTRA = NOVENO_B.findIndex((a) => a.apellidos > QUIEN_SIGUE.apellidos);
/** Cuando entra en la rejilla de arriba: justo después del aviso. */
const ENTRA = M.matriculado + 6;

const VISIBLE = 900 - 96 - 40;
/** Cerrada, la página baja hasta ver el botón de la lista (y la caja de buscar). */
export const DESPLAZADA_RAPIDA = disposicionDirectorio(false, false).fin - VISIBLE;
/** Abierta, lo que haga falta para ver la lista entera. */
const CON_LISTA = disposicionDirectorio(false, false, true, true);
export const DESPLAZADA_LISTA = CON_LISTA.listaRejilla! + ALTO_REJILLA_LISTA + 16 - VISIBLE;
/** La lista sigue abierta el resto del vídeo: el buscador queda debajo de ella. */
export const DESPLAZADA_CAJA = CON_LISTA.fin - VISIBLE;
export const DESPLAZADA_ABAJO = disposicionDirectorio(false, true, true, true).fin - VISIBLE;
/** De lado, lo justo para que «Fecha retiro/deserción» entre entera. */
export const LATERAL = Math.max(0, anchoTotal(COLUMNAS_DIRECTORIO) - MAIN.ancho);

const apellidosEn = (f: number) => {
	if (f < M.borra) { return MAL; }
	if (f < M.escribe) { return MAL.slice(0, MAL.length - Math.min(3, Math.floor((f - M.borra) / 4))); }
	return MAL.slice(0, MAL.length - 3) + tecleado(f, 'zano', M.escribe);
};

export function estadoEn(f: number): EstadoDirectorio {
	const conGrupo = f >= M.pulsa9B;
	const borrado = f >= M.eliminado && f < M.recargado;
	const editando = f >= M.pulsaCelda && f < M.sale;

	const grupo = f >= ENTRA ? [...NOVENO_B.slice(0, FILA_QUE_ENTRA), QUIEN_SIGUE, ...NOVENO_B.slice(FILA_QUE_ENTRA)] : NOVENO_B;
	const filas: FilaDirectorio[] = conGrupo && f >= M.cargan
		? grupo.filter((a) => !(borrado && a === BORRADO)).map((a) => ({
			alumno: a,
			estado: 'Matr' as const,
			valores: a === CORREGIDA ? { apellidos: f < M.sale ? apellidosEn(f) : BIEN } : undefined,
			edicion: a === CORREGIDA && editando ? { clave: 'apellidos' as const, valor: apellidosEn(f), cursor: parpadea(f) } : null,
			encimaAccion: a === BORRADO && entre(f, M.llegaPapelera, M.pulsaPapelera + 8) ? (2 as const) : null,
			encimaEstado: a === BORRADO && entre(f, M.llegaReti, M.bajaRapidaDesde) ? 'Reti' : null,
			/* La que acaba de entrar se enciende un momento, como la fila nueva de la aplicación. */
			opacidad: a === QUIEN_SIGUE ? avance(f, ENTRA, ENTRA + 10) : undefined,
			fondo: a === QUIEN_SIGUE && f < ENTRA + 100 ? `rgba(22,119,255,${0.1 * (1 - avance(f, ENTRA + 70, ENTRA + 100))})` : undefined,
		}))
		: [];

	const sinMatricula = SIN_MATRICULA
		.filter((a) => !(a === QUIEN_SIGUE && f >= M.matriculado + 10))
		.map((a) => ({
			alumno: a,
			retiro: a === RETIRADA ? FECHA_RETIRO : undefined,
			encima: a === QUIEN_SIGUE && entre(f, M.llegaMatric, M.pulsaMatric + 8) ? 'Matric' : null,
			opacidad: a === QUIEN_SIGUE ? 1 - avance(f, M.matriculado, M.matriculado + 10) : undefined,
		}));

	const rapida = (avance(f, M.bajaRapidaDesde, M.bajaRapidaHasta) * DESPLAZADA_RAPIDA + avance(f, M.bajaListaDesde, M.bajaListaHasta) * (DESPLAZADA_LISTA - DESPLAZADA_RAPIDA))
		* (1 - avance(f, M.subeDesde1, M.subeHasta1));
	const busca = (avance(f, M.bajaDesde, M.bajaHasta) * DESPLAZADA_CAJA + avance(f, M.bajaMasDesde, M.bajaMasHasta) * (DESPLAZADA_ABAJO - DESPLAZADA_CAJA))
		* (1 - avance(f, M.subeDesde, M.subeHasta));

	return {
		grupo: conGrupo ? '9B' : null,
		encimaGrupo: entre(f, M.llega9B, M.pulsa9B + 8) ? '9B' : null,
		encimaCabecera: entre(f, M.llegaRecargar, M.pulsaRecargar + 10) ? 4 : null,
		filas,
		desplazada: rapida + busca,
		sinMatricula: {
			abierta: f >= M.pulsaSinMatricula,
			filas: sinMatricula,
			encimaBoton: entre(f, M.llegaSinMatricula, M.pulsaSinMatricula + 8),
			aparece: avance(f, M.pulsaSinMatricula, M.pulsaSinMatricula + 10),
			lateral: (avance(f, M.ladoDesde, M.ladoHasta) - avance(f, M.vuelveLadoDesde, M.vuelveLadoHasta)) * LATERAL,
		},
		buscar: {
			texto: tecleado(f, BUSQUEDA, M.teclea),
			foco: f >= M.pulsaCaja && f < M.pulsaPorNombre,
			cursor: f >= M.pulsaCaja && f < M.pulsaPorNombre && parpadea(f),
			encimaPorNombre: entre(f, M.llegaPorNombre, M.pulsaPorNombre + 8),
			resultados: f >= M.encontrados ? [{ alumno: BORRADO }, { alumno: OTRO_MARTIN }] : [],
			encimaRestaurar: entre(f, M.llegaRestaurar, M.pulsaRestaurar + 10) ? 0 : null,
			aparece: avance(f, M.encontrados, M.encontrados + 8),
		},
		opacidad: avance(f, M.monta, M.monta + 12),
	};
}
