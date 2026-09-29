import React from 'react';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL COLEGIO DE TODOS LOS VÍDEOS DE AYUDA: «COLEGIO LOS ALMENDROS», **INVENTADO ENTERO**.
 *
 * Es el único colegio de la ayuda desde el 2026-09-28 (antes convivía con «COLEGIO DE DEMOSTRACIÓN
 * MyVC», sigla «CDM»). Nombre, sigla, resolución, ciudad, rector, secretaria, escudo, membrete y
 * rúbricas salen de aquí y de ningún otro sitio: boletines, actas, certificados, constancias,
 * observador, planillas, la ficha del colegio y el logo de la barra de arriba. Nada se copió de una
 * plantilla, una imagen ni un fixture de app2, ni de ningún colegio de verdad. Esto se publica en
 * YouTube. El escudo, el membrete y las rúbricas son dibujos SVG hechos para esto; los números de
 * documento y de resolución son de relleno a propósito.
 *
 * LO QUE SÍ ES DE LA APLICACIÓN es el formato y los textos fijos de cada papel: eso vive en cada
 * papel (`certificado-imprimir/Certificado.tsx`, `constancia-estudio/Constancia.tsx`...).
 */

export interface Persona {
	nombres: string;
	apellidos: string;
	cc: string;
	/** La cara dibujada (`comunes/Avatar`), para donde sale con retrato. */
	cara: { tipo: 'mujer' | 'hombre'; variante: number };
}

export const ALMENDROS = {
	nombre: 'Colegio Los Almendros',
	/** Como lo guarda la ficha y lo imprimen los papeles: en mayúsculas, tal cual está guardado. */
	nombrePapel: 'COLEGIO LOS ALMENDROS',
	/** La «Abreviatura» de la ficha: la que los boletines ponen detrás del nombre. */
	abreviatura: 'CLA',
	/** La línea de debajo del nombre en boletines y listados. */
	resolucion: 'Resolución 0000 de 2019 · DANE 000000000000',
	caracter: 'mixto',
	calendario: 'A',
	jornada: 'mañana',
	ciudad: 'Santa Rosa de Cabal',
	departamento: 'Risaralda',
	sitioWeb: 'www.colegiolosalmendros.edu.co',
	/** El «Texto bajo el membrete» de 2026, tal como queda al final del vídeo del año. */
	encabezado: 'Aprobado por Resolución 0000 de 2019 de la Secretaría de Educación',
	/** Lo que se le añade en el vídeo del año. */
	encabezadoAnadido: ' · NIT 000.000.000-0',
	rector: { nombres: 'Hernán Darío', apellidos: 'Quintero Salazar', cc: '12.345.678', cara: { tipo: 'hombre', variante: 3 } } as Persona,
	secretaria: { nombres: 'Luz Marina', apellidos: 'Ocampo Restrepo', cc: '98.765.432', cara: { tipo: 'mujer', variante: 2 } } as Persona,
	yearId: 7,
	year: 2026,
	/** El contador de certificados del año antes de que el vídeo cargue el de periodo. */
	contador: 144,
};

/** «Hernán Darío Quintero Salazar»: como firma. */
export const nombreDe = (p: Persona) => `${p.nombres} ${p.apellidos}`;
/** «Quintero Salazar, Hernán Darío»: como lo listan los papeles de MyVC. */
export const apellidosDe = (p: Persona) => `${p.apellidos}, ${p.nombres}`;

/** Lo que pintan los papeles en su membrete de una línea. */
export const COLEGIO = {
	nombre: ALMENDROS.nombrePapel,
	abreviatura: ALMENDROS.abreviatura,
	resolucion: ALMENDROS.resolucion,
};

export const VERDE = '#2f6b3a';
export const VERDE_CLARO = '#e3efe2';
export const ORO = '#c9a227';

/*
 * EL ESCUDO. Un almendro dentro de un escudo partido, con una cinta abajo. Es un dibujo, no un
 * emblema: tiene que leerse como «el escudo del colegio» y no parecerse al de nadie.
 */
