import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { BotonP, En, IconoP, LETRA, MAIN, Pagina, TEXTO, TEXTO_TENUE, Titulo, type Rect } from '../personas/comun';
import type { Alumno } from '../secretaria/personas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA FICHA DEL ALUMNO (`paginas/persona/persona.html`), sólo lo de arriba: el título «Ficha de …»,
 * «Crear alumno» y «Ver todos los certificados», el buscador de otra persona, y la tarjeta básica
 * (`persona-basico.html`) con la foto, el grupo, las cuatro etiquetas y los primeros campos. Lo de
 * abajo --las pestañas-- no se ve en el vídeo.
 *
 * EL ALUMNO ES EL DEL CERTIFICADO DE LOS OTROS VÍDEOS (`certificado-imprimir/datos.ts`): Juan
 * Esteban Cardona Mejía, inventado. Aquí en 7°A, en 2026. La foto es el avatar dibujado.
 */

const doc = (n: number) => `10000${String(n).padStart(5, '0')}`;
const cel = (n: number) => `30000000${String(n % 100).padStart(2, '0')}`;
const alumno = (id: number, nombres: string, apellidos: string, sexo: 'M' | 'F', variante: number, usuario: string): Alumno => ({
	id, nombres, apellidos, sexo, variante, documento: doc(id), celular: cel(id), matricula: String(id - 3900), nacimiento: '2013-01-01', usuario,
});

/** 7°A, 2026, en el orden de la rejilla (por apellido). */
export const SEPTIMO_A: Alumno[] = [
	alumno(4301, 'Samuel', 'Arango Vélez', 'M', 2, 'samuel.arango'),
	alumno(4302, 'Valeria', 'Bedoya Ríos', 'F', 4, 'valeria.bedoya'),
	alumno(4287, 'Juan Esteban', 'Cardona Mejía', 'M', 3, 'juan.cardona'),
	alumno(4304, 'Mariana', 'Duque Salazar', 'F', 1, 'mariana.duque'),
	alumno(4305, 'Felipe', 'Echeverri Gil', 'M', 5, 'felipe.echeverri'),
	alumno(4306, 'Isabella', 'Franco Toro', 'F', 0, 'isabella.franco'),
];
export const EL_ALUMNO = 2;
export const GRUPO = '7A';
export const NOMBRE = `${SEPTIMO_A[EL_ALUMNO].nombres} ${SEPTIMO_A[EL_ALUMNO].apellidos}`;

/** Los años que se certifican: sus matrículas MATR o ASIS. 2025 fue un retiro y no sale. */
export const MATRICULAS = [
	{ year: 2024, grado: '6°A', estado: 'MATR', numero: 212 },
	{ year: 2025, grado: '7°A', estado: 'RETI', numero: 0 },
	{ year: 2026, grado: '7°A', estado: 'MATR', numero: 144 },
];
export const CERTIFICADOS = MATRICULAS.filter((m) => ['MATR', 'ASIS'].includes(m.estado));

/* ── Geometría de la ficha (cáscara) ──────────────────────────────────────────────────────── */

export const ANCHO_CREAR = 140;
export const ANCHO_CERTIFICADOS = 236;
const TITULO_ANCHO = 520;
export const BOTON_CERTIFICADOS: Rect = { x: MAIN.x + TITULO_ANCHO + 16 + ANCHO_CREAR + 8, y: MAIN.y + 4, ancho: ANCHO_CERTIFICADOS, alto: 32 };
export const CABECERA_FICHA: Rect = { x: MAIN.x, y: MAIN.y, ancho: MAIN.ancho, alto: 40 };
const Y_BUSCADOR = MAIN.y + 40 + 16;
const Y_TARJETA = Y_BUSCADOR + 32 + 16;

