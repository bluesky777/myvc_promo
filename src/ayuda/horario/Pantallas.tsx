import React from 'react';

import { ACENTO, BORDE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { fichaFondo, fichaLetra, fichaLinea } from '../../horarios/tema';
import { En, Gris, H1, Pagina } from '../comun-directivo/Escenario';
import { MAIN } from '../comun-directivo/lugar';
import { Alerta, Boton, EXITO, Icono, LETRA, Selector } from '../montar-el-ano/ant';
import {
	ALTO_CONFIRMAR, CUADRAR_Y, DESCARGAS, DESPUES_Y, DOCENTES, ESTRECHA, FILA_INFORME, FILA_VERSION, GRUPOS, IMPRIMIR_Y, INFORMES, LA_NUEVA, LECCIONES, LISTA,
	LISTA_Y, PIE_IMPRIMIR, PROGRAMA_Y, VERSIONES, VERSION_DEL_PROGRAMA, VERSION_Y, docenteEn, rectAbrir, rectBotonDescarga, rectBotonImprimir, rectConfirmar,
	rectDescarga, rectInforme, rectPublicar, rectVer, rectVersion, rectVolver, type Version,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LAS PANTALLAS DE `paginas/horario`: la lista de versiones, una versión, el programa, cuadrar e
 * imprimir. Textos de sus plantillas; no saben de tiempo, reciben el estado.
 */

/* ── Iconos que no están en `ant.tsx` ─────────────────────────────────────────────────────── */

type Extra = 'descarga' | 'global' | 'impresora' | 'izquierda' | 'derecha' | 'check-circulo' | 'info-circulo';

export const Ico: React.FC<{ cual: Extra; tam?: number; color?: string }> = ({ cual, tam = 16, color = 'currentColor' }) => {
	const t = { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
	return (
		<svg width={tam} height={tam} viewBox="0 0 24 24" style={{ flex: 'none' }}>
			{cual === 'descarga' && <path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" {...t} />}
			{cual === 'global' && (<><circle cx="12" cy="12" r="8.5" {...t} /><path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.4 3.6 8.5s-1.1 5.9-3.6 8.5c-2.5-2.6-3.6-5.4-3.6-8.5S9.5 6.1 12 3.5z" {...t} /></>)}
			{cual === 'impresora' && (<><path d="M7 9V4h10v5" {...t} /><rect x="4" y="9" width="16" height="7" rx="1.5" {...t} /><path d="M7.5 14h9v6h-9z" {...t} /></>)}
			{cual === 'izquierda' && <path d="M19 12H5M11 6l-6 6 6 6" {...t} />}
			{cual === 'derecha' && <path d="M9 6l6 6-6 6" {...t} />}
			{cual === 'check-circulo' && (<><circle cx="12" cy="12" r="8.5" {...t} /><path d="M8 12.3l2.7 2.7L16.2 9.5" {...t} /></>)}
			{cual === 'info-circulo' && (<><circle cx="12" cy="12" r="8.5" {...t} /><path d="M12 11v5.5" {...t} /><circle cx="12" cy="7.8" r="0.6" {...t} /></>)}
		</svg>
	);
};

/** Un botón de Ant con un icono de los de aquí (el de `ant.tsx` sólo trae los suyos). */
export const BotonCon: React.FC<{ texto: string; icono: Extra; tipo?: 'primary' | 'default' | 'text'; ancho?: number; encima?: boolean; deshabilitado?: boolean; despues?: boolean; alto?: number }> = ({
	texto, icono, tipo = 'default', ancho, encima = false, deshabilitado = false, despues = false, alto = 32,
}) => {
	const lleno = tipo === 'primary';
	const fondo = deshabilitado ? 'rgba(0,0,0,0.04)' : lleno ? (encima ? '#4096ff' : ACENTO) : tipo === 'text' ? (encima ? 'rgba(0,0,0,0.06)' : 'transparent') : '#fff';
	const letra = deshabilitado ? 'rgba(0,0,0,0.25)' : lleno ? '#fff' : encima ? ACENTO : TEXTO;
	const borde = deshabilitado ? BORDE : tipo === 'text' ? 'transparent' : lleno ? fondo : encima ? ACENTO : BORDE;
	return (
		<div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: alto, width: ancho, padding: '0 15px', boxSizing: 'border-box', borderRadius: 6, border: `1px solid ${borde}`, background: fondo, color: letra, fontSize: LETRA, whiteSpace: 'nowrap' }}>
			{!despues && <Ico cual={icono} tam={15} />}
			{texto}
			{despues && <Ico cual={icono} tam={14} />}
		</div>
	);
};

const Etiqueta: React.FC<{ verde?: boolean; children: React.ReactNode }> = ({ verde = false, children }) => (
	<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, lineHeight: '20px', padding: '0 7px', borderRadius: 4, whiteSpace: 'nowrap', border: `1px solid ${verde ? EXITO.borde : BORDE}`, background: verde ? EXITO.fondo : '#fafafa', color: verde ? '#389e0d' : TEXTO }}>
		{children}
	</span>
);

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ fontSize: 20, fontWeight: 600, lineHeight: '32px' }}>{children}</div>;

