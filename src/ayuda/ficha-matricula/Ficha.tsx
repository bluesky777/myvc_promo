import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { ALMENDROS, COLEGIO } from '../colegio';
import { Escudo, PAPEL } from '../cierre-6/Papel';
import { SEPTIMO_A, nombreDe } from '../informes/gente';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA FICHA DE MATRÍCULA (`ficha-matricula.html`), carta vertical: membrete con «Ficha de matrícula ·
 * Año lectivo 2026», la franja con la foto --aquí el avatar dibujado--, el nombre, sus pastillas y
 * el número de matrícula; «Datos del estudiante», «Acudientes» (la ocupación del segundo, en blanco:
 * se pierde cuando el acudiente se asigna en vez de crearse, y la hoja la deja con raya),
 * «Requisitos de matrícula» (Sí, No aplica o ☐) y el pie con la declaración, tres firmas y la
 * huella. TODO INVENTADO: documentos y teléfonos llevan el 555, y el correo, un dominio de ejemplo.
 */

export const HOJA = { ancho: 816, alto: 1056 };

export const ALUMNA = SEPTIMO_A[1];

const DATOS: [string, string, boolean?][] = [
	['Tipo de documento', 'Tarjeta de identidad'],
	['Documento', '1.000.555.419'],
	['Expedido en', `${ALMENDROS.ciudad}, ${ALMENDROS.departamento}`],
	['Fecha de nacimiento', '2013-04-17'],
	['Lugar de nacimiento', `${ALMENDROS.ciudad}, ${ALMENDROS.departamento}`],
	['Sexo', 'Femenino'],
	['Dirección', 'Calle 9 # 4-21', true],
	['Barrio', 'La Palmita'],
	['Ciudad de residencia', `${ALMENDROS.ciudad}, ${ALMENDROS.departamento}`],
	['Zona', 'Urbana'],
	['Estrato', '2'],
	['Teléfono', '(607) 555 0123'],
	['Celular', '317 555 1037'],
	['Correo', 'familia.arboleda@correo.example', true],
	['EPS', 'EPS del Norte'],
	['Tipo de sangre', 'O+'],
	['Religión', 'Católica'],
	['Necesidad educativa especial', 'No', true],
];

const ACUDIENTES = [
	{
		nombre: 'Cuesta Rincón Luz Marina',
		parentesco: 'Madre',
		campos: [['Documento', 'CC 1.000.555.234'], ['Ocupación', 'Auxiliar de enfermería'], ['Teléfono', '(607) 555 0123'], ['Celular', '315 555 2211'], ['Correo', 'luzmcuesta@correo.example', true], ['Dirección', 'Calle 9 # 4-21 · La Palmita', true]] as [string, string, boolean?][],
	},
	{
		nombre: 'Arboleda Peña Carlos Mario',
		parentesco: 'Padre',
		campos: [['Documento', 'CC 1.000.555.678'], ['Ocupación', ''], ['Teléfono', ''], ['Celular', '318 555 4402'], ['Correo', '', true], ['Dirección', 'Calle 9 # 4-21 · La Palmita', true]] as [string, string, boolean?][],
	},
];

export const REQUISITOS: [string, string, string][] = [
	['Registro civil de nacimiento', 'Sí', ''],
	['Fotocopia de la tarjeta de identidad', 'Sí', ''],
	['Certificado de afiliación a la EPS', '☐', ''],
	['Boletín final del año anterior', 'Sí', 'Trae el de 6°A'],
	['Carné de vacunas', 'No aplica', 'Sólo para preescolar'],
	['Dos fotos 3×4', '☐', ''],
];

/* ── Geometría (px de la hoja) ─────────────────────────────────────────────────────────────── */

export const Y = { membrete: 28, franja: 110, datos: 222, acudientes: 500, requisitos: 790, pie: 966 };
export const RECTS = {
	datos: { x: 30, y: Y.datos, ancho: 756, alto: Y.acudientes - Y.datos - 10 },
	acudientes: { x: 30, y: Y.acudientes, ancho: 756, alto: Y.requisitos - Y.acudientes - 10 },
	requisitos: { x: 30, y: Y.requisitos, ancho: 756, alto: Y.pie - Y.requisitos - 8 },
	pie: { x: 30, y: Y.pie, ancho: 756, alto: 80 },
};

