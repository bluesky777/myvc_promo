import React from 'react';
import { Composition, registerRoot } from 'remotion';

import { EscenaBuscarEscribiendo } from './Escena';
import { DURACION, FPS } from './guion';

const Raiz: React.FC = () => (
	<Composition id="Ayuda-Buscar-Escribiendo" component={EscenaBuscarEscribiendo} durationInFrames={DURACION} fps={FPS} width={1920} height={1080} />
);

registerRoot(Raiz);
