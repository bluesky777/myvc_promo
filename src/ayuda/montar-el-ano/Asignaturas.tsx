import React from 'react';

import { ACENTO, BORDE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { MEDIDAS } from '../medidas';
import {
	AVISO_AMARILLO, Alerta, Boton, Cara, Etiqueta, Ficha, Icono, Interruptor, LETRA, Panel, Selector, Campo, PELIGRO,
} from './ant';
import {
	ANCHO_AJUSTE, ANCHO_COPIA_CAMPO, ANCHO_FILTRO, ALTO_FILA_PAPELERA, ALTO_LINEA_CUADRE, ANCHO_BOTON_PAPELERA, ANCHO_RESTAURAR,
	ANCHO_VER_SUS, BOTONES_FICHA, BOTON_COPIAR, BOTON_CREAR, BOTON_MOSTRAR_TODAS, BOTON_RECARGAR, CABECERA_PAGINA, CAMPOS_FICHA,
	COLUMNAS, CONTENIDO, MAIN, MODAL, MODAL_MEDIDAS, altoDelModal, disposicion, rectDelDesplegable,
	type Cuadre, type DetalleBorrado, type EstadoAsignaturas, type EstadoFicha, type FilaVista,
} from './planoAsignaturas';
import { Corte, Rejilla, type FilaDeRejilla } from './Rejilla';
import { DOCENTES, MATERIAS, etiquetaDeMateria, grupo as grupoPorNombre } from './reparto';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * REFERENCIAS ▸ ASIGNATURAS (`paginas/asignaturas/asignaturas.html`), para los cuatro vídeos que
 * pasan por ella.
 *
 * NO SABE DE TIEMPO. Recibe `EstadoAsignaturas` --qué alerta hay, qué filas, si la ficha está
 * abierta y qué lleva escrito-- y lo pinta en los sitios que dice `disposicion()`. El guion de cada
 * vídeo calcula el estado de cada fotograma, y con el mismo estado calcula a dónde va el puntero.
 *
 * LOS TEXTOS SON LOS DE LA APLICACIÓN, letra por letra: «Crear nueva», «Nueva asignatura»,
 * «Créditos» en la ficha y «IH» en la rejilla (la misma cosa con dos nombres, y el vídeo lo dice),
 * «Haz clic en una celda para editarla; se guarda al salir. Los días se conmutan pulsándolos.»,
 * «Copiar asignaturas de un grupo a otro», «Mostrar papelera (N)».
 */

export const PantallaAsignaturas: React.FC<{ estado: EstadoAsignaturas; opacidad?: number; bajada?: number }> = ({ estado: e, opacidad = 1, bajada = 0 }) => {
	const d = disposicion(e);
	const arriba = (MAIN.y - MEDIDAS.barra) - (e.desplazada ?? 0);
	const izquierda = MAIN.x - MEDIDAS.menu;
	/* Lo tecleado en el buscador del selector que está abierto, si no es de la ficha (esa lo lleva en su estado). */
	const buscando = (donde: string) => (e.desplegable?.donde === donde ? { busqueda: e.desplegable.busqueda ?? null, cursor: Boolean(e.desplegable.cursor) } : {});

	return (
		<div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#f5f7fa' }}>
			{/* El panel blanco de la cáscara, que baja con la página. */}
			<div
				style={{
					position: 'absolute',
					left: CONTENIDO.x - MEDIDAS.menu,
					top: CONTENIDO.y - MEDIDAS.barra - (e.desplazada ?? 0),
					width: CONTENIDO.ancho,
					height: d.fin + 60,
					background: '#fff',
					border: `1px solid ${BORDE}`,
					borderRadius: 10,
					boxSizing: 'border-box',
				}}
			/>

			<div style={{ position: 'absolute', left: izquierda, top: arriba + bajada, width: MAIN.ancho, opacity: opacidad }}>
				<Cabecera encima={e.encima === 'crearNueva'} />

				{e.cuadre && d.cuadre && (
					<div style={{ position: 'absolute', top: d.cuadre.y, left: 0, width: MAIN.ancho }}>
						<VistaDelCuadre cuadre={e.cuadre} alto={d.cuadre.alto} encimaVerSus={e.encima === 'verSus'} />
					</div>
				)}

				{e.ficha && d.ficha && (
					<div style={{ position: 'absolute', top: d.ficha.y, left: 0, opacity: e.ficha.aparece ?? 1, transform: `translateY(${(1 - (e.ficha.aparece ?? 1)) * -10}px)` }}>
						<VistaDeLaFicha ficha={e.ficha} />
					</div>
				)}

				<div style={{ position: 'absolute', top: d.filtros, left: 0, width: MAIN.ancho, display: 'flex', alignItems: 'center', gap: 12 }}>
					<Selector
						ancho={ANCHO_FILTRO}
						marcador="Todos los grupos"
						valor={e.filtroGrupo?.nombre ?? null}
						detras={e.filtroGrupo ? DOCENTES[e.filtroGrupo.titular].nombre : null}
						cara={e.filtroGrupo ? e.filtroGrupo.titular : null}
						abierto={e.desplegable?.donde === 'filtroGrupo'}
						{...buscando('filtroGrupo')}
					/>
					<Selector
						ancho={ANCHO_FILTRO}
						marcador="Todos los profesores"
						valor={e.filtroProfesor ? DOCENTES[e.filtroProfesor].nombre : null}
						cara={e.filtroProfesor}
						abierto={e.desplegable?.donde === 'filtroProfesor'}
						{...buscando('filtroProfesor')}
					/>
					<Boton texto="Mostrar todas" icono="reload" deshabilitado={!e.filtroGrupo && !e.filtroProfesor} ancho={BOTON_MOSTRAR_TODAS} />
					<div style={{ marginLeft: 'auto', width: ANCHO_AJUSTE, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, fontSize: LETRA - 1.5, color: TEXTO, whiteSpace: 'nowrap' }}>
						<Interruptor encendido={Boolean(e.mostrarTodas)} />
						<span>Mostrar todas las materias al docente, ignorando el horario</span>
					</div>
				</div>

				<div style={{ position: 'absolute', top: d.pista, left: 0, fontSize: LETRA - 1.5, color: 'rgba(0,0,0,0.45)', whiteSpace: 'nowrap' }}>
					Haz clic en una celda para editarla; se guarda al salir. Los días se conmutan pulsándolos.
					{e.viendo && <span> Viendo {e.filas.length} de {e.viendo.de}.</span>}
				</div>

				<div style={{ position: 'absolute', top: d.rejilla.y, left: 0 }}>
					<Rejilla columnas={COLUMNAS} filas={e.filas.map(filaDeRejilla)} ancho={MAIN.ancho} alto={d.rejilla.alto} desplazada={e.desplazadaRejilla ?? 0} />
				</div>

				<div style={{ position: 'absolute', top: d.copia, left: 0 }}>
					<Ficha titulo="Copiar asignaturas de un grupo a otro" ancho={MAIN.ancho}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
							<SelectorDeGrupo ancho={ANCHO_COPIA_CAMPO} marcador="Grupo de origen" nombre={e.copia?.origen ?? null} abierto={e.desplegable?.donde === 'origen'} {...buscando('origen')} />
							<SelectorDeGrupo ancho={ANCHO_COPIA_CAMPO} marcador="Grupo de destino" nombre={e.copia?.destino ?? null} abierto={e.desplegable?.donde === 'destino'} {...buscando('destino')} />
							<Boton texto="Copiar asignaturas" tipo="primary" ancho={BOTON_COPIAR} cargando={e.copia?.cargando} encima={e.copia?.encima} />
						</div>
					</Ficha>
				</div>

				<div style={{ position: 'absolute', top: d.papelera, left: 0, width: MAIN.ancho }}>
					<VistaDeLaPapelera papelera={e.papelera} />
				</div>
			</div>

			{e.desplegable && <ElDesplegable estado={e} />}
		</div>
	);
};

const Cabecera: React.FC<{ encima: boolean }> = ({ encima }) => (
	<div style={{ position: 'absolute', top: 0, left: 0, width: MAIN.ancho, height: CABECERA_PAGINA, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
		<div style={{ fontSize: 26, fontWeight: 600, color: TEXTO }}>Asignaturas</div>
		<div style={{ display: 'flex', gap: 8 }}>
			<Boton texto="Recargar" icono="reload" ancho={BOTON_RECARGAR} />
			<Boton texto="Crear nueva" icono="plus" tipo="primary" ancho={BOTON_CREAR} encima={encima} />
		</div>
	</div>
);

const VistaDelCuadre: React.FC<{ cuadre: Cuadre; alto: number; encimaVerSus: boolean }> = ({ cuadre, alto, encimaVerSus }) => {
	if (cuadre.forma === 'linea') {
		return <Alerta tipo={cuadre.tipo} mensaje={cuadre.mensaje} ancho={MAIN.ancho} alto={alto} />;
	}
	if (cuadre.forma === 'grupo') {
		return <Alerta tipo={cuadre.tipo} mensaje={cuadre.mensaje} descripcion={cuadre.detalle} ancho={MAIN.ancho} alto={alto} />;
	}
	/* La lista de los que no cuadran: primero la suma y después la conclusión, como en la aplicación. */
	return (
		<div
			style={{
				width: MAIN.ancho,
				height: alto,
				boxSizing: 'border-box',
				padding: '16px 22px 12px',
				background: AVISO_AMARILLO.fondo,
				border: `1px solid ${AVISO_AMARILLO.borde}`,
				borderRadius: 8,
				display: 'flex',
				gap: 14,
				color: TEXTO,
			}}
		>
			<Icono cual="alerta" tam={22} color={AVISO_AMARILLO.icono} />
			<div style={{ flex: 1 }}>
				<div style={{ fontSize: LETRA + 1, height: 22, lineHeight: '22px' }}>{cuadre.mensaje}</div>
				<div style={{ marginTop: 8 }}>
					{cuadre.filas.map((f, i) => (
						<div
							key={f.grupo}
							style={{
								height: ALTO_LINEA_CUADRE,
								display: 'flex',
								alignItems: 'center',
								gap: 12,
								fontSize: LETRA,
								borderBottom: i === cuadre.filas.length - 1 ? 'none' : '1px solid #f0e6c0',
							}}
						>
							<span style={{ flex: 1, fontWeight: 600 }}>{f.grupo}</span>
							<span style={{ width: 112, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{f.cifras}</span>
							<span style={{ width: 144, fontWeight: 600 }}>{f.diferencia}</span>
							<div style={{ width: ANCHO_VER_SUS, display: 'flex', justifyContent: 'flex-end' }}>
								<Boton texto="Ver sus asignaturas" tipo="link" pequeno encima={encimaVerSus} />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export const SelectorDeGrupo: React.FC<{ ancho: number | string; marcador: string; nombre: string | null; abierto?: boolean; busqueda?: string | null; cursor?: boolean }> = ({
	ancho, marcador, nombre, abierto = false, busqueda = null, cursor = false,
}) => {
	const g = nombre ? grupoPorNombre(nombre) : null;
	return (
		<Selector
			ancho={ancho}
			marcador={marcador}
			valor={g?.nombre ?? null}
			cara={g?.titular ?? null}
			detras={g ? DOCENTES[g.titular].nombre : null}
			abierto={abierto}
			busqueda={busqueda}
			cursor={cursor}
		/>
	);
};

const VistaDeLaFicha: React.FC<{ ficha: EstadoFicha }> = ({ ficha: f }) => {
	const materia = f.materia ? MATERIAS.find((m) => m.materia === f.materia) : null;
	const activo = (c: string) => f.activo === c;
	const buscando = (c: string) => (activo(c) && f.busqueda !== undefined ? f.busqueda : null);
	const nueva = f.modo === 'nueva';

	return (
		<Ficha titulo={nueva ? 'Nueva asignatura' : 'Editar asignatura'} edicion={!nueva} ancho={MAIN.ancho}>
			<div style={{ position: 'relative', height: 30 + 32 }}>
				<Lugar campo="materia">
					<Etiqueta texto="Materia" obligatorio />
					<Selector
						marcador={nueva ? 'Materia' : ''}
						valor={materia ? etiquetaDeMateria(materia) : null}
						abierto={activo('materia')}
						busqueda={buscando('materia')}
						cursor={activo('materia') && f.cursor}
					/>
				</Lugar>
				<Lugar campo="grupo">
					<Etiqueta texto="Grupo" obligatorio />
					<SelectorDeGrupo ancho="100%" marcador="Grupo" nombre={f.grupo} abierto={activo('grupo')} busqueda={buscando('grupo')} cursor={activo('grupo') && f.cursor} />
				</Lugar>
				<Lugar campo="profesor">
					<Etiqueta texto="Profesor" />
					<Selector
						marcador="Buscar un profesor…"
						valor={f.profesor ? DOCENTES[f.profesor].nombre : null}
						cara={f.profesor}
						abierto={activo('profesor')}
						busqueda={buscando('profesor')}
						cursor={activo('profesor') && f.cursor}
					/>
				</Lugar>
				<Lugar campo="creditos">
					<Etiqueta texto="Créditos" />
					<Campo valor={f.creditos} foco={activo('creditos')} cursor={activo('creditos') && f.cursor} />
				</Lugar>
				<Lugar campo="orden">
					<Etiqueta texto="Orden" />
					<Campo valor={f.orden} foco={activo('orden')} cursor={activo('orden') && f.cursor} />
				</Lugar>
			</div>
			<div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
				<Boton
					texto={nueva ? 'Crear' : 'Guardar cambios'}
					tipo="primary"
					ancho={nueva ? BOTONES_FICHA.crear : BOTONES_FICHA.guardar}
					encima={f.encima === 'crear' || f.encima === 'guardar'}
					cargando={f.cargando}
				/>
				<Boton texto="Ocultar" ancho={BOTONES_FICHA.ocultar} />
			</div>
		</Ficha>
	);
};

const Lugar: React.FC<{ campo: keyof typeof CAMPOS_FICHA; children: React.ReactNode }> = ({ campo, children }) => (
	<div style={{ position: 'absolute', left: CAMPOS_FICHA[campo].x, top: 0, width: CAMPOS_FICHA[campo].ancho }}>{children}</div>
);

/* ── La rejilla ─────────────────────────────────────────────────────────────────────────────── */

function filaDeRejilla(f: FilaVista): FilaDeRejilla {
	const area = f.area === 'solo' ? '100 %' : f.area === null ? '—' : `${f.area} %`;
	const celdas: Record<string, React.ReactNode> = {
		id: <span style={{ color: TEXTO, fontVariantNumeric: 'tabular-nums' }}>{f.id}</span>,
		editar: <BotonDeCelda icono="edit" encima={f.encima === 'editar'} />,
		borrar: <BotonDeCelda icono="delete" peligro encima={f.encima === 'borrar'} />,
		notas: <span>—</span>,
		materia: <Corte>{f.materia}</Corte>,
		grupo: <Corte>{f.grupo}</Corte>,
		profesor: (
			<div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
				<Cara docente={f.profesor} tam={24} />
				<Corte>{DOCENTES[f.profesor].nombre}</Corte>
			</div>
		),
		ih: <span style={{ fontVariantNumeric: 'tabular-nums' }}>{f.ih}</span>,
		area: <span style={{ fontVariantNumeric: 'tabular-nums', color: f.area === 'solo' ? 'rgba(0,0,0,0.45)' : TEXTO }}>{area}</span>,
		historial: <span style={{ color: ACENTO }}>sin fecha</span>,
	};
	f.dias.forEach((si, i) => {
		const clave = `d${i}`;
		celdas[clave] = (
			<Boton
				texto={si ? 'Sí' : 'No'}
				tipo={si ? 'primary' : 'default'}
				pequeno
				ancho={48}
				encima={f.encima === clave}
				cargando={f.volando === clave}
			/>
		);
	});
	return { clave: String(f.id), celdas, opacidad: f.opacidad, x: f.x, fondo: f.fondo, grises: f.area === 'solo' ? ['area'] : [] };
}

/** `BotonCelda`: el botón de icono de la rejilla, rojo el de eliminar. */
const BotonDeCelda: React.FC<{ icono: 'edit' | 'delete'; peligro?: boolean; encima?: boolean }> = ({ icono, peligro = false, encima = false }) => (
	<div
		style={{
			width: 30,
			height: 26,
			borderRadius: 4,
			border: `1px solid ${encima ? (peligro ? PELIGRO : ACENTO) : peligro ? '#ffccc7' : BORDE}`,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			color: peligro ? PELIGRO : encima ? ACENTO : TEXTO,
			background: '#fff',
		}}
	>
		<Icono cual={icono} tam={15} />
	</div>
);

/* ── La papelera ────────────────────────────────────────────────────────────────────────────── */

const VistaDeLaPapelera: React.FC<{ papelera: EstadoAsignaturas['papelera'] }> = ({ papelera }) => {
	const n = papelera?.filas.length ?? 0;
	const abierta = papelera?.abierta ?? false;
	return (
		<div>
			<div style={{ width: ANCHO_BOTON_PAPELERA }}>
				<Boton texto={`${abierta ? 'Ocultar papelera' : 'Mostrar papelera'} (${n})`} tipo="link" encima={papelera?.encima === 'boton'} />
			</div>
			{abierta && (
				<div style={{ marginTop: 8 }}>
					{n === 0 && <div style={{ fontSize: LETRA, color: 'rgba(0,0,0,0.45)' }}>No hay asignaturas en la papelera.</div>}
					{papelera!.filas.map((f) => (
						<div key={f.id} style={{ height: ALTO_FILA_PAPELERA, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f0f0f0', fontSize: LETRA, color: TEXTO }}>
							<div style={{ width: ANCHO_RESTAURAR, flex: 'none' }}>
								<Boton texto="Restaurar" icono="undo" pequeno ancho={ANCHO_RESTAURAR} cargando={papelera!.restaurando === f.id} encima={papelera!.encima === f.id} />
							</div>
							<span style={{ width: 64, color: 'rgba(0,0,0,0.45)', flex: 'none' }}>{f.id}</span>
							<span style={{ flex: 2, fontWeight: 500 }}>{f.materia}</span>
							<span style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 7 }}>
								<Cara docente={f.profesor} tam={22} />
								{DOCENTES[f.profesor].nombre}
							</span>
							<span style={{ flex: 1 }}>{f.grupo}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

/* ── El desplegable abierto ─────────────────────────────────────────────────────────────────── */

const ElDesplegable: React.FC<{ estado: EstadoAsignaturas }> = ({ estado }) => {
	const d = estado.desplegable!;
	const campo = rectDelDesplegable(estado, d.donde);
	return (
		<div style={{ position: 'absolute', left: campo.x - MEDIDAS.menu, top: campo.y + campo.alto + 4 - MEDIDAS.barra, zIndex: 5 }}>
			<Panel opciones={d.opciones} resaltada={d.resaltada} elegida={d.elegida} ancho={campo.ancho} aparece={d.aparece ?? 1} />
		</div>
	);
};

/* ── El modal de borrar ─────────────────────────────────────────────────────────────────────── */

/**
 * «¿Seguro que deseas eliminar?» (`borrar-asignatura.html`). Consulta el detalle al abrirse y enseña
 * lo que cuelga de la asignatura --cada periodo con lo suyo y cuántas notas-- antes de dejar pulsar.
 * Va en coordenadas de la cáscara entera: la máscara tapa también el menú.
 */
export const ModalBorrar: React.FC<{ detalle: DetalleBorrado; aparece: number; encima?: 'eliminar' | null; cargando?: boolean; cargandoDetalle?: boolean }> = ({
	detalle, aparece, encima = null, cargando = false, cargandoDetalle = false,
}) => {
	const m = MODAL_MEDIDAS;
	return (
		<div style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none' }}>
			<div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.45 * aparece})`, borderRadius: 12 }} />
			<div
				style={{
					position: 'absolute',
					left: MODAL.x,
					top: MODAL.y,
					width: MODAL.ancho,
					height: altoDelModal(detalle),
					boxSizing: 'border-box',
					padding: m.relleno,
					background: '#fff',
					borderRadius: 8,
					boxShadow: '0 6px 16px rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05)',
					opacity: aparece,
					transform: `scale(${0.92 + aparece * 0.08})`,
					color: TEXTO,
					fontSize: LETRA,
				}}
			>
				<div style={{ height: m.titulo, fontSize: 21, fontWeight: 600 }}>¿Seguro que deseas eliminar?</div>
				<div style={{ height: m.identidad, display: 'flex', alignItems: 'center', gap: 12 }}>
					<span style={{ color: 'rgba(0,0,0,0.45)' }}>Id: {detalle.id}</span>
					<strong>{detalle.materia}</strong>
				</div>
				{cargandoDetalle && (
					/* `nz-spin` con su texto, en el hueco que luego ocupa el detalle. */
					<div style={{ height: altoDelModal(detalle) - m.relleno * 2 - m.titulo - m.identidad - m.botones, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: ACENTO }}>
						<Icono cual="cargando" tam={26} />
						<span style={{ fontSize: LETRA - 1 }}>Cargando detalle de asignatura…</span>
					</div>
				)}
				{!cargandoDetalle && (
				<div style={{ height: m.notas, display: 'flex', alignItems: 'center', gap: 6 }}>
					Total de notas: <strong>{detalle.notas}</strong>
				</div>
				)}
				{!cargandoDetalle && detalle.unidades.map((u) => (
					<div key={u.definicion} style={{ marginBottom: m.hueco }}>
						<div style={{ height: m.tituloUnidad, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
							<span style={{ fontSize: LETRA - 2, fontWeight: 400, color: '#389e0d', background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4, padding: '1px 7px' }}>
								Per {u.periodo}
							</span>
							{u.definicion}
						</div>
						<div style={{ border: '1px solid #f0f0f0', borderRadius: 6, overflow: 'hidden' }}>
							<div style={{ display: 'flex', height: m.cabeceraTabla, alignItems: 'center', background: '#fafafa', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>
								<span style={{ width: 80, paddingLeft: 12 }}>Id</span>
								<span style={{ flex: 1 }}>Definición</span>
								<span style={{ width: 80, textAlign: 'right', paddingRight: 12 }}>Notas</span>
							</div>
							{u.subunidades.map((s, i) => (
								<div key={s.id} style={{ display: 'flex', height: m.filaTabla, alignItems: 'center', borderBottom: i === u.subunidades.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
									<span style={{ width: 80, paddingLeft: 12, color: TEXTO_TENUE }}>{s.id}</span>
									<span style={{ flex: 1 }}>{s.definicion}</span>
									<span style={{ width: 80, textAlign: 'right', paddingRight: 12, fontVariantNumeric: 'tabular-nums' }}>{s.notas}</span>
								</div>
							))}
						</div>
					</div>
				))}
				<div style={{ position: 'absolute', left: m.relleno, bottom: m.relleno, display: 'flex', gap: 8 }}>
					<Boton texto="Eliminar" tipo="primary" peligro ancho={98} encima={encima === 'eliminar'} cargando={cargando} />
					<Boton texto="Cancelar" ancho={100} />
				</div>
			</div>
		</div>
	);
};
