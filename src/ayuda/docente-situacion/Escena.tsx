import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

import { conPausas } from '../disciplina/pausas';
import { Cursor } from '../../comunes/Cursor';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { AvisoBajoLaCabecera } from '../disciplina/AvisoBajoLaCabecera';
import { FaltaModal } from '../disciplina/FaltaModal';
import { LlegadaADisciplina } from '../disciplina/Llegada';
import { Rejilla } from '../disciplina/Rejilla';
import { DESCARGO_NUEVO, SITUACION_NUEVA, SITUACIONES_DE_SARA } from '../disciplina/datos';
import {
	ALTA, CIERRE, EDICION, LLEGADA, PASOS, PUNTOS, SCROLL_ALTA, SCROLL_EDICION, SITUACIONES_DESPUES, TARJETA,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «REGISTRAR UNA SITUACIÓN»: encadena, no dibuja. La llegada por la cáscara, la rejilla a pantalla
 * completa, y encima el diálogo dos veces: de alta (desde el «+») y de edición (desde el detalle).
 */

const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;

export const EscenaDocenteSituacion: React.FC = () => {
	const frame = useCurrentFrame();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<LlegadaADisciplina t={LLEGADA} />

			<Rejilla
				estado={{
					monta: LLEGADA.entraLaRejilla,
					detalle: { cual: 2, desde: EDICION.pulsaContador + 2 },
					situaciones: () => SITUACIONES_DESPUES,
					suma: (f, c) => (c === 2 && f >= ALTA.aviso + 4 ? 1 : 0),
					senalado: (f) => (f >= ALTA.llegaMas && f < ALTA.pulsaMas + 6 ? 5
						: f >= EDICION.llegaContador && f < EDICION.pulsaContador + 6 ? 2
							: f >= EDICION.llegaDetalle && f < EDICION.pulsaDetalle + 6 ? 6 : null),
				}}
			/>

			<FaltaModal
				g={{
					abre: ALTA.abre,
					cierra: ALTA.aviso,
					modo: 'alta',
					tipoEn: ALTA.tipoEn,
					desc: { enfocaEn: ALTA.enfocaDesc, empieza: ALTA.empieza, porTecla: ALTA.porTecla, texto: SITUACION_NUEVA.descripcion },
					situaciones: SITUACIONES_DE_SARA,
					scroll: SCROLL_ALTA,
					senalado: (f) => (f >= ALTA.llegaTipo && f < ALTA.tipoEn ? 'tipo-0' : f >= ALTA.llegaCrear && f < ALTA.pulsaCrear + 6 ? 'crear' : null),
				}}
			/>

			<FaltaModal
				g={{
					abre: EDICION.abre,
					cierra: 99999,
					modo: 'edicion',
					editaEn: EDICION.pulsaLapiz + 2,
					despliegaEn: EDICION.despliega,
					eligeEn: EDICION.elige,
					descargo: { enfocaEn: EDICION.enfocaDescargo, empieza: EDICION.empiezaDescargo, porTecla: EDICION.porTecla, texto: DESCARGO_NUEVO },
					guardaEn: EDICION.guarda,
					situaciones: SITUACIONES_DESPUES,
					scroll: SCROLL_EDICION,
					senalado: (f) => (f >= EDICION.llegaLapiz && f < EDICION.pulsaLapiz + 2 ? 'lapiz-1'
						: f >= EDICION.llegaOpcion && f < EDICION.elige ? 'opcion-1'
							: f >= EDICION.llegaGuardar && f < EDICION.pulsaGuardar + 6 ? 'guardar' : null),
				}}
			/>

			<Cursor
				puntos={conPausas([
					{ frame: LLEGADA.entraLaRejilla + 40, x: 1500, y: 860 },
					{ frame: ALTA.llegaMas - 70, x: 1300, y: 720 },
					{ frame: ALTA.llegaMas, ...PUNTOS.mas },
					{ frame: ALTA.llegaTipo - 60, ...PUNTOS.mas },
					{ frame: ALTA.llegaTipo, ...PUNTOS.tipo },
					{ frame: ALTA.llegaDesc, ...PUNTOS.desc },
					{ frame: ALTA.empieza - 4, x: PUNTOS.desc.x + 40, y: PUNTOS.desc.y + 60 },
					{ frame: ALTA.llegaCrear - 40, x: PUNTOS.desc.x + 40, y: PUNTOS.desc.y + 60 },
					{ frame: ALTA.llegaCrear, ...PUNTOS.crear },
					{ frame: EDICION.llegaContador - 60, ...PUNTOS.crear },
					{ frame: EDICION.llegaContador, ...PUNTOS.contador },
					{ frame: EDICION.llegaDetalle, ...PUNTOS.detalle },
					{ frame: EDICION.llegaLapiz - 50, ...PUNTOS.detalle },
					{ frame: EDICION.llegaLapiz, ...PUNTOS.lapiz },
					{ frame: EDICION.llegaOrdinales - 30, ...PUNTOS.lapiz },
					{ frame: EDICION.llegaOrdinales, ...PUNTOS.ordinales },
					{ frame: EDICION.llegaOpcion, ...PUNTOS.opcion },
					{ frame: EDICION.llegaDescargo - 60, ...PUNTOS.opcion },
					{ frame: EDICION.llegaDescargo, ...PUNTOS.descargo },
					{ frame: EDICION.empiezaDescargo - 4, x: PUNTOS.descargo.x + 60, y: PUNTOS.descargo.y + 50 },
					{ frame: EDICION.llegaGuardar - 36, x: PUNTOS.descargo.x + 60, y: PUNTOS.descargo.y + 50 },
					{ frame: EDICION.llegaGuardar, ...PUNTOS.guardar },
				], [ALTA.pulsaMas, ALTA.tipoEn, ALTA.enfocaDesc, ALTA.pulsaCrear, EDICION.pulsaContador, EDICION.pulsaDetalle, EDICION.pulsaLapiz, EDICION.despliega, EDICION.elige, EDICION.enfocaDescargo, EDICION.pulsaGuardar])}
				clics={[ALTA.pulsaMas, ALTA.tipoEn, ALTA.enfocaDesc, ALTA.pulsaCrear, EDICION.pulsaContador, EDICION.pulsaDetalle, EDICION.pulsaLapiz, EDICION.despliega, EDICION.elige, EDICION.enfocaDescargo, EDICION.pulsaGuardar]}
				aparece={LLEGADA.entraLaRejilla + 40}
				sale={TARJETA - 30}
				tam={34}
			/>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<AvisoBajoLaCabecera texto="Falta creada." desde={ALTA.aviso} dura={75} />
			<AvisoBajoLaCabecera texto="Ordinal asignado." desde={EDICION.avisoOrdinal} dura={75} />
			<AvisoBajoLaCabecera texto="Cambios guardados." desde={EDICION.guarda} dura={100} />
			{[ALTA.aviso, EDICION.avisoOrdinal, EDICION.guarda].map((en) => <Efecto key={en} cual="aviso" en={en} />)}
			{[...SITUACION_NUEVA.descripcion].map((_, i) => (i % 2 === 0 ? <Efecto key={`d${i}`} cual={TECLAS[(i / 2) % 3]} en={ALTA.empieza + i * ALTA.porTecla} /> : null))}
			{[...DESCARGO_NUEVO].map((_, i) => (i % 2 === 0 ? <Efecto key={`g${i}`} cual={TECLAS[(i / 2) % 3]} en={EDICION.empiezaDescargo + i * EDICION.porTecla} /> : null))}

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