export const PantallaFicha: React.FC<{ encimaCertificados?: boolean }> = ({ encimaCertificados = false }) => {
	const a = SEPTIMO_A[EL_ALUMNO];
	return (
		<Pagina alto={Y_TARJETA + 300 - (MAIN.y - 16)}>
			<En r={{ x: MAIN.x, y: MAIN.y, ancho: TITULO_ANCHO, alto: 40 }} style={{ display: 'flex', alignItems: 'center' }}>
				<Titulo texto={`Ficha de ${NOMBRE}`} />
			</En>
			<En r={{ x: MAIN.x + TITULO_ANCHO + 16, y: MAIN.y + 4 }}>
				<BotonP texto="Crear alumno" icono="plus" tipo="primary" ancho={ANCHO_CREAR} />
			</En>
			<En r={BOTON_CERTIFICADOS}>
				<BotonP texto="Ver todos los certificados" icono="certificado" ancho={ANCHO_CERTIFICADOS} encima={encimaCertificados} />
			</En>

			<En r={{ x: MAIN.x, y: Y_BUSCADOR, ancho: 420, alto: 32 }} style={{ boxSizing: 'border-box', border: '1px solid #d9d9d9', borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 11px', fontSize: LETRA, color: 'rgba(0,0,0,0.3)' }}>
				Buscar otra persona por nombre
			</En>

			<En r={{ x: MAIN.x, y: Y_TARJETA, ancho: MAIN.ancho, alto: 280 }} style={{ boxSizing: 'border-box', border: '1px solid #f0f0f0', borderRadius: 10, padding: 20 }}>
				<div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
					{/* La foto oficial: cuadrada, de 140. Aquí el avatar dibujado dentro del cuadro. */}
					<div style={{ width: 140, height: 140, borderRadius: 8, overflow: 'hidden', background: '#e6f0ff', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', flex: 'none' }}>
						<Avatar tipo="hombre" variante={a.variante} tam={140} />
					</div>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
						<span style={{ fontSize: 20, fontWeight: 700, color: TEXTO, marginRight: 6 }}>7°A</span>
						<Tag>Repitente: No</Tag>
						<Tag>Egresado: No</Tag>
						<Tag>Nuevo: No</Tag>
						<Tag verde>Activo</Tag>
					</div>
				</div>
				<div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
					<Campo etiqueta="Nombres" valor={a.nombres} />
					<Campo etiqueta="Apellidos" valor={a.apellidos} />
					<div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 260 }}>
						<span style={{ fontSize: LETRA - 1, color: TEXTO_TENUE }}>Sexo</span>
						<div style={{ display: 'flex', gap: 16, alignItems: 'center', height: 32, fontSize: LETRA, color: TEXTO }}>
							<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Radio marcado /> Masculino</span>
							<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Radio /> Femenino</span>
						</div>
					</div>
				</div>
			</En>
		</Pagina>
	);
};

const Tag: React.FC<{ children: React.ReactNode; verde?: boolean }> = ({ children, verde = false }) => (
	<span style={{ fontSize: 13, padding: '1px 8px', borderRadius: 4, border: `1px solid ${verde ? '#b7eb8f' : '#d9d9d9'}`, background: verde ? '#f6ffed' : '#fafafa', color: verde ? '#389e0d' : TEXTO }}>{children}</span>
);
const Campo: React.FC<{ etiqueta: string; valor: string }> = ({ etiqueta, valor }) => (
	<div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 300 }}>
		<span style={{ fontSize: LETRA - 1, color: TEXTO_TENUE }}>{etiqueta}</span>
		<div style={{ height: 32, boxSizing: 'border-box', border: '1px solid #d9d9d9', borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 11px', fontSize: LETRA, color: TEXTO }}>{valor}</div>
	</div>
);
const Radio: React.FC<{ marcado?: boolean }> = ({ marcado = false }) => (
	<span style={{ width: 16, height: 16, borderRadius: '50%', boxSizing: 'border-box', border: `${marcado ? 5 : 1}px solid ${marcado ? '#1677ff' : '#d9d9d9'}`, display: 'inline-block' }} />
);

export { IconoP };