/* ════════════════════════════ LA LISTA ════════════════════════════ */

export interface EstadoLista {
	encimaVer: number | null;
	encimaPublicar: boolean;
	/** La caja de «Publicar…» en la fila nueva: 0..1. */
	confirmando: number;
	encimaNoPublicar: boolean;
}

export const LISTA_QUIETA: EstadoLista = { encimaVer: null, encimaPublicar: false, confirmando: 0, encimaNoPublicar: false };

export const PantallaLista: React.FC<{ e: EstadoLista; opacidad?: number; puedePublicar?: boolean }> = ({ e, opacidad = 1, puedePublicar = true }) => (
	<Pagina opacidad={opacidad}>
		<En x={LISTA.x} y={LISTA_Y.cabecera} ancho={400}><H1>Horario</H1></En>
		<En x={LISTA.x + LISTA.ancho - 116 - 8 - 222} y={LISTA_Y.cabecera + 4}><BotonCon texto="Colores de los docentes" icono="derecha" despues ancho={222} /></En>
		<En x={LISTA.x + LISTA.ancho - 116} y={LISTA_Y.cabecera + 4}><Boton texto="Recargar" icono="reload" ancho={116} /></En>

		<En x={LISTA.x} y={LISTA_Y.rige} alto={24} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: LETRA }}>
			<Ico cual="check-circulo" tam={17} color="#52c41a" />Uno de estos horarios rige el colegio ahora mismo. Está marcado abajo.
		</En>

		{VERSIONES.map((v, i) => <FilaDeVersion key={v.id} v={v} i={i} e={e} puedePublicar={puedePublicar} />)}

		{(() => {
			const u = rectVersion(VERSIONES.length - 1, e.confirmando);
			return (
				<En x={LISTA.x} y={u.y + u.alto + 18} ancho={LISTA.ancho}>
					<Gris tam={13.5}>Los horarios se cuadran y se suben desde el programa de escritorio. Aquí se consultan y se elige cuál rige el colegio.</Gris>
				</En>
			);
		})()}
	</Pagina>
);