export const Escudo: React.FC<{ tam: number }> = ({ tam }) => (
	<svg width={tam} height={tam * 1.12} viewBox="0 0 100 112" aria-hidden>
		<path d="M10 8 H90 V56 C90 82 70 98 50 106 C30 98 10 82 10 56 Z" fill={VERDE_CLARO} stroke={VERDE} strokeWidth="4" />
		<path d="M10 8 H90 V24 H10 Z" fill={VERDE} />
		<circle cx="30" cy="16" r="3" fill={ORO} />
		<circle cx="50" cy="16" r="3" fill={ORO} />
		<circle cx="70" cy="16" r="3" fill={ORO} />
		{/* El almendro: tronco y copa. */}
		<path d="M50 88 V60 M50 70 L40 60 M50 66 L60 56" stroke="#6b4a2b" strokeWidth="4" strokeLinecap="round" fill="none" />
		<circle cx="50" cy="48" r="16" fill="#5f9a4a" />
		<circle cx="37" cy="54" r="10" fill="#6fae57" />
		<circle cx="63" cy="54" r="10" fill="#6fae57" />
		<circle cx="44" cy="44" r="2.4" fill="#f4d8e2" />
		<circle cx="56" cy="50" r="2.4" fill="#f4d8e2" />
		<circle cx="50" cy="38" r="2.4" fill="#f4d8e2" />
		<path d="M4 92 Q50 108 96 92 L92 102 Q50 116 8 102 Z" fill={ORO} />
	</svg>
);

/*
 * EL MEMBRETE: la «imagen del encabezado» de la plantilla, que va DE FILO A FILO del papel. Se
 * dibuja a la medida de la hoja de 21 cm (794 px de pantalla) y 150 de alto, que es la «Altura
 * encabezado» con la que la plantilla lo coloca. Lleva el escudo dentro, que es por lo que el
 * certificado no pinta el logo suelto cuando hay membrete.
 */
export const MEMBRETE = { ancho: 794, alto: 132, fichero: 'almendros.png' };

export const Membrete: React.FC<{ ancho?: number }> = ({ ancho = MEMBRETE.ancho }) => {
	const e = ancho / MEMBRETE.ancho;
	return (
		<svg width={ancho} height={MEMBRETE.alto * e} viewBox={`0 0 ${MEMBRETE.ancho} ${MEMBRETE.alto}`} aria-hidden>
			<rect x="0" y="0" width={MEMBRETE.ancho} height={MEMBRETE.alto} fill="#fbfdf9" />
			<path d={`M0 0 H${MEMBRETE.ancho} V26 Q${MEMBRETE.ancho / 2} 44 0 26 Z`} fill={VERDE} />
			<g transform="translate(46 30)">
				<g transform="scale(0.78)">
					<path d="M10 8 H90 V56 C90 82 70 98 50 106 C30 98 10 82 10 56 Z" fill={VERDE_CLARO} stroke={VERDE} strokeWidth="4" />
					<path d="M10 8 H90 V24 H10 Z" fill={VERDE} />
					<path d="M50 88 V60 M50 70 L40 60 M50 66 L60 56" stroke="#6b4a2b" strokeWidth="4" strokeLinecap="round" fill="none" />
					<circle cx="50" cy="48" r="16" fill="#5f9a4a" />
					<circle cx="37" cy="54" r="10" fill="#6fae57" />
					<circle cx="63" cy="54" r="10" fill="#6fae57" />
					<path d="M4 92 Q50 108 96 92 L92 102 Q50 116 8 102 Z" fill={ORO} />
				</g>
			</g>
			<text x="150" y="78" fontFamily="Georgia, 'Times New Roman', serif" fontSize="34" fontWeight="700" fill={VERDE} letterSpacing="1.5">
				{ALMENDROS.nombrePapel}
			</text>
			<text x="152" y="102" fontFamily="Georgia, 'Times New Roman', serif" fontSize="14" fill="#4b5a4d" letterSpacing="0.6">
				Educación preescolar, básica y media · {ALMENDROS.ciudad}
			</text>
			<rect x="0" y={MEMBRETE.alto - 8} width={MEMBRETE.ancho} height="4" fill={ORO} />
			<rect x="0" y={MEMBRETE.alto - 3} width={MEMBRETE.ancho} height="3" fill={VERDE} />
		</svg>
	);
};

/* LAS RÚBRICAS. Dos garabatos distintos, dibujados para esto. */
export const Rubrica: React.FC<{ cual: 'rector' | 'secretaria'; ancho?: number }> = ({ cual, ancho = 150 }) => (
	<svg width={ancho} height={ancho * 0.32} viewBox="0 0 150 48" aria-hidden>
		{cual === 'rector' ? (
			<path
				d="M8 34 C18 8 26 8 28 30 C30 44 38 12 46 18 C54 24 50 38 60 30 C70 22 74 10 82 20 C90 30 96 34 106 22 C112 16 120 18 142 14"
				fill="none" stroke="#1d2f6b" strokeWidth="2.2" strokeLinecap="round"
			/>
		) : (
			<path
				d="M12 30 C20 20 30 14 34 26 C38 38 44 30 50 22 C56 14 62 34 70 28 C80 20 84 26 92 30 C100 34 108 18 118 22 C126 26 132 30 140 26"
				fill="none" stroke="#1d2f6b" strokeWidth="2" strokeLinecap="round"
			/>
		)}
	</svg>
);
