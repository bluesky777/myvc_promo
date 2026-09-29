import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { conPausas } from '../disciplina/pausas';
import { AvisoInfo } from '../ant';
import { EnLaCascaraDe } from '../EnLaCascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { DISCIPLINA, EL_CAMPO, EL_NUEVO, ENTRADA, LA_CORREGIDA } from './datos';
import { EstadoOrdinales, PantallaOrdinales } from './Pantalla';
import { ANIO, CELDA, CIERRE, CONFIGURACION, CREAR, LLEGADA, PASOS, PUNTOS, SCROLL, TARJETA } from './guion';

/* «ORDINALES DEL MANUAL»: encadena, no dibuja. Una sola pantalla dentro de la cáscara. */

const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
/** Una tecla por letra (la descripción, que va a una letra por fotograma, suena una de cada tres). */
const TECLEOS = [
	...[...LA_CORREGIDA.valor].map((_, k) => CELDA.empieza + k * CELDA.porTecla),
	...[...EL_NUEVO.ordinal].map((_, k) => CREAR.empiezaOrdinal + k * 4),
	...[...EL_NUEVO.tipo].map((_, k) => CREAR.empiezaTipo + k * 4),
	...[...EL_NUEVO.descripcion].map((_, k) => CREAR.empiezaDescripcion + k * CREAR.porLetra).filter((_, k) => k % 3 === 0),
	CONFIGURACION.tecla,
];

const tecleado = (frame: number, desde: number, texto: string, porLetra: number) =>
	(frame < desde ? '' : texto.slice(0, Math.min(texto.length, Math.floor((frame - desde) / porLetra) + 1)));