const Rotulo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: PAPEL.azulTexto, borderBottom: `1.2px solid ${PAPEL.azul}`, paddingBottom: 3, marginBottom: 6 }}>{children}</div>
);

const Campos: React.FC<{ campos: [string, string, boolean?][] }> = ({ campos }) => (
	<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 14, rowGap: 3 }}>
		{campos.map(([dt, dd, ancho]) => (
			<div key={dt} style={{ gridColumn: ancho ? 'span 2' : undefined, minWidth: 0 }}>
				<div style={{ fontSize: 9, color: PAPEL.gris, textTransform: 'uppercase', letterSpacing: 0.4 }}>{dt}</div>
				<div style={{ fontSize: 11.5, minHeight: 15, lineHeight: '15px', borderBottom: '0.8px solid #b9c3cf', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dd}</div>
			</div>
		))}
	</div>
);

const Pastilla: React.FC<{ children: React.ReactNode; ojo?: boolean }> = ({ children, ojo = false }) => (
	<span style={{ fontSize: 10.5, fontWeight: 700, padding: '1px 8px', borderRadius: 99, background: ojo ? '#fdecea' : PAPEL.banda, color: ojo ? PAPEL.rojo : PAPEL.azul }}>{children}</span>
);

export const FichaMatricula: React.FC = () => (
	<div style={{ width: HOJA.ancho, height: HOJA.alto, boxSizing: 'border-box', background: '#fff', color: '#000', position: 'relative', boxShadow: '0 16px 44px rgba(15,28,52,.16), 0 1px 4px rgba(15,28,52,.08)' }}>
		{/* Membrete. */}
		<div style={{ position: 'absolute', left: 30, right: 30, top: Y.membrete, display: 'flex', alignItems: 'center', gap: 14, height: 66, borderBottom: `2px solid ${PAPEL.azul}`, boxSizing: 'border-box', paddingBottom: 8 }}>
			<Escudo tam={54} />
			<div style={{ flex: 1, lineHeight: 1.35 }}>
				<div style={{ fontSize: 14.5, fontWeight: 700, color: PAPEL.azulTexto }}>{COLEGIO.nombre}</div>
				<div style={{ fontSize: 9.5, color: PAPEL.gris }}>{COLEGIO.resolucion}</div>
			</div>
			<div style={{ textAlign: 'right' }}>
				<div style={{ fontSize: 17, fontWeight: 800 }}>Ficha de matrícula</div>
				<div style={{ fontSize: 11.5, color: PAPEL.gris }}>Año lectivo 2026</div>
			</div>
		</div>

		{/* La franja: foto, nombre, pastillas y la matrícula. */}
		<div style={{ position: 'absolute', left: 30, right: 30, top: Y.franja, height: 96, display: 'flex', alignItems: 'center', gap: 16, background: '#f4f8fc', borderRadius: 6, padding: '0 14px', boxSizing: 'border-box' }}>
			<div style={{ width: 70, height: 84, borderRadius: 4, overflow: 'hidden', background: '#e8eef5', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', flexShrink: 0 }}>
				<Avatar tipo={ALUMNA.sexo} variante={ALUMNA.variante} tam={70} />
			</div>
			<div style={{ flex: 1 }}>
				<div style={{ fontSize: 18, fontWeight: 700 }}>{nombreDe(ALUMNA)}</div>
				<div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
					<Pastilla>7°A</Pastilla>
					<Pastilla>Matriculado</Pastilla>
				</div>
			</div>
			<div style={{ fontSize: 11, lineHeight: 1.6, textAlign: 'right' }}>
				<div>
					<span style={{ color: PAPEL.gris }}>N.º de matrícula </span>
					<b>0419</b>
				</div>
				<div>
					<span style={{ color: PAPEL.gris }}>Fecha </span>
					<b>2026-01-20</b>
				</div>
				<div>
					<span style={{ color: PAPEL.gris }}>Folio </span>
					<b>37</b>
				</div>
			</div>
		</div>

		<div style={{ position: 'absolute', left: RECTS.datos.x, top: RECTS.datos.y, width: RECTS.datos.ancho }}>
			<Rotulo>Datos del estudiante</Rotulo>
			<Campos campos={DATOS} />
		</div>

		<div style={{ position: 'absolute', left: RECTS.acudientes.x, top: RECTS.acudientes.y, width: RECTS.acudientes.ancho }}>
			<Rotulo>Acudientes</Rotulo>
			{ACUDIENTES.map((a) => (
				<div key={a.nombre} style={{ border: '0.8px solid #d5dde6', borderRadius: 5, padding: '6px 10px', marginBottom: 8 }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
						<b style={{ fontSize: 12.5 }}>{a.nombre}</b>
						<Pastilla>{a.parentesco}</Pastilla>
					</div>
					<Campos campos={a.campos} />
				</div>
			))}
		</div>

		<div style={{ position: 'absolute', left: RECTS.requisitos.x, top: RECTS.requisitos.y, width: RECTS.requisitos.ancho }}>
			<Rotulo>Requisitos de matrícula</Rotulo>
			<div style={{ border: `0.8px solid ${PAPEL.azulSuave}`, fontSize: 11.5 }}>
				<div style={{ display: 'flex', background: PAPEL.banda, color: PAPEL.azulTexto, fontWeight: 700, height: 20, alignItems: 'center' }}>
					<span style={{ flex: 1, paddingLeft: 6 }}>Requisito</span>
					<span style={{ width: 90, textAlign: 'center', borderLeft: `0.8px solid ${PAPEL.azulSuave}` }}>Entregado</span>
					<span style={{ width: 230, paddingLeft: 6, borderLeft: `0.8px solid ${PAPEL.azulSuave}` }}>Observación</span>
				</div>
				{REQUISITOS.map(([r, e, o]) => (
					<div key={r} style={{ display: 'flex', height: 19, alignItems: 'center', borderTop: `0.8px solid ${PAPEL.azulSuave}` }}>
						<span style={{ flex: 1, paddingLeft: 6 }}>{r}</span>
						<span style={{ width: 90, textAlign: 'center', borderLeft: `0.8px solid ${PAPEL.azulSuave}`, fontWeight: e === 'Sí' ? 700 : 400, fontSize: e === '☐' ? 15 : 11.5 }}>{e}</span>
						<span style={{ width: 230, paddingLeft: 6, borderLeft: `0.8px solid ${PAPEL.azulSuave}`, color: PAPEL.gris, fontSize: 10.5 }}>{o}</span>
					</div>
				))}
			</div>
		</div>

		<div style={{ position: 'absolute', left: RECTS.pie.x, top: RECTS.pie.y, width: RECTS.pie.ancho, display: 'flex', gap: 22 }}>
			<div style={{ flex: 1 }}>
				<div style={{ fontSize: 10, color: PAPEL.gris, lineHeight: 1.4 }}>
					Declaro que los datos consignados en esta ficha son ciertos, y acepto el manual de convivencia y el sistema institucional de evaluación del colegio.
				</div>
				<div style={{ display: 'flex', gap: 22, marginTop: 28 }}>
					{['Acudiente', 'Estudiante', 'Secretaría'].map((r) => (
						<div key={r} style={{ flex: 1, borderTop: `1px solid ${PAPEL.linea}`, textAlign: 'center', fontSize: 10.5, paddingTop: 2 }}>
							{r}
						</div>
					))}
				</div>
			</div>
			<div style={{ width: 64, height: 80, border: `1px solid ${PAPEL.linea}`, borderRadius: 4, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', fontSize: 10, paddingBottom: 3, boxSizing: 'border-box', flexShrink: 0 }}>Huella</div>
		</div>
	</div>
);
