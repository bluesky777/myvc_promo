import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { ALTO_CONTROL, Boton, Campo, Icono, Panel, Selector, altoDelPanel, type Opcion } from '../montar-el-ano/ant';
import { ACENTO, BORDE, Cabecera, En, LETRA, MAIN, Pagina, PELIGRO, SUPERFICIE, TEXTO, TEXTO_TENUE, anchoDeBoton } from '../secretaria/piezas';
import {
	BOTON_CERRAR, BOTON_CREAR, BOTON_ES_ESTE, BOTON_ESCAPE, BOTON_VER_FICHA, CAMPOS_BASICA, ETIQUETAS, LETRA_FORM, LEYENDA_BASICA, PESTANAS_Y, RADIOS, TARJETA,
	ANCHO_GRUPO, anchoDeRadio, disposicionNuevo, xDelControl, type CampoBasica,
} from './plano';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «NUEVO ALUMNO», la pestaña «Información» con «Llenar más datos» cerrado. Textos de
 * `alumnos-nuevo.html` y de `aviso-duplicados.ts` tal cual. No sabe de tiempo.
 *
 * LA TARJETA DEL DUPLICADO tiene dos caras: la roja que FRENA («Esta persona ya está en el sistema»,
 * con el botón rojo de escape) y la amarilla que sólo avisa («Hay alguien parecido — míralo antes de
 * crear»). Pulsar el escape pasa de la una a la otra (`alumnos-nuevo.ts:414-417`).
 */

export interface Candidato {
	nombre: string;
	marca: string;
	tipo: 'mujer' | 'hombre';
	variante: number;
	doc: string;
	historia: React.ReactNode;
}

export interface EstadoNuevo {
	nombres: string;
	apellidos: string;
	activo: 'nombres' | 'apellidos' | null;
	cursor: boolean;
	tarjeta: { frena: boolean; aparece: number; candidato: Candidato } | null;
	encimaFicha?: 0 | 1 | null;
	encimaEscape?: boolean;
	grupo: string | null;
	grupoAbierto?: { opciones: Opcion[]; aparece: number; resaltada: number | null } | null;
	encimaCrear?: boolean;
	cargando?: boolean;
	giro?: number;
	desplazada?: number;
	opacidad?: number;
}

const PELIGRO_TINTE = '#fff1f0';
const PELIGRO_BORDE = '#ffa39e';
const PELIGRO_LEGIBLE = '#cf1322';
const AVISO_TINTE = '#fffbe6';
const AVISO_BORDE = '#ffe58f';
const AVISO_LEGIBLE = '#ad6800';

const Fila: React.FC<{ etiqueta: string | null; children: React.ReactNode }> = ({ etiqueta, children }) => (
	<div style={{ display: 'flex', alignItems: 'center', height: ALTO_CONTROL, fontSize: LETRA_FORM }}>
		{etiqueta && <div style={{ width: xDelControl(etiqueta), flex: 'none', whiteSpace: 'nowrap', color: TEXTO }}>{etiqueta}:</div>}
		<div style={{ flex: 1, minWidth: 0 }}>{children}</div>
	</div>
);

const Radio: React.FC<{ texto: string; marcado: boolean }> = ({ texto, marcado }) => (
	<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginRight: 22 }}>
		<span style={{ width: 16, height: 16, borderRadius: '50%', boxSizing: 'border-box', border: `${marcado ? 5 : 1}px solid ${marcado ? ACENTO : BORDE}`, background: SUPERFICIE }} />
		{texto}
	</span>
);

const Marca: React.FC<{ texto: string }> = ({ texto }) => (
	<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginRight: 22 }}>
		<span style={{ width: 16, height: 16, borderRadius: 4, boxSizing: 'border-box', border: `1px solid ${BORDE}`, background: SUPERFICIE }} />
		{texto}
	</span>
);

