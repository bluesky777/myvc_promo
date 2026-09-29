import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { EscenaBoletinIndependiente } from './Escena';
import { DURACION, FPS } from './guion';
const Raiz: React.FC = () => (<Composition id="Ayuda-Boletin-Independiente" component={EscenaBoletinIndependiente} durationInFrames={DURACION} fps={FPS} width={1920} height={1080} />);
registerRoot(Raiz);
