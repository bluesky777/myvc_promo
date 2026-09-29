import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escrito } from '../../comunes/movimiento';
import { Aviso } from '../../notas/Aviso';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { EnLaCascara } from '../comun-directivo/Escenario';
import { abiertaEn, avance, entre, senaladaEn } from '../comun-directivo/lugar';
import { EL_DEPARTAMENTO, LAS_FRASES, LA_NUEVA } from './datos';
import { AVISO, CIERRE, PASOS, PUNTOS, T, TARJETA, finDelTecleo } from './guion';
import { PantallaCalendario, PantallaCiudades, PantallaFrases, PantallaMuro } from './Pantallas';

/*
 * «FRASES, CIUDADES, CALENDARIO Y MURO»: encadena, no dibuja. Cada pantalla se apaga entera antes
 * de que se monte la siguiente: no se desmonta nada a mitad de salida.
 */

const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
/** Una tecla cada dos letras (a 2 fotogramas por letra, una por letra sería un redoble), cuando aparece. */
const teclas = [...LA_NUEVA.frase].flatMap((c, i) => (c === ' ' || i % 2 ? [] : [T.teclea + (i + 1) * T.porTecla]));

const sale = (f: number, desde: number) => 1 - avance(f, desde, desde + 16);

export const EscenaFrasesCiudades: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, f);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const abierta = abiertaEn(f, fps, [
		{ seccion: 'Referencias', abre: T.abreRef, cierra: T.cierraRef },
		{ seccion: 'Configuración', abre: T.abreConfig },
	]);
	const senalada = senaladaEn(f, [
		{ desde: T.llegaRef, hasta: T.pulsaRef + 10, seccion: 'Referencias', hija: null },
		{ desde: T.llegaFrases, hasta: T.pulsaFrases + 10, seccion: 'Referencias', hija: 'Frases' },
		{ desde: T.llegaConfig, hasta: T.pulsaConfig + 10, seccion: 'Configuración', hija: null },
		{ desde: T.llegaCiudades, hasta: T.pulsaCiudades + 10, seccion: 'Configuración', hija: 'Ciudades' },
		{ desde: T.llegaCalendario, hasta: T.pulsaCalendario + 10, seccion: 'Configuración', hija: 'Calendario' },
		{ desde: T.llegaMuro, hasta: T.pulsaMuro + 10, seccion: 'Configuración', hija: 'Publicaciones' },
	]);

	const P = PUNTOS;
	const aparte = { x: P.frase.x + 380, y: P.frase.y + 70 };
	const bajoCiudades = { x: P.departamento.x + 260, y: P.departamento.y + 330 };
	const enElMes = { x: 900, y: 560 };

	const creada = f >= T.creada;
	const eFrases = {
		ficha: entra(f, fps, T.abreFicha, 14),
		frase: creada ? '' : escrito(f, LA_NUEVA.frase, T.teclea, T.porTecla),
		activo: entre(f, T.pulsaFrase, T.pulsaCelda) ? ('frase' as const) : null,
		cursor: f % 30 < 16 || entre(f, T.teclea, finDelTecleo),
		encimaCrearNueva: entre(f, T.llegaCrearNueva, T.pulsaCrearNueva + 6),
		encimaCrear: entre(f, T.llegaCrear, T.pulsaCrear + 6),
		nueva: entra(f, fps, T.creada, 14),
		celdaEditando: entre(f, T.pulsaCelda, T.sueltaCelda),
	};

	const cierraDepto = interpolate(f, [T.pulsaOpcion + 2, T.pulsaOpcion + 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const eCiudades = {
		desplegable: f >= T.abreDepto ? entra(f, fps, T.abreDepto, 10) * cierraDepto : 0,
		resaltada: f >= T.llegaOpcion - 8 ? EL_DEPARTAMENTO : null,
		elegido: f >= T.elegido,
		lista: avance(f, T.elegido, T.elegido + 24),
	};

	const eMuro = { editor: entra(f, fps, T.abreEditor, 14), encimaEscribir: entre(f, T.llegaEscribir, T.pulsaEscribir + 6) };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara
				abierta={abierta}
				senalada={senalada}
				opacidad={entra(f, fps, 0, 14)}
				cursor={{
					puntos: [
						{ frame: T.cursorEntra, ...P.entrada },
						{ frame: T.llegaRef, ...P.referencias },
						{ frame: T.llegaFrases, ...P.frases },
						{ frame: T.llegaCrearNueva - 60, ...P.frases },
						{ frame: T.llegaCrearNueva, ...P.crearNueva },
						{ frame: T.pulsaCrearNueva + 20, ...P.crearNueva },
						{ frame: T.llegaFrase, ...P.frase },
						{ frame: T.pulsaFrase + 6, ...P.frase },
						{ frame: T.teclea - 2, ...aparte },
						{ frame: T.llegaCrear - 40, ...aparte },
						{ frame: T.llegaCrear, ...P.crear },
						{ frame: T.pulsaCrear + 20, ...P.crear },
						{ frame: T.llegaCelda, ...P.celda },
						{ frame: T.sueltaCelda, ...P.celda },
						{ frame: T.llegaConfig, ...P.configuracion },
						{ frame: T.pulsaConfig + 6, ...P.configuracion },
						{ frame: T.llegaCiudades, ...P.ciudades },
						{ frame: T.pulsaCiudades + 10, ...P.ciudades },
						{ frame: T.llegaDepto, ...P.departamento },
						{ frame: T.pulsaDepto + 6, ...P.departamento },
						{ frame: T.llegaOpcion, ...P.opcion },
						{ frame: T.pulsaOpcion + 10, ...P.opcion },
						{ frame: T.pulsaOpcion + 50, ...bajoCiudades },
						{ frame: T.llegaCalendario - 30, ...bajoCiudades },
						{ frame: T.llegaCalendario, ...P.calendario },
						{ frame: T.pulsaCalendario + 20, ...P.calendario },
						{ frame: T.pulsaCalendario + 70, ...enElMes },
						{ frame: T.llegaMuro - 40, ...enElMes },
						{ frame: T.llegaMuro, ...P.publicaciones },
						{ frame: T.pulsaMuro + 20, ...P.publicaciones },
						{ frame: T.llegaEscribir - 40, x: P.escribir.x - 200, y: P.escribir.y + 300 },
						{ frame: T.llegaEscribir, ...P.escribir },
						{ frame: T.pulsaEscribir + 20, ...P.escribir },
						{ frame: T.pulsaEscribir + 70, x: P.escribir.x + 20, y: P.escribir.y + 420 },
					],
					clics: [T.pulsaRef, T.pulsaFrases, T.pulsaCrearNueva, T.pulsaFrase, T.pulsaCrear, T.pulsaCelda, T.pulsaConfig, T.pulsaCiudades, T.pulsaDepto, T.pulsaOpcion, T.pulsaCalendario, T.pulsaMuro, T.pulsaEscribir],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{f >= T.montaFrases && f < T.seVaFrases + 17 && (
					<PantallaFrases e={eFrases} filas={LAS_FRASES} nueva={LA_NUEVA} opacidad={entra(f, fps, T.montaFrases, 14) * sale(f, T.seVaFrases)} />
				)}
				{f >= T.montaCiudades && f < T.seVaCiudades + 17 && (
					<PantallaCiudades e={eCiudades} opacidad={entra(f, fps, T.montaCiudades, 14) * sale(f, T.seVaCiudades)} />
				)}
				{f >= T.montaCalendario && f < T.seVaCalendario + 17 && (
					<PantallaCalendario opacidad={entra(f, fps, T.montaCalendario, 14) * sale(f, T.seVaCalendario)} />
				)}
				{f >= T.montaMuro && <PantallaMuro e={eMuro} opacidad={entra(f, fps, T.montaMuro, 14)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{teclas.map((en, i) => <Efecto key={en} cual={TECLAS[i % 3]} en={en} />)}
			<Efecto cual="aviso" en={AVISO.desde} />

			<Sequence from={AVISO.desde} durationInFrames={AVISO.dura + 20} style={{ zIndex: 30 }}>
				<Aviso texto={AVISO.texto} desde={0} dura={AVISO.dura} />
			</Sequence>

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
