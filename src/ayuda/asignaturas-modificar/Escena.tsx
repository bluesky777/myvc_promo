import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Aviso } from '../../notas/Aviso';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { ModalBorrar, PantallaAsignaturas } from '../montar-el-ano/Asignaturas';
import { ASIGNATURAS, EnLaCascara, REFERENCIAS } from '../montar-el-ano/EnLaCascara';
import { entre } from '../montar-el-ano/tiempo';
import { DETALLE_CATEDRA, M, TECLEO, estadoEn, modalEn } from './datos';
import { AVISOS, CIERRE, PASOS, PUNTOS, TARJETA } from './guion';

/*
 * «CAMBIAR O QUITAR UNA ASIGNATURA»: encadena, no dibuja. El modal de borrar va encima de toda la
 * cáscara, como en la aplicación, y su máscara tapa también el menú.
 */

/** Una tecla por letra, alternando los tres sonidos, cuando la letra aparece (`tecleado`, 4 fotogramas cada una). */
const Tecleo: React.FC<{ texto: string; desde: number }> = ({ texto, desde }) => (
	<>
		{[...texto].map((_, i) => <Efecto key={i} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={desde + (i + 1) * 4} />)}
	</>
);

export const EscenaAsignaturasModificar: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = entre(frame, M.llegaReferencias, M.pulsaReferencias + 10)
		? { seccion: REFERENCIAS, hija: null }
		: entre(frame, M.llegaEntrada, M.pulsaEntrada + 10)
			? { seccion: REFERENCIAS, hija: ASIGNATURAS }
			: null;

	const modal = modalEn(frame, fps);
	const P = PUNTOS;
	const reposo = { x: 1428, y: 560 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara
				referencias={entra(frame, fps, M.abreReferencias, 16)}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				encima={modal.visible ? <ModalBorrar detalle={DETALLE_CATEDRA} aparece={modal.aparece} encima={modal.encima} cargando={modal.cargando} cargandoDetalle={modal.cargandoDetalle} /> : null}
				cursor={{
					puntos: [
						{ frame: M.cursorEntra, ...P.entrada },
						{ frame: M.llegaReferencias, ...P.referencias },
						{ frame: M.llegaEntrada, ...P.asignaturas },
						{ frame: M.llegaFiltro - 20, ...P.asignaturas },
						{ frame: M.llegaFiltro, ...P.filtro },
						{ frame: M.tecleaFiltro, ...P.filtro },
						{ frame: M.llegaOpcionFiltro, ...P.opcionFiltro },
						{ frame: M.pulsaOpcionFiltro + 20, ...P.opcionFiltro },
						{ frame: M.llegaEditar - 30, ...reposo },
						{ frame: M.llegaEditar, ...P.lapiz },
						{ frame: M.pulsaEditar + 20, ...P.lapiz },
						{ frame: M.llegaProfesor, ...P.profesor },
						{ frame: M.tecleaProfesor, ...P.profesor },
						{ frame: M.llegaOpcionProfesor, ...P.opcionProfesor },
						{ frame: M.pulsaOpcionProfesor + 8, ...P.opcionProfesor },
						{ frame: M.llegaGuardar, ...P.guardar },
						{ frame: M.pulsaGuardar + 20, ...P.guardar },
						{ frame: M.guardada + 40, ...reposo },
						{ frame: M.llegaBorrar - 40, ...reposo },
						{ frame: M.llegaBorrar, ...P.papeleraRoja },
						{ frame: M.pulsaBorrar + 20, ...P.papeleraRoja },
						{ frame: M.llegaEliminar - 60, x: P.eliminar.x + 260, y: P.eliminar.y - 40 },
						{ frame: M.llegaEliminar, ...P.eliminar },
						{ frame: M.pulsaEliminar + 20, ...P.eliminar },
						{ frame: M.eliminada + 60, ...reposo },
						{ frame: M.llegaPapelera - 30, ...reposo },
						{ frame: M.llegaPapelera, ...P.botonPapelera },
						{ frame: M.pulsaPapelera + 20, ...P.botonPapelera },
						{ frame: M.llegaRestaurar, ...P.restaurar },
						{ frame: M.pulsaRestaurar + 20, ...P.restaurar },
						{ frame: M.restaurada + 60, ...reposo },
					],
					clics: [
						M.pulsaReferencias, M.pulsaEntrada, M.pulsaFiltro, M.pulsaOpcionFiltro, M.pulsaEditar, M.pulsaProfesor, M.pulsaOpcionProfesor,
						M.pulsaGuardar, M.pulsaBorrar, M.pulsaEliminar, M.pulsaPapelera, M.pulsaRestaurar,
					],
					aparece: M.cursorEntra,
					sale: M.restaurada + 70,
				}}
			>
				{frame >= M.monta && <PantallaAsignaturas estado={estadoEn(frame, fps)} opacidad={entra(frame, fps, M.monta, 14)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.focoDesde ?? paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{AVISOS.map((a) => (
				<Sequence key={a.desde} from={a.desde} durationInFrames={a.dura + 20}>
					<Aviso texto={a.texto} desde={0} dura={a.dura} />
				</Sequence>
			))}

			<Tecleo texto={TECLEO.filtro} desde={M.tecleaFiltro} />
			<Tecleo texto={TECLEO.profesor} desde={M.tecleaProfesor} />
			{AVISOS.map((a) => <Efecto key={`e${a.desde}`} cual="aviso" en={a.desde} />)}

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
