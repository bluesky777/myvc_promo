import React from 'react';
import { Composition, registerRoot } from 'remotion';

import { EscenaUnidades100 } from './Escena';
import { DURACION, FPS } from './guion';

const Raiz: React.FC = () => (
	<Composition id="Ayuda-Unidades-100" component={EscenaUnidades100} durationInFrames={DURACION} fps={FPS} width={1920} height={1080} />
);

registerRoot(Raiz);