const FilaDeVersion: React.FC<{ v: Version; i: number; e: EstadoLista; puedePublicar: boolean }> = ({ v, i, e, puedePublicar }) => {
	const r = rectVersion(i, e.confirmando);
	const ver = rectVer(i, puedePublicar, e.confirmando);
	const pub = rectPublicar(i, e.confirmando);
	const F = FILA_VERSION;
	return (
		<>
			<En x={r.x} y={r.y} ancho={r.ancho} alto={r.alto} style={{ boxSizing: 'border-box', border: `1px solid #f0f0f0`, borderLeft: v.rige ? `3px solid ${ACENTO}` : '1px solid #f0f0f0', borderRadius: 8, padding: `${F.relleno}px 16px`, overflow: 'hidden' }}>
				<div style={{ height: F.cabeza, display: 'flex', alignItems: 'center', gap: 10 }}>
					<span style={{ fontSize: LETRA + 1, fontWeight: 700 }}>{v.nombre}</span>
					{v.rige && <Etiqueta verde><Ico cual="check-circulo" tam={13} />Rige el colegio</Etiqueta>}
					{!v.rige && v.masReciente && <Etiqueta>La más reciente</Etiqueta>}
				</div>
				<div style={{ marginTop: 6, fontSize: 13.5, lineHeight: `${F.veredicto}px`, color: 'rgba(0,0,0,0.7)', display: 'flex', gap: 6, width: 860 }}>
					<span style={{ marginTop: 3 }}>{v.reparos ? <Icono cual="alerta" tam={15} color="#faad14" /> : <Ico cual="check-circulo" tam={15} color="rgba(0,0,0,0.45)" />}</span>
					<span>{v.veredicto}</span>
				</div>
				<div style={{ marginTop: 4, fontSize: 13.5, lineHeight: `${F.pie}px`, color: TEXTO_TENUE }}>Subido por {v.quien} · {v.cuando}</div>
			</En>
			<En x={ver.x} y={ver.y}><BotonCon texto="Ver el horario" icono="derecha" despues ancho={ver.ancho} encima={e.encimaVer === i} /></En>
			{puedePublicar && !v.rige && <En x={pub.x} y={pub.y}><Boton texto="Publicar" ancho={pub.ancho} encima={i === LA_NUEVA && e.encimaPublicar} /></En>}
			{i === LA_NUEVA && e.confirmando > 0.01 && <Confirmar v={v} t={e.confirmando} encimaNo={e.encimaNoPublicar} />}
		</>
	);
};

const Confirmar: React.FC<{ v: Version; t: number; encimaNo: boolean }> = ({ v, t, encimaNo }) => {
	const c = rectConfirmar(t);
	return (
		<En x={c.x} y={c.y} ancho={c.ancho} alto={ALTO_CONFIRMAR - 8} style={{ opacity: Math.min(1, t * 1.6), boxSizing: 'border-box', border: `1px solid ${ACENTO}`, borderRadius: 8, padding: 14, background: '#fff', overflow: 'hidden' }}>
			<div style={{ display: 'flex', gap: 10, fontSize: 14.5, lineHeight: '21px' }}>
				<span style={{ marginTop: 2 }}><Icono cual="alerta" tam={17} color="#faad14" /></span>
				<span>Publicar «{v.nombre}» hace que <b>el colegio pase a regir por este horario</b>, y reescribe los días de clase de todas las asignaturas del año a partir de él. Lo que este horario no traiga, se queda sin día.</span>
			</div>
			<div style={{ position: 'absolute', left: 16, bottom: 14, display: 'flex', gap: 8 }}>
				<Boton texto={`Publicar «${v.nombre}»`} tipo="primary" ancho={384} />
				<Boton texto="No publicar" tipo="text" ancho={110} encima={encimaNo} />
			</div>
		</En>
	);
};

/* ════════════════════════════ UNA VERSIÓN ════════════════════════════ */

