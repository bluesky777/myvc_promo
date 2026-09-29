import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { conPausas } from '../disciplina/pausas';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import {
	ARCHIVO, COL_NOTA, Dialogo, FILA_ALUMNO, GEO_HOJA, GEO_PORTADA, HOJAS, HojaDeCalculo, Valor, celdasDeLaHoja, celdasDeLaPortada, valoresIniciales,
} from '../sin-internet/Libro';
import { LA_DE_DECIMALES, LA_HOJA, LA_QUE_FALTA, LA_QUE_SE_BORRA } from '../sin-internet/datos-del-libro';
import { CIERRE, PASOS, PORTADA, PUNTOS, TARJETA, TECLEO } from './guion';

/*
 * «RELLENAR EL EXCEL»: la portada y luego la hoja. Los dos planos se relevan en ocho fotogramas,
 * que es lo que tarda una pestaña en cambiar a ojo: nada se reescala.
 */

type Tecleo = { pulsa: number; empieza: number; enter: number };

/** Una tecla por carácter y otra por el Enter, alternando los tres sonidos. */
const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
const TECLEOS = ([[TECLEO.falta, LA_QUE_FALTA.valor], [TECLEO.borra, LA_QUE_SE_BORRA.valor], [TECLEO.decimales, LA_DE_DECIMALES.valor]] as const).flatMap(
	([t, valor]) => [...[...valor].map((_, k) => t.empieza + k * TECLEO.porTecla), t.enter],
);

/** Lo que lleva tecleado un tecleo en este fotograma, o `null` si no se está tecleando. */
function tecleado(frame: number, t: Tecleo, valor: string, porTecla: number): string | null {
	if (frame < t.empieza || frame >= t.enter) { return null; }
	return valor.slice(0, Math.min(valor.length, Math.floor((frame - t.empieza) / porTecla) + 1));
}

