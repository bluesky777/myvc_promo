import React from 'react';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA FOTO DEL ALUMNO. **Dibujada, no una imagen**, y eso es a propósito.
 *
 * La planilla de verdad enseña la foto del alumno (`comunes/celda-foto`), y una tabla de notas sin
 * caras se ve como una hoja de cálculo -- justo lo que el sistema NO es. Pero en un vídeo que se le
 * enseña a media Unión no puede salir la cara de ningún menor, ni una foto de banco que haya que
 * licenciar. Así que van avatares planos, sin rasgos: se lee «persona» al tamaño al que se ven
 * (40 px en la tabla) y no se parecen a nadie.
 *
 * Se distinguen por el pelo, que es lo que funciona a ese tamaño. Sin ojos ni boca: una cara mal
 * dibujada a 40 px se lee como un error, y una bien dibujada distrae de lo que hay que mirar.
 */

const FONDOS = ['#dbeafe', '#fce7f3', '#dcfce7', '#fef3c7', '#ede9fe', '#e0f2fe'];
const PIELES = ['#f3c9a4', '#e3ab7c', '#c88b5c', '#a9653c', '#8a5230', '#f0bd93'];
/*
 * TODOS LOS PELOS SON OSCUROS, y no por gusto: probado en pantalla, un castaño claro sobre una piel
 * clara deja el pelo y la cara **casi del mismo tono** a 42 px, y entonces el avatar no se lee. La
 * variedad la ponen el fondo y la ropa, que no tienen que contrastar con nada.
 */
const PELOS = ['#2b2118', '#3a2416', '#1f1a15', '#161616', '#4a3728', '#2f2116'];
const ROPAS = ['#3b82f6', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

interface Props {
	tipo: 'mujer' | 'hombre';
	/** Cambia pelo, piel, ropa y fondo. Que dos filas seguidas no salgan iguales. */
	variante: number;
	tam?: number;
}

export const Avatar: React.FC<Props> = ({ tipo, variante, tam = 40 }) => {
	const v = Math.abs(variante);
	const fondo = FONDOS[v % FONDOS.length];
	const piel = PIELES[v % PIELES.length];
	const pelo = PELOS[(v + 1) % PELOS.length];
	const ropa = ROPAS[(v + 2) % ROPAS.length];

	const id = `recorte-${tipo}-${v}`;

	return (
		<svg width={tam} height={tam} viewBox="0 0 100 100" style={{ display: 'block', flexShrink: 0 }} aria-hidden>
			<defs>
				<clipPath id={id}>
					<circle cx="50" cy="50" r="50" />
				</clipPath>
			</defs>

			<g clipPath={`url(#${id})`}>
				<circle cx="50" cy="50" r="50" fill={fondo} />

				{/* El cuello va debajo de los hombros: así no hace falta recortarlo. */}
				<rect x="42" y="58" width="16" height="20" fill={piel} />

				{/* Los hombros. Llegan al borde de abajo, que es lo que hace que se lea como un retrato. */}
				<path d="M10 100 C10 80 28 70 50 70 C72 70 90 80 90 100 Z" fill={ropa} />

				{/*
				  * EL PELO LARGO VA **DESPUÉS** DE LOS HOMBROS, para que caiga por encima. Es la única
				  * diferencia real entre los dos avatares, así que tiene que verse.
				  */}
				{tipo === 'mujer' && (
					<path d="M24 46 C24 22 76 22 76 46 L76 78 C70 74 66 66 66 56 L34 56 C34 66 30 74 24 78 Z" fill={pelo} />
				)}

				<ellipse cx="50" cy="44" rx="19" ry="22" fill={piel} />
				<circle cx="30" cy="46" r="4.5" fill={piel} />
				<circle cx="70" cy="46" r="4.5" fill={piel} />

				{/* Y el flequillo, encima de la cara en los dos. Corto en uno, con raya en el otro. */}
				{tipo === 'mujer' ? (
					<path d="M30 42 C30 24 70 24 70 42 C66 32 60 30 50 33 C40 30 34 32 30 42 Z" fill={pelo} />
				) : (
					<path d="M31 42 C31 25 69 25 69 42 C69 33 62 30 50 30 C38 30 31 33 31 42 Z" fill={pelo} />
				)}
			</g>

			{/* Un aro finísimo: separa el avatar del sombreado de la fila cuando el fondo es claro. */}
			<circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,.10)" strokeWidth="2" />
		</svg>
	);
};
