import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { ALMENDROS, COLEGIO, nombreDe as nombreDelColegio } from '../colegio';
import { Escudo, PAPEL } from '../cierre-6/Papel';
import { DOCENTES, MINIMA, SEPTIMO_A, TITULAR_7A, desempeno, nombreDe } from '../informes/gente';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * UN BOLETÍN DEL PERIODO (tipo 1), dibujado sencillo: lo que el vídeo de ajustes necesita es que se
 * VEA qué cambia cada casilla, no leer cada renglón. Lleva lo que las siete casillas gobiernan en
 * `opciones-del-informe.ts`: la foto (`mostrar_foto`), los rojos (`show_rojos`), la gráfica
 * (`show_grafico`, en su propia fila después del comportamiento, `boletin-periodo.html:504`), la
 * leyenda de escalas (`show_info_escalas`), las pendientes (`show_tabla_perdidas`) y las dos firmas.
 *
 * El colegio es el inventado de `competencias/`; la alumna y las notas, inventadas.
 */

export const HOJA_BOLETIN = { ancho: 760, alto: 984 };

export interface Casillas {
	foto: boolean;
	rector: boolean;
	titular: boolean;
	rojos: boolean;
	grafico: boolean;
	escalas: boolean;
	pendientes: boolean;
}

const ALUMNA = SEPTIMO_A[1];
const NOTAS = [74, 82, 57, 88, 91, 95, 79, 86, 90, 84];

export const ALTO_GRAFICA = 186;
/** Dónde empieza la gráfica en la hoja: es lo que se enfoca al apagarla. */
export const Y_GRAFICA = 506;

/** Quién sale en la hoja. Por defecto, una alumna de 7°A. */
export interface DeQuien {
	grupo: string;
	nombre: string;
	sexo: 'mujer' | 'hombre';
	variante: number;
	titular: string;
}

const DE_7A: DeQuien = { grupo: '7°A', nombre: nombreDe(ALUMNA), sexo: ALUMNA.sexo, variante: ALUMNA.variante, titular: TITULAR_7A };

