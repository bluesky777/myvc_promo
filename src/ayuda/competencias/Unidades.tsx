import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { escribiendo, escrito, estiloDeSalida, llega, seVa } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { VOCABULARIO } from '../../comunes/vocabulario';
import {
	ANCHO, AYUDA_DE_UNIDADES, BOTON_COLUMNA, PLACEHOLDER_COLUMNA, UNIDADES, UNIDADES_ALTO,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «UNIDADES», EN UN COLEGIO POR COMPETENCIAS.
 *
 * LO QUE HAY QUE VER AQUÍ ES UN PÁRRAFO, no una tabla. La pantalla es casi la misma que en un
 * colegio ponderado --las mismas unidades, los mismos porcentajes, el mismo 100 %--; lo único que
 * cambia son **las palabras del hueco donde se bautiza una columna**, y ese cambio es todo el
 * modelo nuevo visto desde el docente: la columna vuelve a ser un examen o un taller, y el texto
 * que sale en el boletín se escribe en otro sitio.
 *
 * Por eso el párrafo de ayuda se dibuja entero y con su sitio propio, y por eso el vídeo le pone el
 * foco encima: si no se lee, esta pantalla parece la de siempre y el vídeo no ha contado nada.
 */

const TITULO = 6;
const LISTA = 20;
const PASO = 6;

const U = UNIDADES_ALTO;

export const Unidades: React.FC<{ salidaEn: number }> = ({ salidaEn }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	/*
	 * EL TÍTULO ES LA PALABRA DEL COLEGIO. En la aplicación sale de `unidades_displayname`, y lo que
	 * la base de datos llama «unidades» casi ningún colegio lo ve escrito así.
	 */
	const titulo = VOCABULARIO.unidades;
	const cursor = escribiendo(frame, titulo, TITULO, 2) && frame % 20 < 12;
	const fueraCabecera = seVa(frame, 0, salidaEn, 4);

	/* Las filas que caen: las dos unidades y, dentro de cada una, sus columnas. */
	let indice = 0;

	return (
		<div style={{ width: ANCHO, height: '100%', padding: `${U.arriba}px ${U.lados}px`, boxSizing: 'border-box' }}>
			<div style={{ height: U.titulo, opacity: 1 - fueraCabecera, transform: `translateY(${-fueraCabecera * 22}px)` }}>
				<div style={{ fontSize: 28, fontWeight: 700, color: TEXTO, whiteSpace: 'pre' }}>
					{escrito(frame, titulo, TITULO, 2)}
					<span style={{ opacity: cursor ? 1 : 0 }}>|</span>
				</div>
				<div style={{ fontSize: 16, color: TEXTO_TENUE, marginTop: 6 }}>Matemáticas · 9°B · Periodo 2</div>
			</div>

			{/*
			  * EL PÁRRAFO DE AYUDA. Va con su fondo tenue y su filete de acento a la izquierda, que es
			  * como la aplicación marca lo que no es un dato sino una explicación. Sin ese fondo, a
			  * 16 px y sobre blanco, se lee como una migaja más y nadie lo mira.
			  */}
			<div
				style={{
					height: U.ayuda,
					marginBottom: U.huecoTrasAyuda,
					display: 'flex',
					alignItems: 'center',
					padding: '0 18px',
					boxSizing: 'border-box',
					borderRadius: 8,
					borderLeft: `3px solid ${ACENTO}`,
					background: `${ACENTO}10`,
					fontSize: 16,
					lineHeight: 1.35,
					color: TEXTO,
					opacity: llega(frame, fps, 0, LISTA, PASO).opacidad * (1 - fueraCabecera),
				}}
			>
				{AYUDA_DE_UNIDADES}
			</div>

			{UNIDADES.map((unidad) => {
				indice += 1;
				const llegada = llega(frame, fps, indice, LISTA, PASO);
				const fuera = estiloDeSalida(seVa(frame, indice, salidaEn, 4));

				return (
					<div
						key={unidad.nombre}
						style={{
							marginBottom: U.huecoTrasUnidad,
							opacity: llegada.opacidad * fuera.opacidad,
							transform: `translate(${llegada.x + fuera.x}px, ${llegada.y}px)`,
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								height: U.unidad,
								padding: '0 16px',
								boxSizing: 'border-box',
								borderRadius: '8px 8px 0 0',
								border: `1px solid ${BORDE}`,
								background: '#eef3f9',
								fontSize: 18,
								fontWeight: 600,
								color: TEXTO,
							}}
						>
							<span style={{ flex: 1 }}>{unidad.nombre}</span>
							{unidad.delColegio && <Candado />}
							<span style={{ fontSize: 16, color: TEXTO_TENUE, marginLeft: 12 }}>{unidad.porcentaje} %</span>
						</div>

						{unidad.columnas.map((col, c) => (
							<div
								key={col.nombre}
								style={{
									display: 'flex',
									alignItems: 'center',
									height: U.columna,
									padding: '0 16px 0 34px',
									boxSizing: 'border-box',
									borderLeft: `1px solid ${BORDE}`,
									borderRight: `1px solid ${BORDE}`,
									borderBottom: `1px solid ${BORDE}`,
									borderRadius: c === unidad.columnas.length - 1 ? '0 0 8px 8px' : undefined,
									background: SUPERFICIE,
									fontSize: 16,
									color: TEXTO,
								}}
							>
								<span style={{ flex: 1 }}>{col.nombre}</span>
								<span style={{ fontSize: 15, color: TEXTO_TENUE }}>{col.porcentaje} %</span>
							</div>
						))}
					</div>
				);
			})}

			{/*
			  * EL HUECO DE AÑADIR. Es donde vive la frase que cambia entre los dos modelos, así que se
			  * dibuja con su texto de marcador de posición tal cual, no con un campo vacío.
			  */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 12,
					height: U.formulario,
					opacity: llega(frame, fps, UNIDADES.length + 1, LISTA, PASO).opacidad * (1 - seVa(frame, 3, salidaEn, 4)),
				}}
			>
				<div
					style={{
						flex: 1,
						height: 42,
						display: 'flex',
						alignItems: 'center',
						padding: '0 14px',
						boxSizing: 'border-box',
						borderRadius: 8,
						border: `1px solid ${BORDE}`,
						background: SUPERFICIE,
						fontSize: 16,
						color: TEXTO_TENUE,
					}}
				>
					{PLACEHOLDER_COLUMNA}
				</div>
				<div
					style={{
						height: 42,
						display: 'flex',
						alignItems: 'center',
						padding: '0 20px',
						borderRadius: 8,
						background: ACENTO,
						color: '#fff',
						fontSize: 16,
						fontWeight: 600,
					}}
				>
					{BOTON_COLUMNA}
				</div>
			</div>
		</div>
	);
};

/*
 * EL CANDADO DE «LO PUSO EL COLEGIO». No es decoración: distingue la fila que sembró la plantilla
 * del año de la que escribió el docente, y de si el colegio le deja tocarla o no.
 */
const Candado: React.FC = () => (
	<span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: TEXTO_TENUE, fontWeight: 500 }}>
		<svg width="14" height="14" viewBox="0 0 14 14">
			<rect x="3" y="6.2" width="8" height="5.6" rx="1.2" fill="none" stroke={TEXTO_TENUE} strokeWidth="1.3" />
			<path d="M4.9 6.2 V4.6 a2.1 2.1 0 0 1 4.2 0 V6.2" fill="none" stroke={TEXTO_TENUE} strokeWidth="1.3" />
		</svg>
		Lo puso el colegio
	</span>
);