export const PantallaNuevo: React.FC<{ estado: EstadoNuevo }> = ({ estado: e }) => {
	const d = disposicionNuevo(e.tarjeta ? e.tarjeta.frena : null);
	const frena = Boolean(e.tarjeta?.frena);

	const control = (c: CampoBasica) => {
		switch (c) {
			case 'nombres':
				return <Campo valor={e.nombres} foco={e.activo === 'nombres'} cursor={e.activo === 'nombres' && e.cursor} />;
			case 'apellidos':
				return <Campo valor={e.apellidos} foco={e.activo === 'apellidos'} cursor={e.activo === 'apellidos' && e.cursor} />;
			case 'sexo':
				return <div style={{ display: 'flex' }}><Radio texto="Masculino" marcado /><Radio texto="Femenino" marcado={false} /></div>;
			case 'marcas':
				return <div style={{ display: 'flex' }}><Marca texto="Es nuevo" /><Marca texto="Es repitente" /></div>;
			case 'tipo':
				return <Selector marcador="Tipo de documento" ancho={220} />;
			default:
				return <Campo />;
		}
	};

	return (
		<Pagina alto={d.fin} desplazada={e.desplazada ?? 0} opacidad={e.opacidad ?? 1}>
			<Cabecera titulo="Nuevo alumno" botones={[{ texto: 'Cerrar', icono: 'arrow-left' }]} />

			{/* Las pestañas: «Información» elegida. */}
			<En r={{ x: 0, y: PESTANAS_Y, ancho: MAIN.ancho, alto: 46 }}>
				<div style={{ display: 'flex', gap: 32, height: 46, alignItems: 'center', boxShadow: `inset 0 -1px 0 #f0f0f0`, fontSize: LETRA }}>
					{['Información', 'Datos extras', 'Usuario'].map((t, i) => (
						<div key={t} style={{ height: 46, display: 'flex', alignItems: 'center', color: i === 0 ? ACENTO : TEXTO, boxShadow: i === 0 ? `inset 0 -2px 0 ${ACENTO}` : 'none' }}>{t}</div>
					))}
				</div>
			</En>

			<En r={{ x: 0, y: LEYENDA_BASICA }}>
				<div style={{ fontSize: LETRA_FORM + 1, fontWeight: 600 }}>Básica</div>
			</En>

			{CAMPOS_BASICA.map((c) => (
				<En key={c} r={{ x: 0, y: d.campo[c], ancho: MAIN.ancho }}>
					<Fila etiqueta={ETIQUETAS[c]}>{control(c)}</Fila>
				</En>
			))}

			{e.tarjeta && d.tarjeta !== null && (
				<En r={{ x: 0, y: d.tarjeta, ancho: MAIN.ancho, alto: d.tarjetaAlto }} opacidad={e.tarjeta.aparece}>
					<TarjetaDuplicado
						frena={frena}
						candidato={e.tarjeta.candidato}
						encimaFicha={e.encimaFicha ?? null}
						encimaEscape={e.encimaEscape ?? false}
					/>
				</En>
			)}

			<En r={{ x: 0, y: d.leyendaProceso }}>
				<div style={{ fontSize: LETRA_FORM + 1, fontWeight: 600 }}>Qué se va a hacer con él</div>
			</En>
			<En r={{ x: 0, y: d.radios }}>
				<div style={{ display: 'flex' }}>
					{RADIOS.map((r, i) => (
						<div
							key={r}
							style={{
								width: anchoDeRadio(r),
								height: ALTO_CONTROL,
								boxSizing: 'border-box',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: LETRA,
								border: `1px solid ${i === 0 ? ACENTO : BORDE}`,
								marginLeft: i === 0 ? 0 : -1,
								background: i === 0 ? ACENTO : SUPERFICIE,
								color: i === 0 ? '#fff' : TEXTO,
								borderRadius: i === 0 ? '6px 0 0 6px' : i === RADIOS.length - 1 ? '0 6px 6px 0' : 0,
								position: 'relative',
								zIndex: i === 0 ? 1 : 0,
							}}
						>
							{r}
						</div>
					))}
				</div>
			</En>
			<En r={{ x: 0, y: d.grupo, ancho: xDelControl('Grupo de 2026') + ANCHO_GRUPO }}>
				<Fila etiqueta="Grupo de 2026">
					<Selector marcador="Grupo" valor={e.grupo} abierto={Boolean(e.grupoAbierto)} ancho={ANCHO_GRUPO} />
				</Fila>
			</En>
			<En r={{ x: 0, y: d.masDatos }}>
				<Boton texto="Llenar más datos" tipo="link" />
			</En>

			<En r={{ x: MAIN.ancho - BOTON_CREAR - 8 - BOTON_CERRAR, y: d.pie }}>
				<div style={{ display: 'flex', gap: 8 }}>
					<Boton texto="Cerrar" ancho={BOTON_CERRAR} />
					<Boton texto="Crear" tipo="primary" ancho={BOTON_CREAR} deshabilitado={frena} encima={e.encimaCrear} cargando={e.cargando} giroCarga={e.giro ?? 0} />
				</div>
			</En>

			{e.grupoAbierto && (
				/* Abajo no cabe: el desplegable de Ant se abre hacia arriba. */
				<En r={{ x: xDelControl('Grupo de 2026'), y: d.grupo - 4 - altoDelPanel(e.grupoAbierto.opciones) }} z={5}>
					<Panel opciones={e.grupoAbierto.opciones} resaltada={e.grupoAbierto.resaltada} ancho={ANCHO_GRUPO} aparece={e.grupoAbierto.aparece} />
				</En>
			)}
		</Pagina>
	);
};