export const PantallaVersion: React.FC<{ v: Version; opacidad?: number; encimaVolver?: boolean }> = ({ v, opacidad = 1, encimaVolver = false }) => {
	const ancho = (MAIN.ancho - 60) / GRUPOS.length;
	return (
		<Pagina opacidad={opacidad}>
			<En x={rectVolver().x} y={rectVolver().y}><BotonCon texto="Todos los horarios" icono="izquierda" ancho={rectVolver().ancho} encima={encimaVolver} /></En>
			<En x={LISTA.x} y={VERSION_Y.titulo} ancho={800}><H1>{v.nombre}</H1></En>
			<En x={LISTA.x + LISTA.ancho - 116} y={VERSION_Y.titulo + 4}><Boton texto="Recargar" icono="reload" ancho={116} /></En>

			<En x={LISTA.x} y={VERSION_Y.aviso} ancho={LISTA.ancho}>
				{v.rige ? (
					<div style={{ height: 52, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', border: '1px solid #f0f0f0', borderLeft: `3px solid ${ACENTO}`, borderRadius: 8, fontSize: 17 }}>
						<Ico cual="check-circulo" tam={20} color="#52c41a" /><span><b>Este horario rige el colegio.</b> Es la versión oficial del año.</span>
					</div>
				) : (
					<Alerta tipo="warning" ancho={LISTA.ancho} alto={90} mensaje="Esto es un borrador: no rige el colegio"
						descripcion="Subir no es publicar. Este horario está subido, pero el colegio no rige por él. En la lista se ve cuál rige; publicar se hace desde el programa de escritorio." />
				)}
			</En>

			<En x={LISTA.x} y={VERSION_Y.resumen} style={{ display: 'flex', gap: 34 }}>
				{[['Subido', v.cuando], ['Lecciones', '412'], ['Días', '5'], ['Franjas', '7'], ['Cada lección', '55 min'], ['Grupos', '13']].map(([k, val]) => (
					<div key={k}><div style={{ fontSize: 12.5, color: TEXTO_TENUE }}>{k}</div><div style={{ fontSize: 16, fontWeight: 700 }}>{val}</div></div>
				))}
			</En>

			<En x={LISTA.x} y={VERSION_Y.filtro} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: LETRA }}>
				Ver un grupo <Selector marcador="Todos los grupos" ancho={220} />
			</En>

			<En x={MAIN.x} y={VERSION_Y.parrilla} ancho={MAIN.ancho}>
				<div style={{ fontSize: 14.5 }}><b>38</b> clases distintas, en <b>412</b> casillas de la parrilla.</div>
				<Gris tam={13} style={{ marginTop: 2 }}>Las lecciones van numeradas, no en horas de reloj: los timbres se cuadran en el programa de escritorio y no viajan con el horario. Cada lección dura 55 minutos.</Gris>
				{['Lunes', 'Martes'].map((dia, d) => (
					<div key={dia} style={{ marginTop: 12 }}>
						<div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{dia}</div>
						<div style={{ display: 'flex', fontSize: 12.5, fontWeight: 600, color: TEXTO_TENUE }}>
							<div style={{ width: 60 }}>Lección</div>
							{GRUPOS.map((g) => <div key={g} style={{ width: ancho, textAlign: 'center' }}>{g}</div>)}
						</div>
						{Array.from({ length: LECCIONES }, (_, l) => (
							<div key={l} style={{ display: 'flex', height: 30, alignItems: 'center' }}>
								<div style={{ width: 60, fontSize: 13, color: TEXTO_TENUE }}>{l + 1}ª</div>
								{GRUPOS.map((g, gi) => {
									const doc = DOCENTES[docenteEn(d, l, gi)];
									return (
										<div key={g} style={{ width: ancho, height: 28, padding: 1, boxSizing: 'border-box' }}>
											<div style={{ height: '100%', borderRadius: 4, background: fichaFondo(doc.tono), border: `1px solid ${fichaLinea(doc.tono)}`, color: fichaLetra(doc.tono), fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>{doc.abrev}</div>
										</div>
									);
								})}
							</div>
						))}
					</div>
				))}
			</En>
		</Pagina>
	);
};

/* ════════════════════════════ EL PROGRAMA ════════════════════════════ */

export const PantallaPrograma: React.FC<{ sinCarpeta?: boolean; opacidad?: number; encimaDescarga?: boolean }> = ({ sinCarpeta = false, opacidad = 1, encimaDescarga = false }) => (
	<Pagina opacidad={opacidad}>
		<En x={ESTRECHA.x} y={ESTRECHA.y} ancho={500}><H1>Programa de horarios</H1></En>
		{!sinCarpeta && <En x={ESTRECHA.x + ESTRECHA.ancho - 116} y={ESTRECHA.y + 4}><Boton texto="Recargar" icono="reload" ancho={116} /></En>}
		<En x={ESTRECHA.x} y={PROGRAMA_Y.intro} ancho={ESTRECHA.ancho} style={{ fontSize: LETRA + 0.5, lineHeight: '24px' }}>
			El horario del colegio <b>se cuadra en un programa que se instala en el computador</b>, no en esta página. Aquí se descarga. Crear el horario es opcional: lo académico funciona sin él.
		</En>

		{sinCarpeta ? (
			<En x={ESTRECHA.x} y={PROGRAMA_Y.version}>
				<Alerta tipo="info" ancho={ESTRECHA.ancho} alto={100} mensaje="Todavía no hay ninguna versión publicada en este colegio"
					descripcion="El programa existe, pero a este colegio aún no le han subido la carpeta de descargas. No hay nada que hacer aquí mientras tanto; llegará con una de las próximas actualizaciones." />
			</En>
		) : (
			<>
				<En x={ESTRECHA.x} y={PROGRAMA_Y.version} style={{ fontSize: LETRA }}>Versión <b>{VERSION_DEL_PROGRAMA.numero}</b> · publicada el {VERSION_DEL_PROGRAMA.fecha}</En>
				{DESCARGAS.map((d, i) => {
					const r = rectDescarga(i);
					const b = rectBotonDescarga(i);
					return (
						<React.Fragment key={d.sistema}>
							<En x={r.x} y={r.y} ancho={r.ancho} alto={r.alto} style={{ boxSizing: 'border-box', border: '1px solid #f0f0f0', borderLeft: d.este ? `3px solid ${ACENTO}` : '1px solid #f0f0f0', borderRadius: 8 }} />
							<En x={b.x} y={b.y}><BotonCon texto={`Descargar para ${d.sistema}`} icono="descarga" tipo="primary" ancho={b.ancho} encima={d.este && encimaDescarga} /></En>
							<En x={b.x + b.ancho + 14} y={b.y} alto={32} style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: TEXTO_TENUE }}>{d.tam}{d.este ? ' · es el de este computador' : ''}</En>
						</React.Fragment>
					);
				})}
				<En x={ESTRECHA.x} y={DESPUES_Y} ancho={ESTRECHA.ancho}>
					<H2>Después de descargarlo</H2>
					<ul style={{ margin: '8px 0 0', paddingLeft: 22, fontSize: LETRA, lineHeight: '24px' }}>
						<li style={{ marginBottom: 6 }}>Es un programa para el computador: primero se descarga y luego se instala.</li>
						<li style={{ marginBottom: 6 }}>La primera vez, el sistema puede avisar de que el programa no viene de su tienda. Hay que aceptar para continuar.</li>
						<li><b>Cuadrar el horario e imprimirlo funciona sin nada más.</b> Subirlo a MyVC necesita además la licencia del colegio.</li>
					</ul>
				</En>
			</>
		)}
	</Pagina>
);

