import React from 'react';
import { Composition } from 'remotion';

import { Escena } from './notas/Escena';
import { DURACION, FPS } from './notas/guion';
import { DURACION_COMBINADO, EscenaCombinada } from './combinado/Escena';
import { EscenaDisciplina } from './disciplina/Escena';
import { DURACION as DURACION_DISCIPLINA } from './disciplina/guion';
import { EscenaHorarios } from './horarios/Escena';
import { DURACION as DURACION_HORARIOS } from './horarios/guion';
import { EscenaMovil } from './movil/Escena';
import { DURACION as DURACION_MOVIL } from './movil/guion';
import { EscenaRubricas } from './rubricas/Escena';
import { DURACION as DURACION_RUBRICAS } from './rubricas/guion';

/*
 * LOS CLIPS QUE SE PUEDEN RENDERIZAR. Cada uno sale como un fichero suelto para que quien monta el
 * vídeo los una: son piezas, no un vídeo terminado.
 *
 * 1920×1080 a 30 fps, que es lo que cualquier montador espera sin tener que convertir nada.
 */
export const Root: React.FC = () => (
	<>
		<Composition
			id="Notas-Aro"
			component={Escena}
			durationInFrames={DURACION}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="Notas-Aro-Rotulo"
			component={Escena}
			durationInFrames={DURACION}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		<Composition
			id="Notas-Y-Rubricas"
			component={EscenaCombinada}
			durationInFrames={DURACION_COMBINADO}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="Notas-Y-Rubricas-Rotulo"
			component={EscenaCombinada}
			durationInFrames={DURACION_COMBINADO}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		<Composition
			id="Rubricas"
			component={EscenaRubricas}
			durationInFrames={DURACION_RUBRICAS}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="Rubricas-Rotulo"
			component={EscenaRubricas}
			durationInFrames={DURACION_RUBRICAS}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		<Composition
			id="Disciplina"
			component={EscenaDisciplina}
			durationInFrames={DURACION_DISCIPLINA}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="Disciplina-Rotulo"
			component={EscenaDisciplina}
			durationInFrames={DURACION_DISCIPLINA}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		<Composition
			id="Horarios"
			component={EscenaHorarios}
			durationInFrames={DURACION_HORARIOS}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="Horarios-Rotulo"
			component={EscenaHorarios}
			durationInFrames={DURACION_HORARIOS}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		<Composition
			id="Movil"
			component={EscenaMovil}
			durationInFrames={DURACION_MOVIL}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="Movil-Rotulo"
			component={EscenaMovil}
			durationInFrames={DURACION_MOVIL}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
	</>
);
