import React from 'react';
import { Composition } from 'remotion';

import { Escena } from './notas/Escena';
import { DURACION, FPS } from './notas/guion';
import { DURACION_COMBINADO, EscenaCombinada } from './combinado/Escena';
import { EscenaDisciplina } from './disciplina/Escena';
import { DURACION as DURACION_DISCIPLINA } from './disciplina/guion';
import { EscenaHorarios } from './horarios/Escena';
import { DURACION as DURACION_HORARIOS } from './horarios/guion';
import { EscenaMovil } from './movil/Escena';
import { DURACION as DURACION_MOVIL } from './movil/guion';
import { EscenaRubricas } from './rubricas/Escena';
import { DURACION as DURACION_RUBRICAS } from './rubricas/guion';

/* ── Las piezas de pegamento del vídeo grande: portada, tarjeta y cierre. `src/piezas/`. ───── */
import { Cierre } from './piezas/Cierre';
import { Portada } from './piezas/Portada';
import { Tarjeta } from './piezas/Tarjeta';
import { Trato } from './piezas/Trato';
import { DURACION_CIERRE, DURACION_PORTADA, DURACION_TARJETA, DURACION_TRATO } from './piezas/guion';

/* ── Los vídeos de AYUDA, los que se embeben en la aplicación: `src/ayuda/`. ───────────────── */
import { EscenaAyudaPlanilla } from './ayuda/planilla/Escena';
import { DURACION as DURACION_AYUDA_PLANILLA } from './ayuda/planilla/guion';
import { EscenaCompetencias } from './ayuda/competencias/Escena';
import { DURACION as DURACION_AYUDA_COMPETENCIAS } from './ayuda/competencias/guion';

/* ── El portal de la Unión Colombiana del Norte. Otro producto, otro vídeo: `src/ucn/`. ────── */
import { EscenaComunicados } from './ucn/comunicados/Escena';
import { DURACION as DURACION_COMUNICADOS } from './ucn/comunicados/guion';
import { EscenaEncuestas } from './ucn/encuestas/Escena';
import { DURACION as DURACION_ENCUESTAS } from './ucn/encuestas/guion';
import { EscenaComparador } from './ucn/comparador/Escena';
import { DURACION as DURACION_COMPARADOR } from './ucn/comparador/guion';
import { EscenaMetas } from './ucn/metas/Escena';
import { DURACION as DURACION_METAS } from './ucn/metas/guion';
import { EscenaMisional } from './ucn/misional/Escena';
import { DURACION as DURACION_MISIONAL } from './ucn/misional/guion';
import { EscenaRed } from './ucn/red/Escena';
import { DURACION as DURACION_RED } from './ucn/red/guion';
import { EscenaSalud } from './ucn/salud/Escena';
import { DURACION as DURACION_SALUD } from './ucn/salud/guion';

/*
 * LOS CLIPS QUE SE PUEDEN RENDERIZAR. Cada uno sale como un fichero suelto para que quien monta el
 * vídeo los una: son piezas, no un vídeo terminado.
 *
 * 1920×1080 a 30 fps, que es lo que cualquier montador espera sin tener que convertir nada.
 */
