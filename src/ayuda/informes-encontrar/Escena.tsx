import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { Catalogo } from '../informes/Catalogo';
import { LLEGADA, Pantalla } from '../informes/Comun';
import { BUSCA1, BUSCA2, BUSCA3, CIERRE, CLICS, FOCO_DESDE, PASOS, POR_TECLA, PUNTOS, T, TARJETA, momento, senal } from './guion';

const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
/** Una tecla que suena por cada letra que aparece, alternando las tres. */
const TECLEOS = ([[BUSCA1, T.teclea1], [BUSCA2, T.teclea2], [BUSCA3, T.teclea3]] as const).flatMap(([texto, desde]) =>
	[...texto].map((_, i) => ({ cual: TECLAS[i % 3], en: desde + (i + 1) * POR_TECLA })),
);

/*
 * «Encontrar el papel que necesitas»: encadena, no dibuja. La cáscara de rectoría con el catálogo
 * dentro; el guion dice en cada fotograma qué hay escrito, qué familia y qué ficha.
 */

export const EscenaInformesEncontrar: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	const m = momento(frame);

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Pantalla puntos={PUNTOS} clics={CLICS} sale={T.cursorSale}>
				{frame >= LLEGADA.monta && (
					<Catalogo
						frame={frame}
						entraEn={LLEGADA.monta}
						consulta={m.consulta}
						familia={m.familia}
						elegida={m.elegida}
						elegidaDesde={m.elegidaDesde}
						valores={{}}
						listaDesde={m.listaDesde}
						buscadorConFoco={m.buscadorConFoco}
						senal={senal(frame)}
					/>
				)}
			</Pantalla>

			<Foco recorte={paso?.foco ?? null} desde={FOCO_DESDE[cual] ?? paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			{TECLEOS.map((t, i) => <Efecto key={i} cual={t.cual} en={t.en} />)}
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