const TarjetaDuplicado: React.FC<{ frena: boolean; candidato: Candidato; encimaFicha: 0 | 1 | null; encimaEscape: boolean }> = ({
	frena, candidato: c, encimaFicha, encimaEscape,
}) => (
	<div
		style={{
			height: '100%',
			boxSizing: 'border-box',
			padding: `${TARJETA.relleno.v}px ${TARJETA.relleno.h}px`,
			border: `1px solid ${frena ? PELIGRO_BORDE : AVISO_BORDE}`,
			borderRadius: 6,
			background: frena ? PELIGRO_TINTE : AVISO_TINTE,
		}}
	>
		<div style={{ height: TARJETA.titulo, display: 'flex', alignItems: 'center', gap: 8, fontSize: LETRA + 1, fontWeight: 700, color: frena ? PELIGRO_LEGIBLE : AVISO_LEGIBLE }}>
			<Icono cual={frena ? 'alerta' : 'info'} tam={17} color={frena ? PELIGRO_LEGIBLE : AVISO_LEGIBLE} />
			{frena ? 'Esta persona ya está en el sistema' : 'Hay alguien parecido — míralo antes de crear'}
		</div>

		<div
			style={{
				marginTop: 11,
				height: TARJETA.ficha,
				boxSizing: 'border-box',
				display: 'flex',
				alignItems: 'center',
				gap: 13,
				padding: '0 12px',
				borderRadius: 6,
				background: SUPERFICIE,
				border: '1px solid #f0f0f0',
			}}
		>
			<div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flex: 'none' }}>
				<Avatar tipo={c.tipo} variante={c.variante} tam={44} />
			</div>
			<div style={{ flex: 1, minWidth: 0 }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, fontSize: LETRA }}>
					{c.nombre}
					<span style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.03em', padding: '1px 6px', borderRadius: 4, background: PELIGRO_TINTE, color: PELIGRO_LEGIBLE, border: `1px solid ${PELIGRO_BORDE}` }}>
						{c.marca}
					</span>
				</div>
				<div style={{ marginTop: 3, fontSize: LETRA - 1.8, color: 'rgba(0,0,0,0.6)' }}>{c.doc}</div>
				<div style={{ marginTop: 3, fontSize: LETRA - 1.8, color: 'rgba(0,0,0,0.6)' }}>{c.historia}</div>
			</div>
			<div style={{ display: 'flex', gap: 6, flex: 'none' }}>
				<Boton texto="Ver su ficha" pequeno ancho={BOTON_VER_FICHA} encima={encimaFicha === 0} />
				<Boton texto="Es éste" pequeno tipo="primary" ancho={BOTON_ES_ESTE} encima={encimaFicha === 1} />
			</div>
		</div>

		{frena && (
			<div style={{ marginTop: 11 }}>
				<Boton texto="No es ninguno de éstos, crear uno nuevo" pequeno peligro ancho={BOTON_ESCAPE} encima={encimaEscape} />
			</div>
		)}
	</div>
);

export { TEXTO_TENUE, PELIGRO, anchoDeBoton };