export const Root: React.FC = () => (
	<>
		<Composition
			id="Notas-Aro"
			component={Escena}
			durationInFrames={DURACION}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="Notas-Aro-Rotulo"
			component={Escena}
			durationInFrames={DURACION}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		<Composition
			id="Notas-Y-Rubricas"
			component={EscenaCombinada}
			durationInFrames={DURACION_COMBINADO}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="Notas-Y-Rubricas-Rotulo"
			component={EscenaCombinada}
			durationInFrames={DURACION_COMBINADO}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		<Composition
			id="Rubricas"
			component={EscenaRubricas}
			durationInFrames={DURACION_RUBRICAS}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="Rubricas-Rotulo"
			component={EscenaRubricas}
			durationInFrames={DURACION_RUBRICAS}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		<Composition
			id="Disciplina"
			component={EscenaDisciplina}
			durationInFrames={DURACION_DISCIPLINA}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="Disciplina-Rotulo"
			component={EscenaDisciplina}
			durationInFrames={DURACION_DISCIPLINA}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		<Composition
			id="Horarios"
			component={EscenaHorarios}
			durationInFrames={DURACION_HORARIOS}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="Horarios-Rotulo"
			component={EscenaHorarios}
			durationInFrames={DURACION_HORARIOS}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		<Composition
			id="Movil"
			component={EscenaMovil}
			durationInFrames={DURACION_MOVIL}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="Movil-Rotulo"
			component={EscenaMovil}
			durationInFrames={DURACION_MOVIL}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		{/* ═══ El portal de la UCN ═══════════════════════════════════════════════════════ */}
		<Composition
			id="UCN-Comunicados"
			component={EscenaComunicados}
			durationInFrames={DURACION_COMUNICADOS}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="UCN-Comunicados-Rotulo"
			component={EscenaComunicados}
			durationInFrames={DURACION_COMUNICADOS}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		<Composition
			id="UCN-Encuestas"
			component={EscenaEncuestas}
			durationInFrames={DURACION_ENCUESTAS}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="UCN-Encuestas-Rotulo"
			component={EscenaEncuestas}
			durationInFrames={DURACION_ENCUESTAS}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		<Composition
			id="UCN-Salud-Escolar"
			component={EscenaSalud}
			durationInFrames={DURACION_SALUD}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="UCN-Salud-Escolar-Rotulo"
			component={EscenaSalud}
			durationInFrames={DURACION_SALUD}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		<Composition
			id="UCN-Comparador"
			component={EscenaComparador}
			durationInFrames={DURACION_COMPARADOR}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="UCN-Comparador-Rotulo"
			component={EscenaComparador}
			durationInFrames={DURACION_COMPARADOR}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		<Composition
			id="UCN-Metas"
			component={EscenaMetas}
			durationInFrames={DURACION_METAS}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="UCN-Metas-Rotulo"
			component={EscenaMetas}
			durationInFrames={DURACION_METAS}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		<Composition
			id="UCN-Misional"
			component={EscenaMisional}
			durationInFrames={DURACION_MISIONAL}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="UCN-Misional-Rotulo"
			component={EscenaMisional}
			durationInFrames={DURACION_MISIONAL}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		{/*
		  * EL SÉPTIMO DEL PORTAL, Y EL ÚNICO QUE NO ES UNA PANTALLA: un diagrama. Lo que cuenta
		  * --un traslado, un certificado que alguien comprueba, dos programas que se hablan-- pasa
		  * ENTRE dos sitios, y una captura de cualquiera de los dos no enseña lo de en medio.
		  */}
		<Composition
			id="UCN-Red-Conectada"
			component={EscenaRed}
			durationInFrames={DURACION_RED}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: false }}
		/>
		<Composition
			id="UCN-Red-Conectada-Rotulo"
			component={EscenaRed}
			durationInFrames={DURACION_RED}
			fps={FPS}
			width={1920}
			height={1080}
			defaultProps={{ conRotulo: true }}
		/>
		{/*
		  * LAS PIEZAS DE PEGAMENTO. No llevan variante con rótulo: **son texto**, así que el rótulo
		  * de abajo no tendría nada que explicar. Salen a `out/piezas/`.
		  */}
		<Composition id="Portada" component={Portada} durationInFrames={DURACION_PORTADA} fps={FPS} width={1920} height={1080} />
		<Composition id="Tarjeta" component={Tarjeta} durationInFrames={DURACION_TARJETA} fps={FPS} width={1920} height={1080} />
		<Composition id="Trato" component={Trato} durationInFrames={DURACION_TRATO} fps={FPS} width={1920} height={1080} />
		<Composition id="Cierre" component={Cierre} durationInFrames={DURACION_CIERRE} fps={FPS} width={1920} height={1080} />
		{/*
		  * ── LOS VÍDEOS DE AYUDA ───────────────────────────────────────────────────────────────
		  *
		  * NO LLEVAN VARIANTE «-Rotulo», y es la diferencia de fondo con todo lo de arriba. En un
		  * clip promocional el rótulo es opcional porque quien monta el vídeo pone los suyos; aquí
		  * **el texto es la voz**: sin él no hay vídeo, porque no hay audio que lo sustituya.
		  *
		  * Van a `out/ayuda/`, con el nombre de la clave que la aplicación usará para pedirlos
		  * (`data: { ayuda: 'planilla-teclear' }` en `app.routes.ts`). Ver PLAN-VIDEOS-AYUDA.md.
		  */}
		<Composition
			id="Ayuda-Planilla-Teclear"
			component={EscenaAyudaPlanilla}
			durationInFrames={DURACION_AYUDA_PLANILLA}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		{/*
		  * EL SEGUNDO, Y EL PRIMERO QUE SE SALTA EL TOPE DE 90 s: 103. Es a propósito y está escrito
		  * en la cabecera de su guion -- la pregunta del docente no es «cómo escribo un desempeño»,
		  * es «y esto para qué», y la respuesta es el boletín. Cortar antes deja la pregunta abierta.
		  */}
		<Composition
			id="Ayuda-Competencias"
			component={EscenaCompetencias}
			durationInFrames={DURACION_AYUDA_COMPETENCIAS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
	</>
);