function estado(frame: number): EstadoOrdinales {
	const C = CREAR;
	const creado = frame >= C.aviso;
	const vaciar = (t: string) => (creado ? '' : t);
	return {
		anio: frame >= ANIO.pulsaOpcion ? '2025' : '2026',
		listaAnios: frame >= ANIO.pulsa && frame < ANIO.pulsaOpcion,
		encimaAnio: frame >= ANIO.llegaOpcion - 4 && frame < ANIO.pulsaOpcion ? 1 : null,
		soloLectura: frame >= ANIO.cerrado,
		creando: frame >= C.abre && frame < C.pulsaOcultar + 2,
		nuevo: {
			ordinal: vaciar(tecleado(frame, C.empiezaOrdinal, EL_NUEVO.ordinal, 4)),
			tipo: vaciar(tecleado(frame, C.empiezaTipo, EL_NUEVO.tipo, 4)),
			descripcion: vaciar(tecleado(frame, C.empiezaDescripcion, EL_NUEVO.descripcion, C.porLetra)),
			foco: creado ? null : frame >= C.pulsaDescripcion ? 'descripcion' : frame >= C.pulsaTipo ? 'tipo' : frame >= C.pulsaOrdinal ? 'ordinal' : null,
		},
		creado,
		editando: frame >= CELDA.pulsa && frame < CELDA.sale
			? (frame < CELDA.empieza ? 'p. 18' : tecleado(frame, CELDA.empieza, LA_CORREGIDA.valor, CELDA.porTecla))
			: null,
		corregida: frame >= CELDA.sale,
		verConfig: frame >= CONFIGURACION.pulsaBoton + 2,
		tardanzas: frame >= CONFIGURACION.tecla ? EL_CAMPO.valor : '3',
		focoTardanzas: frame >= CONFIGURACION.pulsaCampo && frame < CONFIGURACION.subeDesde,
		scroll: interpolate(frame, [CONFIGURACION.bajaDesde, CONFIGURACION.bajaHasta, CONFIGURACION.subeDesde, CONFIGURACION.subeHasta], [0, SCROLL, SCROLL, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
		encima: frame >= C.llegaBoton - 4 && frame < C.pulsaBoton + 4 ? 'crear'
			: frame >= C.llegaCrear - 4 && frame < C.pulsaCrear + 4 ? 'crear-ficha'
				: frame >= C.llegaOcultar - 4 && frame < C.pulsaOcultar + 2 ? 'ocultar'
					: frame >= CONFIGURACION.llegaBoton - 4 && frame < CONFIGURACION.pulsaBoton + 4 ? 'configurar'
						: frame >= ANIO.llega - 4 && frame < ANIO.pulsa ? 'anio' : null,
	};
}

export const EscenaOrdinales: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const abierta = entra(frame, fps, LLEGADA.abreSeccion, 16);
	const senalada = frame >= LLEGADA.llegaSeccion && frame < LLEGADA.pulsaSeccion + 10
		? { seccion: DISCIPLINA.seccion, hija: null }
		: frame >= LLEGADA.llegaEntrada && frame < LLEGADA.pulsaEntrada + 10 ? ENTRADA : null;

	const C = CREAR;
	const clics = [
		LLEGADA.pulsaSeccion, LLEGADA.pulsaEntrada, CELDA.pulsa, CELDA.sale, C.pulsaBoton, C.pulsaOrdinal, C.pulsaTipo, C.pulsaDescripcion, C.pulsaCrear, C.pulsaOcultar,
		CONFIGURACION.pulsaBoton, CONFIGURACION.pulsaCampo, ANIO.pulsa, ANIO.pulsaOpcion,
	];

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascaraDe
				abierta={{ seccion: DISCIPLINA.seccion, t: abierta }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				cursor={{
					puntos: conPausas([
						{ frame: LLEGADA.cursorEntra, ...PUNTOS.entrada },
						{ frame: LLEGADA.llegaSeccion, ...PUNTOS.seccion },
						{ frame: LLEGADA.llegaEntrada, ...PUNTOS.entradaOrd },
						{ frame: LLEGADA.monta + 20, ...PUNTOS.reposo },
						{ frame: CELDA.llega - 18, ...PUNTOS.reposo },
						{ frame: CELDA.llega, ...PUNTOS.celda },
						{ frame: CELDA.pulsa + 14, x: PUNTOS.celda.x - 60, y: PUNTOS.celda.y + 50 },
						{ frame: CELDA.llegaFuera - 20, x: PUNTOS.celda.x - 60, y: PUNTOS.celda.y + 50 },
						{ frame: CELDA.llegaFuera, ...PUNTOS.fuera },
						{ frame: C.llegaBoton - 18, ...PUNTOS.fuera },
						{ frame: C.llegaBoton, ...PUNTOS.crear },
						{ frame: C.pulsaOrdinal - 4, ...PUNTOS.ordinal },
						{ frame: C.pulsaTipo - 4, ...PUNTOS.tipo },
						{ frame: C.pulsaDescripcion - 4, ...PUNTOS.descripcion },
						{ frame: C.llegaCrear, ...PUNTOS.crearFicha },
						{ frame: C.llegaOcultar, ...PUNTOS.ocultar },
						{ frame: CONFIGURACION.llegaBoton, ...PUNTOS.configurar },
						{ frame: CONFIGURACION.pulsaBoton + 20, ...PUNTOS.reposo },
						{ frame: CONFIGURACION.llegaCampo - 18, ...PUNTOS.reposo },
						{ frame: CONFIGURACION.llegaCampo, ...PUNTOS.campo },
						{ frame: CONFIGURACION.pulsaCampo + 20, x: PUNTOS.campo.x + 700, y: PUNTOS.campo.y + 240 },
						{ frame: ANIO.llega - 18, x: PUNTOS.campo.x + 700, y: PUNTOS.campo.y + 240 },
						{ frame: ANIO.llega, ...PUNTOS.anio },
						{ frame: ANIO.llegaOpcion, ...PUNTOS.anio2025 },
						{ frame: ANIO.pulsaOpcion + 20, ...PUNTOS.reposo },
					], clics),
					clics,
					aparece: LLEGADA.cursorEntra,
					sale: TARJETA - 20,
				}}
			>
				{frame >= LLEGADA.monta && (
					<Sequence from={LLEGADA.monta}>
						<PantallaOrdinales e={estado(frame)} />
					</Sequence>
				)}
			</EnLaCascaraDe>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{TECLEOS.map((en, i) => <Efecto key={i} cual={TECLAS[i % 3]} en={en} />)}
			{[CELDA.aviso, C.aviso, CONFIGURACION.aviso, ANIO.cerrado].map((en) => <Efecto key={en} cual="aviso" en={en} />)}
			<AvisoInfo texto="Ordinal actualizado con éxito" desde={CELDA.aviso} dura={60} />
			<AvisoInfo texto="Creado con éxito" desde={C.aviso} dura={60} />
			<AvisoInfo texto="Campo actualizado" desde={CONFIGURACION.aviso} dura={60} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