/* ════════════════════════════ CUADRAR ════════════════════════════ */

export type EstadoCuadrar = 'nada' | 'esperando' | 'listo' | 'bloqueado';

export const PantallaCuadrar: React.FC<{ estado: EstadoCuadrar; opacidad?: number; encimaAbrir?: boolean; aparece?: number }> = ({ estado, opacidad = 1, encimaAbrir = false, aparece = 1 }) => (
	<Pagina opacidad={opacidad}>
		<En x={ESTRECHA.x} y={ESTRECHA.y} ancho={500}><H1>Cuadrar el horario</H1></En>
		<En x={ESTRECHA.x} y={CUADRAR_Y.parrafo} ancho={ESTRECHA.ancho} style={{ fontSize: LETRA + 0.5, lineHeight: '24px' }}>
			El horario se cuadra en un programa aparte, y <b>se puede usar desde el navegador</b>, sin instalar nada. Al pulsar el botón <b>se abre en otra pestaña</b> y <b>se entra con esta misma cuenta</b>: no hay que volver a escribir la clave.
		</En>
		<En x={ESTRECHA.x} y={CUADRAR_Y.gris} ancho={ESTRECHA.ancho}><Gris tam={13.5}>Se abre en <b>https://horarios.micolevirtual.com</b>. Esta pestaña se queda como está.</Gris></En>
		<En x={ESTRECHA.x} y={CUADRAR_Y.boton}>
			<BotonCon texto={estado === 'nada' ? 'Abrir el programa de horarios' : 'Volver a abrirlo'} icono="global" tipo="primary" ancho={rectAbrir(estado !== 'nada').ancho} encima={encimaAbrir} />
		</En>
		<En x={ESTRECHA.x} y={CUADRAR_Y.estado} ancho={ESTRECHA.ancho} style={{ opacity: aparece }}>
			{estado === 'esperando' && <Gris tam={14.5}>Se abrió la otra pestaña y se le está pasando la sesión. Si no la ves, búscala arriba, al lado de ésta.</Gris>}
			{estado === 'listo' && (
				<Alerta tipo="success" ancho={ESTRECHA.ancho} alto={88} mensaje="Listo: ya puedes cambiar a la otra pestaña"
					descripcion="El programa de horarios entró con esta misma cuenta. Esta pestaña puede quedarse abierta o cerrarse; da igual." />
			)}
			{estado === 'bloqueado' && (
				<Alerta tipo="warning" ancho={ESTRECHA.ancho} alto={100} mensaje="El navegador bloqueó la pestaña nueva"
					descripcion="No es un fallo del colegio ni de la clave: es el bloqueador de ventanas emergentes. Suele salir un aviso en la barra de direcciones, arriba a la derecha — hay que abrirlo y permitir las ventanas de esta página. Después, pulsa el botón otra vez." />
			)}
		</En>
		<En x={ESTRECHA.x} y={CUADRAR_Y.saber} ancho={ESTRECHA.ancho}>
			<H2>Cosas que conviene saber</H2>
			<ul style={{ margin: '8px 0 0', paddingLeft: 22, fontSize: LETRA, lineHeight: '23px' }}>
				<li style={{ marginBottom: 5 }}>Se abre en <b>otra pestaña</b>: ésta no se pierde y se puede volver cuando se quiera.</li>
				<li style={{ marginBottom: 5 }}>Entra con <b>la misma cuenta</b> con la que estás aquí. No hay una clave aparte.</li>
				<li style={{ marginBottom: 5 }}>Si no se abre nada, casi siempre es el <b>bloqueador de ventanas emergentes</b> del navegador. Hay que permitírselo a esta página y pulsar otra vez.</li>
				<li><b>Cuadrar el horario también funciona con el programa instalado</b>, sin navegador: se descarga en «Descargar el programa».</li>
			</ul>
		</En>
	</Pagina>
);

