import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { conPausas } from '../disciplina/pausas';
import { AvisoBajoLaCabecera } from '../disciplina/AvisoBajoLaCabecera';
import { EnLaCascaraDe } from '../EnLaCascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { ACADEMICO } from '../medidas';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { RESERVA } from '../sin-internet/datos-de-la-subida';
import { EstadoSubir, Subir, estadoInicial } from '../sin-internet/Subir';
import { ANTES_DE_LEER, AUSENCIAS, CHOQUE, CIERRE, DESPUES, PASOS, PUNTOS, RESUMEN, TARJETA } from './guion';

/*
 * «SUBIR: CHOQUES, AUSENCIAS Y QUÉ VA A PASAR»: la misma pantalla de subir, del paso Choques al
 * final. La página baja y sube con un desplazamiento suave, como la rueda del ratón.
 */

const baja = (frame: number, desde: number, hasta: number, cuanto: number) =>
	interpolate(frame, [desde, hasta], [0, cuanto], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

function estadoDeSubir(frame: number): EstadoSubir {
	const e = estadoInicial();
	e.fase = 'leido';
	e.paso = 'choques';
	e.hasta = 2;
	e.pasoDesde = -100;
	e.reserva = { decision: 'crear', lista: false, encimaOpcion: null, nombre: RESERVA.nombre, tecleando: false };

	e.choques.lista = frame >= CHOQUE.pulsaSelect && frame < CHOQUE.pulsaOpcion;
	if (frame >= CHOQUE.pulsaOpcion) { e.choques.aMano = true; e.choques.modo = 'una'; }

	if (frame >= AUSENCIAS.entra) {
		e.paso = 'ausencias'; e.hasta = 3; e.pasoDesde = AUSENCIAS.entra;
		e.scroll = baja(frame, AUSENCIAS.bajaDesde, AUSENCIAS.bajaHasta, AUSENCIAS.scroll);
	}
	if (frame >= RESUMEN.entra) {
		e.paso = 'resumen'; e.hasta = 4; e.pasoDesde = RESUMEN.entra;
		e.resumen = { cuentas: ANTES_DE_LEER, planDeAntes: true, decisiones: 2, releyendo: false };
		e.scroll = baja(frame, RESUMEN.bajaDesde, RESUMEN.bajaHasta, RESUMEN.scroll);
		if (frame >= RESUMEN.pulsaVolver) { e.resumen.releyendo = true; }
		if (frame >= RESUMEN.releido) {
			e.resumen = { cuentas: DESPUES, planDeAntes: false, decisiones: 0, releyendo: false };
			e.scroll = RESUMEN.scroll - baja(frame, RESUMEN.subeDesde, RESUMEN.subeHasta, RESUMEN.scroll)
				+ baja(frame, RESUMEN.bajaOtraVez, RESUMEN.bajaOtraVezHasta, RESUMEN.scroll);
		}
		if (frame >= RESUMEN.pulsaImportar) {
			e.importando = interpolate(frame, [RESUMEN.pulsaImportar, RESUMEN.escribeHasta], [0, 1], { extrapolateRight: 'clamp' });
			e.scroll = 0;
		}
		if (frame >= RESUMEN.escribeHasta) { e.importando = null; e.importado = true; }
	}

	e.encima = frame >= CHOQUE.llegaSelect - 4 && frame < CHOQUE.pulsaSelect ? 'choque-2'
		: frame >= CHOQUE.llegaOpcion - 4 && frame < CHOQUE.pulsaOpcion ? 'opcion-archivo'
			: frame >= AUSENCIAS.llegaPildora - 4 && frame < AUSENCIAS.pulsaPildora + 4 ? 'paso-ausencias'
				: frame >= RESUMEN.llegaSiguiente - 4 && frame < RESUMEN.pulsaSiguiente + 4 ? 'siguiente'
					: frame >= RESUMEN.llegaVolver - 4 && frame < RESUMEN.pulsaVolver + 4 ? 'volver-a-leer'
						: frame >= RESUMEN.llegaImportar - 4 && frame < RESUMEN.pulsaImportar + 4 ? 'importar'
							: null;
	return e;
}

export const EscenaSinInternetSubirChoques: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const clics = [CHOQUE.pulsaSelect, CHOQUE.pulsaOpcion, AUSENCIAS.pulsaPildora, RESUMEN.pulsaSiguiente, RESUMEN.pulsaVolver, RESUMEN.pulsaImportar];

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascaraDe
				abierta={{ seccion: ACADEMICO, t: 1 }}
				senalada={null}
				opacidad={entra(frame, fps, 0, 14)}
				cursor={{
					puntos: conPausas([
						{ frame: 20, ...PUNTOS.entrada },
						{ frame: CHOQUE.llegaSelect - 18, ...PUNTOS.entrada },
						{ frame: CHOQUE.llegaSelect, ...PUNTOS.select },
						{ frame: CHOQUE.llegaOpcion, ...PUNTOS.opcion },
						{ frame: CHOQUE.pulsaOpcion + 20, ...PUNTOS.reposo },
						{ frame: AUSENCIAS.llegaPildora - 18, ...PUNTOS.reposo },
						{ frame: AUSENCIAS.llegaPildora, ...PUNTOS.pildora },
						{ frame: AUSENCIAS.pulsaPildora + 20, ...PUNTOS.reposo },
						{ frame: RESUMEN.llegaSiguiente - 18, ...PUNTOS.reposo },
						{ frame: RESUMEN.llegaSiguiente, ...PUNTOS.siguiente },
						{ frame: RESUMEN.pulsaSiguiente + 20, ...PUNTOS.reposo },
						{ frame: RESUMEN.llegaVolver - 18, ...PUNTOS.reposo },
						{ frame: RESUMEN.llegaVolver, ...PUNTOS.volver },
						{ frame: RESUMEN.pulsaVolver + 20, ...PUNTOS.reposo },
						{ frame: RESUMEN.llegaImportar - 18, ...PUNTOS.reposo },
						{ frame: RESUMEN.llegaImportar, ...PUNTOS.importar },
						{ frame: RESUMEN.pulsaImportar + 20, ...PUNTOS.reposo },
					], clics),
					clics,
					aparece: 20,
					sale: TARJETA - 20,
				}}
			>
				<Subir e={estadoDeSubir(frame)} />
			</EnLaCascaraDe>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<AvisoBajoLaCabecera texto={`Entraron ${DESPUES.entran} notas y se borraron ${DESPUES.seBorran}.`} desde={RESUMEN.aviso} dura={TARJETA - RESUMEN.aviso} />
			<Efecto cual="aviso" en={RESUMEN.aviso} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
