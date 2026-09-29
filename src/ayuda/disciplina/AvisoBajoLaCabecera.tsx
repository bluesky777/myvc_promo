import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';

import { Aviso } from '../../notas/Aviso';

/** Un aviso de Ant (`notas/Aviso`), bajado para no tapar la cabecera de ubicación. */
export const AvisoBajoLaCabecera: React.FC<{ texto: string; desde: number; dura: number; tipo?: 'success' | 'info' }> = ({ texto, desde, dura, tipo }) => (
	<Sequence from={desde} durationInFrames={dura + 20}>
		<AbsoluteFill style={{ top: 96, zIndex: 35 }}>
			<Aviso texto={texto} desde={0} dura={dura} tipo={tipo} />
		</AbsoluteFill>
	</Sequence>
);