/* ════════════════════════════ IMPRIMIR ════════════════════════════ */

export interface EstadoImprimir {
	marcados: Record<string, boolean>;
	abiertos: Record<string, number>;
	encimaImprimir: boolean;
}

export const hojasDe = (m: Record<string, boolean>) =>
	INFORMES.reduce((n, i) => n + (m[i.clave] ? (i.eje ? i.eje.length : i.clave === 'colegio' ? 5 : 1) : 0), 0);

const Marca: React.FC<{ marcada: boolean; tam?: number }> = ({ marcada, tam = 16 }) => (
	<div style={{ width: tam, height: tam, borderRadius: 4, boxSizing: 'border-box', border: `1px solid ${marcada ? ACENTO : BORDE}`, background: marcada ? ACENTO : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
		{marcada && <Icono cual="check" tam={tam - 4} color="#fff" />}
	</div>
);

export const PantallaImprimir: React.FC<{ e: EstadoImprimir; v: Version; opacidad?: number }> = ({ e, v, opacidad = 1 }) => {
	const hojas = hojasDe(e.marcados);
	const algo = hojas > 0;
	return (
		<Pagina opacidad={opacidad}>
			<En x={LISTA.x} y={LISTA.y} ancho={600}><H1>Imprimir el horario</H1></En>
			<En x={LISTA.x} y={IMPRIMIR_Y.subtitulo}><Gris tam={13.6}>De «{v.nombre}», que {v.rige ? 'es' : 'NO es'} la que rige el colegio.</Gris></En>
			<En x={LISTA.x + LISTA.ancho - 190} y={LISTA.y + 4}><BotonCon texto="Volver a la versión" icono="izquierda" ancho={190} /></En>

			{INFORMES.map((inf, i) => {
				const r = rectInforme(i, e.abiertos);
				const marcado = Boolean(e.marcados[inf.clave]);
				const abierto = e.abiertos[inf.clave] ?? 0;
				const n = inf.eje?.length ?? 0;
				return (
					<En key={inf.clave} x={r.x} y={r.y} ancho={r.ancho} alto={r.alto} style={{ boxSizing: 'border-box', border: `1px solid ${marcado ? `${ACENTO}66` : '#f0f0f0'}`, borderRadius: 8, padding: '12px 14px', overflow: 'hidden' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 24 }}>
							<Marca marcada={marcado} />
							<span style={{ fontSize: LETRA + 0.5, fontWeight: 600 }}>{inf.titulo}</span>
							{marcado && <span style={{ fontSize: 13, padding: '0 8px', lineHeight: '20px', borderRadius: 10, border: `1px solid ${ACENTO}`, color: ACENTO }}>{inf.eje ? n : inf.clave === 'colegio' ? 5 : 1} hojas</span>}
							<span style={{ flex: 1 }} />
							{inf.eje && <span style={{ fontSize: 14, color: ACENTO, display: 'flex', alignItems: 'center', gap: 4 }}>{abierto > 0.5 ? 'Ocultar' : 'Elegir'} {n} <Icono cual="flecha" tam={12} giro={abierto > 0.5 ? 180 : 0} /></span>}
						</div>
						<div style={{ fontSize: 13.5, color: TEXTO_TENUE, marginTop: 4, paddingLeft: 26 }}>{inf.pregunta}</div>
						{inf.nota && <div style={{ fontSize: 13, color: TEXTO_TENUE, marginTop: 2, paddingLeft: 26, display: 'flex', gap: 5 }}><Ico cual="info-circulo" tam={14} />{inf.nota}</div>}
						{inf.eje && abierto > 0.01 && (
							<div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 10 * abierto, paddingLeft: 26, opacity: abierto }}>
								{inf.eje.map((x) => (
									<div key={x} style={{ width: (r.ancho - 60) / FILA_INFORME.ejeColumnas, height: FILA_INFORME.ejeFila, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
										<Marca marcada={marcado} tam={14} />
										<span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x}</span>
										{inf.clave === 'grupo' && <span style={{ color: TEXTO_TENUE }}>32</span>}
									</div>
								))}
							</div>
						)}
					</En>
				);
			})}

			{/* La barra pegada abajo (`position: sticky; bottom: 0`), con su raya de arriba. */}
			<En x={PIE_IMPRIMIR.x - 16} y={PIE_IMPRIMIR.y} ancho={PIE_IMPRIMIR.ancho + 32} alto={PIE_IMPRIMIR.alto + 40} style={{ background: '#fff', borderTop: `1px solid ${BORDE}` }} />
			<En x={PIE_IMPRIMIR.x} y={PIE_IMPRIMIR.y} alto={PIE_IMPRIMIR.alto} style={{ display: 'flex', alignItems: 'center', fontSize: 16 }}>
				{algo ? <span><b style={{ fontSize: 20 }}>{hojas}</b> hojas de papel</span> : <span style={{ color: TEXTO_TENUE }}>Nada marcado todavía</span>}
			</En>
			{algo && <En x={rectBotonImprimir().x - 146} y={rectBotonImprimir().y}><Boton texto="Desmarcar todo" tipo="text" ancho={138} /></En>}
			<En x={rectBotonImprimir().x} y={rectBotonImprimir().y}><BotonCon texto="Imprimir" icono="impresora" tipo="primary" ancho={rectBotonImprimir().ancho} deshabilitado={!algo} encima={e.encimaImprimir} /></En>
		</Pagina>
	);
};

export { rectInforme };
