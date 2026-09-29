import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { EscenaCierre6 } from './Escena';
import { DURACION, FPS } from './guion';

const Raiz: React.FC = () => (
	<Composition id="Ayuda-Cierre-6" component={EscenaCierre6} durationInFrames={DURACION} fps={FPS} width={1920} height={1080} />
);

registerRoot(Raiz);