export const EscenaSinInternetExcel: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const aparece = entra(frame, fps, 0, 14);
	const relevo = interpolate(frame, [PORTADA.cambia, PORTADA.cambia + PORTADA.dura], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	/* Los valores de la hoja, con lo que ya se ha confirmado con Enter. */
	const valores: Valor[][] = valoresIniciales();
	if (frame >= TECLEO.falta.enter) { valores[LA_QUE_FALTA.fila][LA_QUE_FALTA.col] = Number(LA_QUE_FALTA.valor); }
	if (frame >= TECLEO.borra.enter) { valores[LA_QUE_SE_BORRA.fila][LA_QUE_SE_BORRA.col] = '-'; }

	/* La casilla activa: la que se pulsó, y la de debajo después de Enter (como en cualquier hoja). */
	const d = TECLEO.decimales;
	const activa = (() => {
		const en = (x: { fila: number; col: number }, abajo = 0) => ({ f: FILA_ALUMNO + x.fila + abajo, c: COL_NOTA + x.col });
		if (frame >= d.pulsa) { return frame >= d.enter && frame < d.cierra ? en(LA_DE_DECIMALES) : en(LA_DE_DECIMALES); }
		if (frame >= TECLEO.borra.pulsa) { return frame >= TECLEO.borra.enter ? en(LA_QUE_SE_BORRA, 1) : en(LA_QUE_SE_BORRA); }
		if (frame >= TECLEO.falta.pulsa) { return frame >= TECLEO.falta.enter ? en(LA_QUE_FALTA, 1) : en(LA_QUE_FALTA); }
		return { f: FILA_ALUMNO, c: COL_NOTA };
	})();

	/* Lo que se teclea. La de decimales se queda escrita mientras el error está abierto. */
	const editando = tecleado(frame, TECLEO.falta, LA_QUE_FALTA.valor, TECLEO.porTecla)
		?? tecleado(frame, TECLEO.borra, LA_QUE_SE_BORRA.valor, TECLEO.porTecla)
		?? (frame >= d.empieza && frame < d.cierra ? tecleado(Math.min(frame, d.enter - 1), d, LA_DE_DECIMALES.valor, TECLEO.porTecla) : null);

	const valorActivo = (() => {
		const v = valores[activa.f - FILA_ALUMNO]?.[activa.c - COL_NOTA];
		return v === null || v === undefined ? '' : String(v);
	})();

	const dialogo = frame >= d.dialogo && frame < d.cierra + 8
		? Math.min(interpolate(frame, [d.dialogo, d.dialogo + 5], [0, 1], { extrapolateRight: 'clamp' }), interpolate(frame, [d.cierra, d.cierra + 6], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))
		: 0;

	const clics = [PORTADA.pulsaEnlace, TECLEO.falta.pulsa, TECLEO.borra.pulsa, d.pulsa, d.pulsaCancelar];

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<AbsoluteFill style={{ opacity: aparece }}>
				{relevo < 1 && (
					<HojaDeCalculo
						g={GEO_PORTADA}
						archivo={ARCHIVO}
						celdas={celdasDeLaPortada()}
						pestanas={HOJAS}
						pestana={0}
						activa={{ f: 0, c: 0 }}
						formula=""
						opacidad={1}
					/>
				)}
				{relevo > 0 && (
					<HojaDeCalculo
						g={GEO_HOJA}
						archivo={ARCHIVO}
						celdas={celdasDeLaHoja(valores)}
						pestanas={HOJAS}
						pestana={LA_HOJA}
						activa={activa}
						editando={editando}
						formula={valorActivo}
						opacidad={relevo}
					/>
				)}
			</AbsoluteFill>

			{dialogo > 0 && (
				<AbsoluteFill style={{ background: `rgba(0,0,0,${0.18 * dialogo})` }}>
					<Dialogo a={dialogo} encima={frame >= d.llegaCancelar - 4 && frame < d.pulsaCancelar + 6 ? 'cancelar' : null} />
				</AbsoluteFill>
			)}

			<AbsoluteFill>
				<Cursor
					puntos={conPausas([
						{ frame: 20, ...PUNTOS.entrada },
						{ frame: PORTADA.llegaEnlace - 20, ...PUNTOS.entrada },
						{ frame: PORTADA.llegaEnlace, ...PUNTOS.enlace },
						{ frame: PORTADA.cambia + 20, ...PUNTOS.reposo },
						{ frame: TECLEO.falta.llega - 18, ...PUNTOS.reposo },
						{ frame: TECLEO.falta.llega, ...PUNTOS.falta },
						{ frame: TECLEO.falta.pulsa + 16, x: PUNTOS.falta.x + 50, y: PUNTOS.falta.y + 56 },
						{ frame: TECLEO.borra.llega - 18, x: PUNTOS.falta.x + 50, y: PUNTOS.falta.y + 56 },
						{ frame: TECLEO.borra.llega, ...PUNTOS.borra },
						{ frame: TECLEO.borra.pulsa + 14, x: PUNTOS.borra.x + 50, y: PUNTOS.borra.y + 56 },
						{ frame: d.llega - 18, x: PUNTOS.borra.x + 50, y: PUNTOS.borra.y + 56 },
						{ frame: d.llega, ...PUNTOS.decimales },
						{ frame: d.pulsa + 14, x: PUNTOS.decimales.x + 50, y: PUNTOS.decimales.y + 56 },
						{ frame: d.llegaCancelar - 18, x: PUNTOS.decimales.x + 50, y: PUNTOS.decimales.y + 56 },
						{ frame: d.llegaCancelar, ...PUNTOS.cancelar },
						{ frame: d.pulsaCancelar + 20, ...PUNTOS.reposo },
					], clics)}
					clics={clics}
					aparece={20}
					sale={TARJETA - 20}
					tam={34}
				/>
			</AbsoluteFill>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{TECLEOS.map((en, i) => <Efecto key={i} cual={TECLAS[i % 3]} en={en} />)}
			<Efecto cual="aviso" en={TECLEO.decimales.dialogo} />
			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