export const Boletin: React.FC<{ c: Casillas; de?: DeQuien }> = ({ c, de = DE_7A }) => (
	<div
		style={{
			width: HOJA_BOLETIN.ancho,
			height: HOJA_BOLETIN.alto,
			boxSizing: 'border-box',
			padding: '26px 30px',
			background: '#fff',
			color: '#000',
			boxShadow: '0 10px 30px rgba(15,28,52,.14), 0 1px 4px rgba(15,28,52,.08)',
			fontSize: 12,
			position: 'relative',
			overflow: 'hidden',
		}}
	>
		{/* Membrete. */}
		<div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 64, borderBottom: `2px solid ${PAPEL.azul}`, paddingBottom: 8, boxSizing: 'border-box' }}>
			<Escudo tam={52} />
			<div style={{ flex: 1, textAlign: 'center' }}>
				<div style={{ fontSize: 15, fontWeight: 700, color: PAPEL.azulTexto }}>
					{COLEGIO.nombre} - {COLEGIO.abreviatura}
				</div>
				<div style={{ fontSize: 9.5, color: PAPEL.gris }}>{COLEGIO.resolucion}</div>
				<div style={{ display: 'inline-block', marginTop: 4, padding: '2px 12px', borderRadius: 999, background: PAPEL.banda, color: PAPEL.azul, fontSize: 11, fontWeight: 700, letterSpacing: 0.6 }}>
					BOLETIN PERIODO 3 - 2026
				</div>
			</div>
			<div style={{ width: 52, height: 52, borderRadius: 4, overflow: 'hidden', background: '#eef2f7', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', opacity: c.foto ? 1 : 0 }}>
				<Avatar tipo={de.sexo} variante={de.variante} tam={50} />
			</div>
		</div>
		<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12 }}>
			<div>
				Grupo: <b>{de.grupo}</b>
				<div style={{ fontSize: 11, color: PAPEL.gris }}>Titular: {de.titular}</div>
			</div>
			<div style={{ textAlign: 'right' }}>
				<b style={{ fontSize: 14 }}>{de.nombre.toUpperCase()}</b>
				<div style={{ fontSize: 11, color: PAPEL.gris }}>Periodo 3</div>
			</div>
		</div>

		{/* Las asignaturas. */}
		<div style={{ marginTop: 12 }}>
			<div style={{ display: 'flex', background: PAPEL.banda, color: PAPEL.azulTexto, fontWeight: 700, fontSize: 11, padding: '4px 8px', borderLeft: `3px solid ${PAPEL.azul}` }}>
				<span style={{ flex: 1 }}>ASIGNATURA</span>
				<span style={{ width: 80, textAlign: 'center' }}>AUS / TARD</span>
				<span style={{ width: 90, textAlign: 'center' }}>DESEMPEÑO</span>
				<span style={{ width: 50, textAlign: 'right' }}>NOTA</span>
			</div>
			{DOCENTES.map((d, i) => {
				const n = NOTAS[i];
				const perdida = n < MINIMA;
				return (
					<div key={d.materia} style={{ display: 'flex', alignItems: 'center', height: 30, padding: '0 8px', borderBottom: `0.8px solid ${PAPEL.azulSuave}`, fontSize: 12 }}>
						<span style={{ flex: 1 }}>
							<b>{d.materia}</b> <i style={{ color: PAPEL.gris, fontSize: 10.5 }}>- Prof. {d.nombre}</i>
						</span>
						<span style={{ width: 80, textAlign: 'center', color: PAPEL.gris }}>{i === 2 ? '2 / 1' : i === 5 ? '1 / 0' : '0 / 0'}</span>
						<span style={{ width: 90, textAlign: 'center', fontSize: 10.5, fontWeight: 700, color: perdida && c.rojos ? PAPEL.rojo : '#000' }}>{desempeno(n)}</span>
						<span
							style={{
								width: 50,
								textAlign: 'right',
								fontWeight: 700,
								fontSize: 13,
								color: perdida && c.rojos ? PAPEL.rojo : '#000',
							}}
						>
							{perdida && c.rojos ? <span style={{ border: `1.2px solid ${PAPEL.rojo}`, padding: '0 3px', borderRadius: 2 }}>{n}</span> : n}
						</span>
					</div>
				);
			})}
			<div style={{ display: 'flex', alignItems: 'center', height: 32, padding: '0 8px', marginTop: 6, background: PAPEL.banda, fontSize: 12 }}>
				<b style={{ flex: 1, color: PAPEL.azulTexto }}>Comportamiento</b>
				<span style={{ width: 90, textAlign: 'center', fontSize: 10.5, fontWeight: 700 }}>ALTO</span>
				<span style={{ width: 50, textAlign: 'right', fontWeight: 700, fontSize: 13 }}>86</span>
			</div>
		</div>

		{/* La gráfica, en su propia fila. */}
		{c.grafico && <Grafica />}

		{c.escalas && (
			<div style={{ marginTop: 12, fontSize: 10, color: PAPEL.gris, lineHeight: 1.5, borderTop: `0.8px solid ${PAPEL.azulSuave}`, paddingTop: 6 }}>
				Escala nacional: Bajo 0-59 · Básico 60-79 · Alto 80-94 · Superior 95-100. Intensidad horaria semanal y ausencias por asignatura.
			</div>
		)}

		{c.pendientes && (
			<div style={{ marginTop: 10, fontSize: 11, border: `0.8px solid ${PAPEL.azulSuave}`, padding: '4px 8px' }}>
				<b>Notas pendientes del año:</b> Ciencias naturales (Per 3).
			</div>
		)}

		{/* Las firmas. */}
		<div style={{ display: 'flex', gap: 60, marginTop: 44, padding: '0 40px' }}>
			{c.rector && <Firma cargo="Rector" nombre={nombreDelColegio(ALMENDROS.rector)} />}
			{c.titular && <Firma cargo="Titular del grupo" nombre={de.titular} />}
		</div>
	</div>
);

const Firma: React.FC<{ cargo: string; nombre: string }> = ({ cargo, nombre }) => (
	<div style={{ flex: 1, textAlign: 'center' }}>
		<div style={{ height: 30 }} />
		<div style={{ borderTop: `1px solid ${PAPEL.linea}`, paddingTop: 3, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase' }}>{nombre}</div>
		<div style={{ fontSize: 10, color: PAPEL.gris }}>{cargo}</div>
	</div>
);

const Grafica: React.FC = () => {
	const alto = 130;
	return (
		<div style={{ marginTop: 14, height: ALTO_GRAFICA - 14, boxSizing: 'border-box', border: `0.8px solid ${PAPEL.azulSuave}`, borderRadius: 4, padding: '10px 16px 8px', position: 'relative' }}>
			<div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: alto, borderBottom: `1px solid ${PAPEL.gris}` }}>
				{DOCENTES.map((d, i) => {
					const n = NOTAS[i];
					return (
						<div key={d.alias} style={{ width: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
							<span style={{ fontSize: 10, fontWeight: 700, marginBottom: 2 }}>{n}</span>
							<div
								style={{
									width: 30,
									height: (n / 100) * (alto - 18),
									borderRadius: '3px 3px 0 0',
									background: n < MINIMA ? '#e06666' : 'linear-gradient(#5b8fd1, #2f5f9e)',
									boxShadow: 'inset -3px 0 0 rgba(0,0,0,.12)',
								}}
							/>
						</div>
					);
				})}
			</div>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
				{DOCENTES.map((d) => (
					<span key={d.alias} style={{ width: 44, textAlign: 'center', fontSize: 9.5, color: PAPEL.gris }}>
						{d.alias}
					</span>
				))}
			</div>
		</div>
	);
};
