import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

import { conPausas } from '../disciplina/pausas';
import { Cursor } from '../../comunes/Cursor';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { LlegadaADisciplina } from '../disciplina/Llegada';
import { Rejilla } from '../disciplina/Rejilla';
import { UniformesModal } from '../disciplina/UniformesModal';
import { UNIFORME_NUEVO, UNIFORMES_DE_SARA } from '../disciplina/datos';
import { CIERRE, EL_MOTIVO, FOCOS, LLEGADA, PASOS, PUNTOS, TARDANZAS, TARJETA, UNIFORME } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «UNIFORME Y LLEGADAS TARDE»: encadena. La llegada de siempre, la rejilla, el detalle de uniforme
 * dentro de la celda, su diálogo, y la vuelta con el contador subido.
 */

export const EscenaDocenteUniformeTardanzas: React.FC = () => {
	const frame = useCurrentFrame();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	const vuelve = UNIFORME.pulsaAceptar + 4;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<LlegadaADisciplina t={LLEGADA} />

			<Rejilla
				estado={{
					monta: LLEGADA.entraLaRejilla,
					detalle: { cual: 0, desde: UNIFORME.pulsaContador + 2 },
					uniformes: (f) => (f >= vuelve ? [...UNIFORMES_DE_SARA, UNIFORME_NUEVO] : UNIFORMES_DE_SARA),
					suma: (f, c) => (c === 0 && f >= vuelve ? 1 : 0),
					senalado: (f) => (f >= UNIFORME.llegaContador && f < UNIFORME.pulsaContador + 6 ? 0
						: f >= UNIFORME.llegaDetalle && f < UNIFORME.pulsaDetalle + 6 ? 6
							: f >= TARDANZAS.llega && f < TARDANZAS.hasta ? 1 : null),
				}}
			/>

			<UniformesModal
				g={{
					abre: UNIFORME.abre,
					cierra: UNIFORME.pulsaAceptar,
					agregaEn: UNIFORME.pulsaAgregar,
					marcaEn: UNIFORME.marca,
					motivo: EL_MOTIVO,
					guardaEn: UNIFORME.pulsaGuardar + 15,
					antes: UNIFORMES_DE_SARA,
					nuevo: UNIFORME_NUEVO,
					senalado: (f) => (f >= UNIFORME.llegaAgregar && f < UNIFORME.pulsaAgregar ? 'agregar'
						: f >= UNIFORME.llegaMotivo && f < UNIFORME.marca ? `motivo-${EL_MOTIVO}`
							: f >= UNIFORME.llegaGuardar && f < UNIFORME.pulsaGuardar + 6 ? 'guardar'
								: f >= UNIFORME.llegaAceptar && f < UNIFORME.pulsaAceptar + 4 ? 'aceptar' : null),
				}}
			/>

			<Cursor
				puntos={conPausas([
					{ frame: LLEGADA.entraLaRejilla + 40, x: 1500, y: 860 },
					{ frame: UNIFORME.llegaContador - 60, x: 1350, y: 700 },
					{ frame: UNIFORME.llegaContador, ...PUNTOS.uniforme },
					{ frame: UNIFORME.llegaDetalle - 60, ...PUNTOS.uniforme },
					{ frame: UNIFORME.llegaDetalle, ...PUNTOS.detalle },
					{ frame: UNIFORME.llegaAgregar - 40, ...PUNTOS.detalle },
					{ frame: UNIFORME.llegaAgregar, ...PUNTOS.agregar },
					{ frame: UNIFORME.llegaMotivo, ...PUNTOS.motivo },
					{ frame: UNIFORME.llegaGuardar - 30, ...PUNTOS.motivo },
					{ frame: UNIFORME.llegaGuardar, ...PUNTOS.guardar },
					{ frame: UNIFORME.llegaAceptar, ...PUNTOS.aceptar },
					{ frame: TARDANZAS.desde, ...PUNTOS.aceptar },
					{ frame: TARDANZAS.llega, x: PUNTOS.tardanzas.x + 14, y: PUNTOS.tardanzas.y + 16 },
				], [UNIFORME.pulsaContador, UNIFORME.pulsaDetalle, UNIFORME.pulsaAgregar, UNIFORME.marca, UNIFORME.pulsaGuardar, UNIFORME.pulsaAceptar])}
				clics={[UNIFORME.pulsaContador, UNIFORME.pulsaDetalle, UNIFORME.pulsaAgregar, UNIFORME.marca, UNIFORME.pulsaGuardar, UNIFORME.pulsaAceptar]}
				aparece={LLEGADA.entraLaRejilla + 40}
				sale={TARJETA - 30}
				tam={34}
			/>

			{/*
			  EL PASO DE «AGREGAR FALLA» LLEVA DOS FOCOS SEGUIDOS: la fila de motivos no existe hasta que
			  se pulsa «+ Agregar falla», y su recuadro encendido antes caía sobre un hueco vacío. Primero
			  el botón; en cuanto el formulario está, los motivos.
			*/}
			{paso?.foco === FOCOS.motivos ? (
				<>
					<Foco recorte={FOCOS.agregar} desde={paso.desde} hasta={UNIFORME.pulsaAgregar + 4} />
					<Foco recorte={FOCOS.motivos} desde={UNIFORME.pulsaAgregar + 4} hasta={paso.focoHasta ?? acabaElPaso - 10} />
				</>
			) : (
				<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			)}

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
