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
import { EscenaCierre1 } from './ayuda/cierre-1/Escena';
import { DURACION as DURACION_AYUDA_CIERRE_1 } from './ayuda/cierre-1/guion';
import { EscenaHorarioImprimir } from './ayuda/horario-imprimir/Escena';
import { DURACION as DURACION_AYUDA_HORARIO_IMPRIMIR } from './ayuda/horario-imprimir/guion';
import { EscenaHorarioCualRige } from './ayuda/horario-cual-rige/Escena';
import { DURACION as DURACION_AYUDA_HORARIO_CUAL_RIGE } from './ayuda/horario-cual-rige/guion';
import { EscenaHorarioCuadrar } from './ayuda/horario-cuadrar/Escena';
import { DURACION as DURACION_AYUDA_HORARIO_CUADRAR } from './ayuda/horario-cuadrar/guion';
import { EscenaHorarioPrograma } from './ayuda/horario-programa/Escena';
import { DURACION as DURACION_AYUDA_HORARIO_PROGRAMA } from './ayuda/horario-programa/guion';
import { EscenaPromocionar } from './ayuda/promocionar-notas/Escena';
import { DURACION as DURACION_AYUDA_PROMOCIONAR_NOTAS } from './ayuda/promocionar-notas/guion';
import { EscenaVotaciones } from './ayuda/votaciones/Escena';
import { DURACION as DURACION_AYUDA_VOTACIONES } from './ayuda/votaciones/guion';
import { EscenaFrasesCiudades } from './ayuda/frases-ciudades-calendario-muro/Escena';
import { DURACION as DURACION_AYUDA_FRASES_CIUDADES_CALENDARIO_MURO } from './ayuda/frases-ciudades-calendario-muro/guion';
import { EscenaCompromisoAcademico } from './ayuda/compromiso-academico/Escena';
import { DURACION as DURACION_AYUDA_COMPROMISO_ACADEMICO } from './ayuda/compromiso-academico/guion';
import { EscenaImagenes } from './ayuda/imagenes/Escena';
import { DURACION as DURACION_AYUDA_IMAGENES } from './ayuda/imagenes/guion';
import { EscenaColegioFicha } from './ayuda/colegio-ficha/Escena';
import { DURACION as DURACION_AYUDA_COLEGIO_FICHA } from './ayuda/colegio-ficha/guion';
import { EscenaAreasMaterias } from './ayuda/areas-materias/Escena';
import { DURACION as DURACION_AYUDA_AREAS_MATERIAS } from './ayuda/areas-materias/guion';
import { EscenaNivelesGrados } from './ayuda/niveles-grados/Escena';
import { DURACION as DURACION_AYUDA_NIVELES_GRADOS } from './ayuda/niveles-grados/guion';
import { EscenaPlanPlantilla } from './ayuda/plan-evaluacion-plantilla/Escena';
import { DURACION as DURACION_AYUDA_PLAN_EVALUACION_PLANTILLA } from './ayuda/plan-evaluacion-plantilla/guion';
import { EscenaPlanModelo } from './ayuda/plan-evaluacion-modelo/Escena';
import { DURACION as DURACION_AYUDA_PLAN_EVALUACION_MODELO } from './ayuda/plan-evaluacion-modelo/guion';
import { EscenaAjustesDelAno } from './ayuda/ajustes-del-ano/Escena';
import { DURACION as DURACION_AYUDA_AJUSTES_DEL_ANO } from './ayuda/ajustes-del-ano/guion';
import { EscenaMontarElAnoMapa } from './ayuda/montar-el-ano-mapa/Escena';
import { DURACION as DURACION_AYUDA_MONTAR_EL_ANO_MAPA } from './ayuda/montar-el-ano-mapa/guion';
import { EscenaSituacionesPorGrupos } from './ayuda/situaciones-por-grupos/Escena';
import { DURACION as DURACION_AYUDA_SITUACIONES_POR_GRUPOS } from './ayuda/situaciones-por-grupos/guion';
import { EscenaOrdinales } from './ayuda/ordinales/Escena';
import { DURACION as DURACION_AYUDA_ORDINALES } from './ayuda/ordinales/guion';
import { EscenaRutaInclusionPartes } from './ayuda/ruta-inclusion-partes/Escena';
import { DURACION as DURACION_AYUDA_RUTA_INCLUSION_PARTES } from './ayuda/ruta-inclusion-partes/guion';
import { EscenaRutaInclusionGrupo } from './ayuda/ruta-inclusion-grupo/Escena';
import { DURACION as DURACION_AYUDA_RUTA_INCLUSION_GRUPO } from './ayuda/ruta-inclusion-grupo/guion';
import { EscenaSinInternetSubirChoques } from './ayuda/sin-internet-subir-choques/Escena';
import { DURACION as DURACION_AYUDA_SIN_INTERNET_SUBIR_CHOQUES } from './ayuda/sin-internet-subir-choques/guion';
import { EscenaSinInternetSubirColumnas } from './ayuda/sin-internet-subir-columnas/Escena';
import { DURACION as DURACION_AYUDA_SIN_INTERNET_SUBIR_COLUMNAS } from './ayuda/sin-internet-subir-columnas/guion';
import { EscenaSinInternetExcel } from './ayuda/sin-internet-excel/Escena';
import { DURACION as DURACION_AYUDA_SIN_INTERNET_EXCEL } from './ayuda/sin-internet-excel/guion';
import { EscenaSinInternetBajar } from './ayuda/sin-internet-bajar/Escena';
import { DURACION as DURACION_AYUDA_SIN_INTERNET_BAJAR } from './ayuda/sin-internet-bajar/guion';
import { EscenaActividades } from './ayuda/actividades/Escena';
import { DURACION as DURACION_AYUDA_ACTIVIDADES } from './ayuda/actividades/guion';
import { EscenaBoletinIndependiente } from './ayuda/boletin-independiente/Escena';
import { DURACION as DURACION_AYUDA_BOLETIN_INDEPENDIENTE } from './ayuda/boletin-independiente/guion';
import { EscenaCopiarUnidades } from './ayuda/copiar-unidades/Escena';
import { DURACION as DURACION_AYUDA_COPIAR_UNIDADES } from './ayuda/copiar-unidades/guion';
import { EscenaMisDesempenos } from './ayuda/mis-desempenos/Escena';
import { DURACION as DURACION_AYUDA_MIS_DESEMPENOS } from './ayuda/mis-desempenos/guion';
import { EscenaNivelacionesLote } from './ayuda/nivelaciones-lote/Escena';
import { DURACION as DURACION_AYUDA_NIVELACIONES_LOTE } from './ayuda/nivelaciones-lote/guion';
import { EscenaAsistenciasConsulta } from './ayuda/asistencias-consulta/Escena';
import { DURACION as DURACION_AYUDA_ASISTENCIAS_CONSULTA } from './ayuda/asistencias-consulta/guion';
import { EscenaRubricasCalificar } from './ayuda/rubricas-calificar/Escena';
import { DURACION as DURACION_AYUDA_RUBRICAS_CALIFICAR } from './ayuda/rubricas-calificar/guion';
import { EscenaRubricasMontar } from './ayuda/rubricas-montar/Escena';
import { DURACION as DURACION_AYUDA_RUBRICAS_MONTAR } from './ayuda/rubricas-montar/guion';
import { EscenaRealMR } from './ayuda/planilla-real-m-r/Escena';
import { DURACION as DURACION_AYUDA_PLANILLA_REAL_M_R } from './ayuda/planilla-real-m-r/guion';
import { EscenaNoMeDeja } from './ayuda/no-me-deja-escribir/Escena';
import { DURACION as DURACION_AYUDA_NO_ME_DEJA_ESCRIBIR } from './ayuda/no-me-deja-escribir/guion';
import { EscenaCertificadosAlumno } from './ayuda/certificados-alumno/Escena';
import { DURACION as DURACION_AYUDA_CERTIFICADOS_ALUMNO } from './ayuda/certificados-alumno/guion';
import { EscenaEditarDocentes } from './ayuda/editar-docentes/Escena';
import { DURACION as DURACION_AYUDA_EDITAR_DOCENTES } from './ayuda/editar-docentes/guion';
import { EscenaAcudientes } from './ayuda/acudientes/Escena';
import { DURACION as DURACION_AYUDA_ACUDIENTES } from './ayuda/acudientes/guion';
import { EscenaImportarDecidir } from './ayuda/importar-decidir/Escena';
import { DURACION as DURACION_AYUDA_IMPORTAR_DECIDIR } from './ayuda/importar-decidir/guion';
import { EscenaImportarHojas } from './ayuda/importar-hojas/Escena';
import { DURACION as DURACION_AYUDA_IMPORTAR_HOJAS } from './ayuda/importar-hojas/guion';
import { EscenaDuplicados } from './ayuda/duplicados/Escena';
import { DURACION as DURACION_AYUDA_DUPLICADOS } from './ayuda/duplicados/guion';
import { EscenaCartera } from './ayuda/cartera/Escena';
import { DURACION as DURACION_AYUDA_CARTERA } from './ayuda/cartera/guion';
import { EscenaDocumentoUsuario } from './ayuda/documento-usuario/Escena';
import { DURACION as DURACION_AYUDA_DOCUMENTO_USUARIO } from './ayuda/documento-usuario/guion';
import { EscenaUsuarios } from './ayuda/usuarios/Escena';
import { DURACION as DURACION_AYUDA_USUARIOS } from './ayuda/usuarios/guion';
import { EscenaRequisitosAlumno } from './ayuda/requisitos-alumno/Escena';
import { DURACION as DURACION_AYUDA_REQUISITOS_ALUMNO } from './ayuda/requisitos-alumno/guion';
import { EscenaPrematriculas } from './ayuda/prematriculas/Escena';
import { DURACION as DURACION_AYUDA_PREMATRICULAS } from './ayuda/prematriculas/guion';
import { EscenaAlumnosDirectorio } from './ayuda/alumnos-directorio/Escena';
import { DURACION as DURACION_AYUDA_ALUMNOS_DIRECTORIO } from './ayuda/alumnos-directorio/guion';
import { EscenaMatricular } from './ayuda/matricular/Escena';
import { DURACION as DURACION_AYUDA_MATRICULAR } from './ayuda/matricular/guion';
import { EscenaAlumnoCrear } from './ayuda/alumno-crear/Escena';
import { DURACION as DURACION_AYUDA_ALUMNO_CREAR } from './ayuda/alumno-crear/guion';
import { EscenaFichaMatricula } from './ayuda/ficha-matricula/Escena';
import { DURACION as DURACION_AYUDA_FICHA_MATRICULA } from './ayuda/ficha-matricula/guion';
import { EscenaInasistenciasAlumno } from './ayuda/inasistencias-alumno/Escena';
import { DURACION as DURACION_AYUDA_INASISTENCIAS_ALUMNO } from './ayuda/inasistencias-alumno/guion';
import { EscenaPlanillasAula } from './ayuda/planillas-aula/Escena';
import { DURACION as DURACION_AYUDA_PLANILLAS_AULA } from './ayuda/planillas-aula/guion';
import { EscenaNotasPerdidasComision } from './ayuda/notas-perdidas-comision/Escena';
import { DURACION as DURACION_AYUDA_NOTAS_PERDIDAS_COMISION } from './ayuda/notas-perdidas-comision/guion';
import { EscenaPuestos } from './ayuda/puestos/Escena';
import { DURACION as DURACION_AYUDA_PUESTOS } from './ayuda/puestos/guion';
import { EscenaSemaforo } from './ayuda/semaforo/Escena';
import { DURACION as DURACION_AYUDA_SEMAFORO } from './ayuda/semaforo/guion';
import { EscenaInformesPila } from './ayuda/informes-pila/Escena';
import { EscenaEntregaDeNotas } from './ayuda/entrega-de-notas/Escena';
import { DURACION as DURACION_AYUDA_INFORMES_PILA } from './ayuda/informes-pila/guion';
import { DURACION as DURACION_AYUDA_ENTREGA_DE_NOTAS } from './ayuda/entrega-de-notas/guion';
import { EscenaInformesAjustes } from './ayuda/informes-ajustes/Escena';
import { DURACION as DURACION_AYUDA_INFORMES_AJUSTES } from './ayuda/informes-ajustes/guion';
import { EscenaInformesEncontrar } from './ayuda/informes-encontrar/Escena';
import { DURACION as DURACION_AYUDA_INFORMES_ENCONTRAR } from './ayuda/informes-encontrar/guion';
import { EscenaATuGusto } from './ayuda/a-tu-gusto/Escena';
import { DURACION as DURACION_AYUDA_A_TU_GUSTO } from './ayuda/a-tu-gusto/guion';
import { EscenaVolverRastro } from './ayuda/volver-rastro/Escena';
import { DURACION as DURACION_AYUDA_VOLVER_RASTRO } from './ayuda/volver-rastro/guion';
import { EscenaMenuSecciones } from './ayuda/menu-secciones/Escena';
import { DURACION as DURACION_AYUDA_MENU_SECCIONES } from './ayuda/menu-secciones/guion';
import { EscenaUnidades100 } from './ayuda/unidades-100/Escena';
import { DURACION as DURACION_AYUDA_UNIDADES_100 } from './ayuda/unidades-100/guion';
import { EscenaMisAsignaturas } from './ayuda/mis-asignaturas/Escena';
import { DURACION as DURACION_AYUDA_MIS_ASIGNATURAS } from './ayuda/mis-asignaturas/guion';
import { EscenaBuscarEscribiendo } from './ayuda/buscar-escribiendo/Escena';
import { DURACION as DURACION_AYUDA_BUSCAR_ESCRIBIENDO } from './ayuda/buscar-escribiendo/guion';
import { EscenaPeriodoArriba } from './ayuda/periodo-arriba/Escena';
import { DURACION as DURACION_AYUDA_PERIODO_ARRIBA } from './ayuda/periodo-arriba/guion';
import { EscenaGruposJuntos } from './ayuda/grupos-juntos/Escena';
import { DURACION as DURACION_AYUDA_GRUPOS_JUNTOS } from './ayuda/grupos-juntos/guion';
import { EscenaGruposCrear } from './ayuda/grupos-crear/Escena';
import { DURACION as DURACION_AYUDA_GRUPOS_CREAR } from './ayuda/grupos-crear/guion';
import { EscenaAsignaturasDias } from './ayuda/asignaturas-dias/Escena';
import { DURACION as DURACION_AYUDA_ASIGNATURAS_DIAS } from './ayuda/asignaturas-dias/guion';
import { EscenaAsignaturasCopiar } from './ayuda/asignaturas-copiar/Escena';
import { DURACION as DURACION_AYUDA_ASIGNATURAS_COPIAR } from './ayuda/asignaturas-copiar/guion';
import { EscenaAsignaturasModificar } from './ayuda/asignaturas-modificar/Escena';
import { DURACION as DURACION_AYUDA_ASIGNATURAS_MODIFICAR } from './ayuda/asignaturas-modificar/guion';
import { EscenaAsignaturasCrear } from './ayuda/asignaturas-crear/Escena';
import { DURACION as DURACION_AYUDA_ASIGNATURAS_CREAR } from './ayuda/asignaturas-crear/guion';
import { EscenaDocenteObservador } from './ayuda/docente-observador/Escena';
import { DURACION as DURACION_AYUDA_DOCENTE_OBSERVADOR } from './ayuda/docente-observador/guion';
import { EscenaDocenteUniformeTardanzas } from './ayuda/docente-uniforme-tardanzas/Escena';
import { DURACION as DURACION_AYUDA_DOCENTE_UNIFORME_TARDANZAS } from './ayuda/docente-uniforme-tardanzas/guion';
import { EscenaDocenteSituacion } from './ayuda/docente-situacion/Escena';
import { DURACION as DURACION_AYUDA_DOCENTE_SITUACION } from './ayuda/docente-situacion/guion';
import { EscenaDocenteComportamiento } from './ayuda/docente-comportamiento/Escena';
import { DURACION as DURACION_AYUDA_DOCENTE_COMPORTAMIENTO } from './ayuda/docente-comportamiento/guion';
import { EscenaConstanciaEstudio } from './ayuda/constancia-estudio/Escena';
import { DURACION as DURACION_AYUDA_CONSTANCIA_ESTUDIO } from './ayuda/constancia-estudio/guion';
import { EscenaCertificadoImprimir } from './ayuda/certificado-imprimir/Escena';
import { DURACION as DURACION_AYUDA_CERTIFICADO_IMPRIMIR } from './ayuda/certificado-imprimir/guion';
import { EscenaCertificadoDelAno } from './ayuda/certificado-del-ano/Escena';
import { DURACION as DURACION_AYUDA_CERTIFICADO_DEL_ANO } from './ayuda/certificado-del-ano/guion';
import { EscenaCertificadoMembrete } from './ayuda/certificado-membrete/Escena';
import { DURACION as DURACION_AYUDA_CERTIFICADO_MEMBRETE } from './ayuda/certificado-membrete/guion';
import { EscenaCierre8 } from './ayuda/cierre-8/Escena';
import { DURACION as DURACION_AYUDA_CIERRE_8_ACTA_NIVELACION } from './ayuda/cierre-8/guion';
import { EscenaCierre7 } from './ayuda/cierre-7/Escena';
import { DURACION as DURACION_AYUDA_CIERRE_7_ACTA } from './ayuda/cierre-7/guion';
import { EscenaCierre6 } from './ayuda/cierre-6/Escena';
import { DURACION as DURACION_AYUDA_CIERRE_6_DEFINITIVAS_PROMOVIDOS } from './ayuda/cierre-6/guion';
import { EscenaCierre5 } from './ayuda/cierre-5/Escena';
import { DURACION as DURACION_AYUDA_CIERRE_5_RECUPERACION } from './ayuda/cierre-5/guion';
import { EscenaCierre4 } from './ayuda/cierre-4/Escena';
import { DURACION as DURACION_AYUDA_CIERRE_4_BOLETINES } from './ayuda/cierre-4/guion';
import { EscenaCierre3 } from './ayuda/cierre-3/Escena';
import { DURACION as DURACION_AYUDA_CIERRE_3_NIVELACIONES } from './ayuda/cierre-3/guion';
import { EscenaCierre2 } from './ayuda/cierre-2/Escena';
import { DURACION as DURACION_AYUDA_CIERRE_2_CANDADOS } from './ayuda/cierre-2/guion';
import { EscenaPortada } from './ayuda/docente-portada/Escena';
import { DURACION as DURACION_AYUDA_DOCENTE_PORTADA } from './ayuda/docente-portada/guion';
import { EscenaAsistencia } from './ayuda/docente-asistencia/Escena';
import { DURACION as DURACION_AYUDA_DOCENTE_ASISTENCIA } from './ayuda/docente-asistencia/guion';
import { EscenaNotaRapida } from './ayuda/planilla-nota-rapida/Escena';
import { DURACION as DURACION_AYUDA_PLANILLA_NOTA_RAPIDA } from './ayuda/planilla-nota-rapida/guion';

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
		<Composition
			id="Ayuda-Cierre-1"
			component={EscenaCierre1}
			durationInFrames={DURACION_AYUDA_CIERRE_1}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Nota-Rapida"
			component={EscenaNotaRapida}
			durationInFrames={DURACION_AYUDA_PLANILLA_NOTA_RAPIDA}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Asistencia"
			component={EscenaAsistencia}
			durationInFrames={DURACION_AYUDA_DOCENTE_ASISTENCIA}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Portada"
			component={EscenaPortada}
			durationInFrames={DURACION_AYUDA_DOCENTE_PORTADA}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Cierre-2"
			component={EscenaCierre2}
			durationInFrames={DURACION_AYUDA_CIERRE_2_CANDADOS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Cierre-3"
			component={EscenaCierre3}
			durationInFrames={DURACION_AYUDA_CIERRE_3_NIVELACIONES}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Cierre-4"
			component={EscenaCierre4}
			durationInFrames={DURACION_AYUDA_CIERRE_4_BOLETINES}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Cierre-5"
			component={EscenaCierre5}
			durationInFrames={DURACION_AYUDA_CIERRE_5_RECUPERACION}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Cierre-6"
			component={EscenaCierre6}
			durationInFrames={DURACION_AYUDA_CIERRE_6_DEFINITIVAS_PROMOVIDOS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Cierre-7"
			component={EscenaCierre7}
			durationInFrames={DURACION_AYUDA_CIERRE_7_ACTA}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Cierre-8"
			component={EscenaCierre8}
			durationInFrames={DURACION_AYUDA_CIERRE_8_ACTA_NIVELACION}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Certificado-Membrete"
			component={EscenaCertificadoMembrete}
			durationInFrames={DURACION_AYUDA_CERTIFICADO_MEMBRETE}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Certificado-Del-Ano"
			component={EscenaCertificadoDelAno}
			durationInFrames={DURACION_AYUDA_CERTIFICADO_DEL_ANO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Certificado-Imprimir"
			component={EscenaCertificadoImprimir}
			durationInFrames={DURACION_AYUDA_CERTIFICADO_IMPRIMIR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Constancia-Estudio"
			component={EscenaConstanciaEstudio}
			durationInFrames={DURACION_AYUDA_CONSTANCIA_ESTUDIO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Comportamiento"
			component={EscenaDocenteComportamiento}
			durationInFrames={DURACION_AYUDA_DOCENTE_COMPORTAMIENTO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Situacion"
			component={EscenaDocenteSituacion}
			durationInFrames={DURACION_AYUDA_DOCENTE_SITUACION}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-UniformeTardanzas"
			component={EscenaDocenteUniformeTardanzas}
			durationInFrames={DURACION_AYUDA_DOCENTE_UNIFORME_TARDANZAS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Observador"
			component={EscenaDocenteObservador}
			durationInFrames={DURACION_AYUDA_DOCENTE_OBSERVADOR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-AsignaturasCrear"
			component={EscenaAsignaturasCrear}
			durationInFrames={DURACION_AYUDA_ASIGNATURAS_CREAR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-AsignaturasModificar"
			component={EscenaAsignaturasModificar}
			durationInFrames={DURACION_AYUDA_ASIGNATURAS_MODIFICAR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-AsignaturasCopiar"
			component={EscenaAsignaturasCopiar}
			durationInFrames={DURACION_AYUDA_ASIGNATURAS_COPIAR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-AsignaturasDias"
			component={EscenaAsignaturasDias}
			durationInFrames={DURACION_AYUDA_ASIGNATURAS_DIAS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-GruposCrear"
			component={EscenaGruposCrear}
			durationInFrames={DURACION_AYUDA_GRUPOS_CREAR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-GruposJuntos"
			component={EscenaGruposJuntos}
			durationInFrames={DURACION_AYUDA_GRUPOS_JUNTOS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Periodo-Arriba"
			component={EscenaPeriodoArriba}
			durationInFrames={DURACION_AYUDA_PERIODO_ARRIBA}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Buscar-Escribiendo"
			component={EscenaBuscarEscribiendo}
			durationInFrames={DURACION_AYUDA_BUSCAR_ESCRIBIENDO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Mis-Asignaturas"
			component={EscenaMisAsignaturas}
			durationInFrames={DURACION_AYUDA_MIS_ASIGNATURAS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Unidades-100"
			component={EscenaUnidades100}
			durationInFrames={DURACION_AYUDA_UNIDADES_100}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Menu-Secciones"
			component={EscenaMenuSecciones}
			durationInFrames={DURACION_AYUDA_MENU_SECCIONES}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Volver-Rastro"
			component={EscenaVolverRastro}
			durationInFrames={DURACION_AYUDA_VOLVER_RASTRO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-A-Tu-Gusto"
			component={EscenaATuGusto}
			durationInFrames={DURACION_AYUDA_A_TU_GUSTO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Informes-Encontrar"
			component={EscenaInformesEncontrar}
			durationInFrames={DURACION_AYUDA_INFORMES_ENCONTRAR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Informes-Ajustes"
			component={EscenaInformesAjustes}
			durationInFrames={DURACION_AYUDA_INFORMES_AJUSTES}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Informes-Pila"
			component={EscenaInformesPila}
			durationInFrames={DURACION_AYUDA_INFORMES_PILA}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Entrega-De-Notas"
			component={EscenaEntregaDeNotas}
			durationInFrames={DURACION_AYUDA_ENTREGA_DE_NOTAS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Semaforo"
			component={EscenaSemaforo}
			durationInFrames={DURACION_AYUDA_SEMAFORO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Puestos"
			component={EscenaPuestos}
			durationInFrames={DURACION_AYUDA_PUESTOS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Notas-Perdidas-Comision"
			component={EscenaNotasPerdidasComision}
			durationInFrames={DURACION_AYUDA_NOTAS_PERDIDAS_COMISION}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Planillas-Aula"
			component={EscenaPlanillasAula}
			durationInFrames={DURACION_AYUDA_PLANILLAS_AULA}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Inasistencias-Alumno"
			component={EscenaInasistenciasAlumno}
			durationInFrames={DURACION_AYUDA_INASISTENCIAS_ALUMNO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Ficha-Matricula"
			component={EscenaFichaMatricula}
			durationInFrames={DURACION_AYUDA_FICHA_MATRICULA}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-AlumnoCrear"
			component={EscenaAlumnoCrear}
			durationInFrames={DURACION_AYUDA_ALUMNO_CREAR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Matricular"
			component={EscenaMatricular}
			durationInFrames={DURACION_AYUDA_MATRICULAR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-AlumnosDirectorio"
			component={EscenaAlumnosDirectorio}
			durationInFrames={DURACION_AYUDA_ALUMNOS_DIRECTORIO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Prematriculas"
			component={EscenaPrematriculas}
			durationInFrames={DURACION_AYUDA_PREMATRICULAS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-RequisitosAlumno"
			component={EscenaRequisitosAlumno}
			durationInFrames={DURACION_AYUDA_REQUISITOS_ALUMNO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Usuarios"
			component={EscenaUsuarios}
			durationInFrames={DURACION_AYUDA_USUARIOS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-DocumentoUsuario"
			component={EscenaDocumentoUsuario}
			durationInFrames={DURACION_AYUDA_DOCUMENTO_USUARIO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Cartera"
			component={EscenaCartera}
			durationInFrames={DURACION_AYUDA_CARTERA}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Duplicados"
			component={EscenaDuplicados}
			durationInFrames={DURACION_AYUDA_DUPLICADOS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Importar-Hojas"
			component={EscenaImportarHojas}
			durationInFrames={DURACION_AYUDA_IMPORTAR_HOJAS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Importar-Decidir"
			component={EscenaImportarDecidir}
			durationInFrames={DURACION_AYUDA_IMPORTAR_DECIDIR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Acudientes"
			component={EscenaAcudientes}
			durationInFrames={DURACION_AYUDA_ACUDIENTES}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Editar-Docentes"
			component={EscenaEditarDocentes}
			durationInFrames={DURACION_AYUDA_EDITAR_DOCENTES}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Certificados-Alumno"
			component={EscenaCertificadosAlumno}
			durationInFrames={DURACION_AYUDA_CERTIFICADOS_ALUMNO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-No-Me-Deja"
			component={EscenaNoMeDeja}
			durationInFrames={DURACION_AYUDA_NO_ME_DEJA_ESCRIBIR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Real-M-R"
			component={EscenaRealMR}
			durationInFrames={DURACION_AYUDA_PLANILLA_REAL_M_R}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Rubricas-Montar"
			component={EscenaRubricasMontar}
			durationInFrames={DURACION_AYUDA_RUBRICAS_MONTAR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Rubricas-Calificar"
			component={EscenaRubricasCalificar}
			durationInFrames={DURACION_AYUDA_RUBRICAS_CALIFICAR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Asistencias"
			component={EscenaAsistenciasConsulta}
			durationInFrames={DURACION_AYUDA_ASISTENCIAS_CONSULTA}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Nivelaciones-Lote"
			component={EscenaNivelacionesLote}
			durationInFrames={DURACION_AYUDA_NIVELACIONES_LOTE}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Mis-Desempenos"
			component={EscenaMisDesempenos}
			durationInFrames={DURACION_AYUDA_MIS_DESEMPENOS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Copiar-Unidades"
			component={EscenaCopiarUnidades}
			durationInFrames={DURACION_AYUDA_COPIAR_UNIDADES}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Boletin-Independiente"
			component={EscenaBoletinIndependiente}
			durationInFrames={DURACION_AYUDA_BOLETIN_INDEPENDIENTE}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Actividades"
			component={EscenaActividades}
			durationInFrames={DURACION_AYUDA_ACTIVIDADES}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-SinInternet-Bajar"
			component={EscenaSinInternetBajar}
			durationInFrames={DURACION_AYUDA_SIN_INTERNET_BAJAR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-SinInternet-Excel"
			component={EscenaSinInternetExcel}
			durationInFrames={DURACION_AYUDA_SIN_INTERNET_EXCEL}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-SinInternet-SubirColumnas"
			component={EscenaSinInternetSubirColumnas}
			durationInFrames={DURACION_AYUDA_SIN_INTERNET_SUBIR_COLUMNAS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-SinInternet-SubirChoques"
			component={EscenaSinInternetSubirChoques}
			durationInFrames={DURACION_AYUDA_SIN_INTERNET_SUBIR_CHOQUES}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-RutaInclusion-Grupo"
			component={EscenaRutaInclusionGrupo}
			durationInFrames={DURACION_AYUDA_RUTA_INCLUSION_GRUPO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-RutaInclusion-Partes"
			component={EscenaRutaInclusionPartes}
			durationInFrames={DURACION_AYUDA_RUTA_INCLUSION_PARTES}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Ordinales"
			component={EscenaOrdinales}
			durationInFrames={DURACION_AYUDA_ORDINALES}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-SituacionesPorGrupos"
			component={EscenaSituacionesPorGrupos}
			durationInFrames={DURACION_AYUDA_SITUACIONES_POR_GRUPOS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Montar-El-Ano-Mapa"
			component={EscenaMontarElAnoMapa}
			durationInFrames={DURACION_AYUDA_MONTAR_EL_ANO_MAPA}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Ajustes-Del-Ano"
			component={EscenaAjustesDelAno}
			durationInFrames={DURACION_AYUDA_AJUSTES_DEL_ANO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Plan-Evaluacion-Modelo"
			component={EscenaPlanModelo}
			durationInFrames={DURACION_AYUDA_PLAN_EVALUACION_MODELO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Plan-Evaluacion-Plantilla"
			component={EscenaPlanPlantilla}
			durationInFrames={DURACION_AYUDA_PLAN_EVALUACION_PLANTILLA}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Niveles-Grados"
			component={EscenaNivelesGrados}
			durationInFrames={DURACION_AYUDA_NIVELES_GRADOS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Areas-Materias"
			component={EscenaAreasMaterias}
			durationInFrames={DURACION_AYUDA_AREAS_MATERIAS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Colegio-Ficha"
			component={EscenaColegioFicha}
			durationInFrames={DURACION_AYUDA_COLEGIO_FICHA}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Imagenes"
			component={EscenaImagenes}
			durationInFrames={DURACION_AYUDA_IMAGENES}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Compromiso-Academico"
			component={EscenaCompromisoAcademico}
			durationInFrames={DURACION_AYUDA_COMPROMISO_ACADEMICO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-FrasesCiudades"
			component={EscenaFrasesCiudades}
			durationInFrames={DURACION_AYUDA_FRASES_CIUDADES_CALENDARIO_MURO}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-Votaciones"
			component={EscenaVotaciones}
			durationInFrames={DURACION_AYUDA_VOTACIONES}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-PromocionarNotas"
			component={EscenaPromocionar}
			durationInFrames={DURACION_AYUDA_PROMOCIONAR_NOTAS}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-HorarioPrograma"
			component={EscenaHorarioPrograma}
			durationInFrames={DURACION_AYUDA_HORARIO_PROGRAMA}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-HorarioCuadrar"
			component={EscenaHorarioCuadrar}
			durationInFrames={DURACION_AYUDA_HORARIO_CUADRAR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-HorarioCualRige"
			component={EscenaHorarioCualRige}
			durationInFrames={DURACION_AYUDA_HORARIO_CUAL_RIGE}
			fps={FPS}
			width={1920}
			height={1080}
		/>
		<Composition
			id="Ayuda-HorarioImprimir"
			component={EscenaHorarioImprimir}
			durationInFrames={DURACION_AYUDA_HORARIO_IMPRIMIR}
			fps={FPS}
			width={1920}
			height={1080}
		/>
	</>
);
