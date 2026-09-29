import React from 'react';

import { opcionesDeGrupos } from '../montar-el-ano/opciones';
import { avance, entre, finDelTecleo, parpadea, tecleado } from '../montar-el-ano/tiempo';
import type { EstadoDirectorio } from '../secretaria/Directorio';
import { NOVENO_B } from '../secretaria/personas';
import type { Candidato, EstadoNuevo } from './NuevoAlumno';
import { disposicionNuevo, maxDesplazada } from './plano';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «CREAR UN ALUMNO»: lo que se ve, fotograma a fotograma. Todo inventado.
 *
 * El alumno nuevo es Juan Pablo Ríos Arango, que entra a 1°A. Y en el colegio ya hubo OTRO Juan
 * Pablo Ríos Arango: nació en 2010, estuvo en 6°A hasta 2023 y se retiró. Mismo nombre, otra
 * persona: el caso exacto en el que el freno salta y hay que pulsar «No es ninguno de éstos».
 */

export const NUEVO = { nombres: 'Juan Pablo', apellidos: 'Ríos Arango', grupo: '1°A' };

export const CANDIDATO: Candidato = {
	nombre: 'Juan Pablo Ríos Arango',
	marca: 'Mismo nombre',
	tipo: 'hombre',
	variante: 3,
	doc: 'Tarjeta de identidad 1000003187 · nac. 2010-05-12',
	historia: React.createElement(
		React.Fragment,
		null,
		'2 matrículas · última en ',
		React.createElement('b', null, '6°A (2023)'),
		', retirado · 16 notas definitivas',
	),
};

/* ── Los tiempos ───────────────────────────────────────────────────────────────────────────── */

export const M = {
	cursorEntra: 20,
	llegaPersonas: 58,
	pulsaPersonas: 64,
	abrePersonas: 66,
	llegaAlumnos: 100,
	pulsaAlumnos: 110,
	montaDirectorio: 114,

	llegaCrearAlumno: 150,
	pulsaCrearAlumno: 160,
	/** El directorio se apaga en 14 y la ficha entra después: no se desmonta a mitad de salida. */
	montaNuevo: 178,

	llegaNombres: 200,
	pulsaNombres: 208,
	tecleaNombres: 216,
	llegaApellidos: 266,
	pulsaApellidos: 274,
	tecleaApellidos: 282,
	/** Se calcula abajo: 300 ms después de la última tecla, más la ida y vuelta. */
	tarjeta: 0,

	llegaEsEste: 505,
	bajaDesde: 563,
	bajaHasta: 593,

	llegaEscape: 735,
	pulsaEscape: 749,

	llegaGrupo: 856,
	pulsaGrupo: 866,
	llegaOpcion: 890,
	pulsaOpcion: 900,

	llegaCrear: 962,
	pulsaCrear: 970,
	creado: 988,
};

/** `esperar('parecidos')` espera 300 ms sin teclear (`alumnos-nuevo.ts:668-672`); la consulta vuelve en 0,4 s. */
export const DEBOUNCE = 9;
export const IDA_Y_VUELTA = 12;
export const FIN_NOMBRES = finDelTecleo(NUEVO.nombres, M.tecleaNombres);
export const FIN_APELLIDOS = finDelTecleo(NUEVO.apellidos, M.tecleaApellidos);
M.tarjeta = FIN_APELLIDOS + DEBOUNCE + IDA_Y_VUELTA;

/* ── El directorio (sólo de paso: se llega por él) ─────────────────────────────────────────── */

export function estadoDirectorioEn(f: number): EstadoDirectorio {
	return {
		grupo: '9B',
		filas: NOVENO_B.map((a) => ({ alumno: a, estado: 'Matr' as const })),
		encimaCabecera: entre(f, M.llegaCrearAlumno, M.pulsaCrearAlumno + 12) ? 0 : null,
		opacidad: 1 - avance(f, M.pulsaCrearAlumno, M.pulsaCrearAlumno + 14),
	};
}

/* ── La ficha nueva ────────────────────────────────────────────────────────────────────────── */

const OPCIONES = opcionesDeGrupos(null, 5);
export const OPCION_1A = OPCIONES.findIndex((o) => o.texto === NUEVO.grupo);

const DESPLAZADA_ABAJO = maxDesplazada(disposicionNuevo(true));

export function estadoNuevoEn(f: number): EstadoNuevo {
	const creado = f >= M.creado;
	const descartado = f >= M.pulsaEscape;
	const conTarjeta = !creado && f >= M.tarjeta;

	const activo = creado ? null : f >= M.pulsaApellidos && f < M.pulsaEscape ? 'apellidos' : f >= M.pulsaNombres && f < M.pulsaApellidos ? 'nombres' : null;
	const tarjeta = conTarjeta ? { frena: !descartado, aparece: avance(f, M.tarjeta, M.tarjeta + 8), candidato: CANDIDATO } : null;

	/* La página baja para enseñar el pie y, al quitar el freno, el navegador la recorta a lo que mide. */
	const quiere = avance(f, M.bajaDesde, M.bajaHasta) * DESPLAZADA_ABAJO;
	const d = disposicionNuevo(tarjeta ? tarjeta.frena : null);
	const desplazada = Math.min(quiere, maxDesplazada(d));

	const abierto = f >= M.pulsaGrupo + 2 && f < M.pulsaOpcion;

	return {
		nombres: creado ? '' : tecleado(f, NUEVO.nombres, M.tecleaNombres),
		apellidos: creado ? '' : tecleado(f, NUEVO.apellidos, M.tecleaApellidos),
		activo,
		cursor: parpadea(f),
		tarjeta,
		encimaFicha: entre(f, M.llegaEsEste, M.llegaEsEste + 35) ? 1 : null,
		encimaEscape: entre(f, M.llegaEscape, M.pulsaEscape + 6),
		grupo: !creado && f >= M.pulsaOpcion ? NUEVO.grupo : null,
		grupoAbierto: abierto
			? { opciones: OPCIONES, aparece: avance(f, M.pulsaGrupo + 2, M.pulsaGrupo + 10), resaltada: f >= M.llegaOpcion - 8 ? OPCION_1A : null }
			: null,
		encimaCrear: entre(f, M.llegaCrear, M.creado),
		cargando: entre(f, M.pulsaCrear, M.creado),
		giro: (f - M.pulsaCrear) * 24,
		desplazada,
		opacidad: avance(f, M.montaNuevo, M.montaNuevo + 12),
	};
}
