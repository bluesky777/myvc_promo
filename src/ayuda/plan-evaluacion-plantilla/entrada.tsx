import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { EscenaPlanPlantilla } from './Escena';
import { DURACION, FPS } from './guion';
const Raiz: React.FC = () => (
	<Composition id="Ayuda-Plan-Evaluacion-Plantilla" component={EscenaPlanPlantilla} durationInFrames={DURACION} fps={FPS} width={1920} height={1080} />
);
registerRoot(Raiz);
