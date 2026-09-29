import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { MEDIDAS, SECCIONES, alturaEnMenu } from '../medidas';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { DISCIPLINA, DESCARGO_NUEVO, LEYENDA, SITUACION_NUEVA, SITUACIONES_DE_SARA, altoDeSituaciones, celda, contador, crecida, detalle, selectorSinGrupo } from '../disciplina/datos';
import { FORM, botonDeTipo, botonPrincipal, lapiz, opcion, rect, IZQ } from '../disciplina/dialogo';
import type { TiemposDeLlegada } from '../disciplina/Llegada';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * DOCENTE: «REGISTRAR UNA SITUACIÓN».
 *
 * LA DUDA QUE MATA: **al EDITAR, los ordinales (y las faltas de las que deriva) se guardan solos en
 * el momento de marcarlos; todo lo demás sólo con «Guardar cambios».** Está en la cabecera de
 * `falta-modal.ts` de app2: `cambiarOrdinales()` llama a `asignar-ordinal` en el acto si el
 * formulario es de edición, y `guardarEdicion()` manda `dependencias: []` a propósito. Al CREAR,
 * en cambio, todo viaja junto en «Crear».
 *
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA   menú → Disciplina → Disciplina → el grupo (sin grupo no hay rejilla)
 *     2. LA REJILLA   una fila por alumno, el color es la gravedad, el «+» de la celda
 *     3. EL ALTA      el tipo primero, la descripción, «Crear» → «Falta creada.», se cierra solo
 *     4. LA EDICIÓN   contador → detalle → diálogo → lápiz; el ordinal se guarda al marcarlo, el
 *                     descargo sólo con «Guardar cambios»
 *
 * EL RITMO: los avisos salen medio segundo después del clic (la ida y vuelta), como en los demás.
 * La derivación no se enseña marcándose: sólo existe en los tipos 2 y 3 y alargaría el vídeo con
 * otro formulario; el rótulo lo dice, y es la misma función del código.
 */

export const FPS = 30;

export const LLEGADA: TiemposDeLlegada = {
	cursorEntra: 14,
	llegaSeccion: 40,
	pulsaSeccion: 46,
	llegaEntrada: 90,
	pulsaEntrada: 100,
	montaPagina: 104,
	llegaGrupo: 205,
	pulsaGrupo: 215,
	seVaLaCascara: 225,
	entraLaRejilla: 255,
};

/** La ida y vuelta de cada guardado: medio segundo. */
export const IDA_Y_VUELTA = 15;

export const ALTA = {
	llegaMas: 435,
	pulsaMas: 450,
	abre: 456,
	llegaTipo: 564,
	tipoEn: 576,
	llegaDesc: 687,
	enfocaDesc: 697,
	empieza: 707,
	porTecla: 1,
	llegaCrear: 808,
	pulsaCrear: 821,
	aviso: 821 + IDA_Y_VUELTA,
};

export const EDICION = {
	llegaContador: 949,
	pulsaContador: 959,
	llegaDetalle: 999,
	pulsaDetalle: 1011,
	abre: 1017,
	llegaLapiz: 1069,
	pulsaLapiz: 1081,
	bajaAOrdinales: 1277,
	llegaOrdinales: 1307,
	despliega: 1317,
	llegaOpcion: 1342,
	elige: 1354,
	avisoOrdinal: 1354 + IDA_Y_VUELTA,
	llegaDescargo: 1415,
	enfocaDescargo: 1425,
	empiezaDescargo: 1435,
	porTecla: 1,
	llegaGuardar: 1490,
	pulsaGuardar: 1502,
	guarda: 1502 + IDA_Y_VUELTA,
};

export const SCROLL_ALTA = [{ desde: 798, y: 170 }];
export const SCROLL_EDICION = [{ desde: EDICION.bajaAOrdinales, y: 250 }, { desde: EDICION.guarda, y: 0 }];

/* ── Lo que crece la celda ─────────────────────────────────────────────────────────────────── */

export const SITUACIONES_DESPUES = [SITUACIONES_DE_SARA[0], SITUACION_NUEVA];
const CRECE = crecida(altoDeSituaciones(SITUACIONES_DESPUES));

/* ── Focos y puntos ────────────────────────────────────────────────────────────────────────── */

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
const aire = (r: { x: number; y: number; ancho: number; alto: number }, a = 6) => ({ x: r.x - a, y: r.y - a, ancho: r.ancho + a * 2, alto: r.alto + a * 2 });

const Y_SECCION = alturaEnMenu(SECCIONES, DISCIPLINA.seccion, null, null);

export const FOCOS = {
	/*
	 * Sólo la sección «Disciplina»: un recuadro del alto de sus hijas, encendido antes de que se
	 * desplieguen, cubría Compromisos…Configuración. Se apaga al desplegarse.
	 */
	disciplina: enElFotograma({ x: 0, y: Y_SECCION, ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	selector: enElFotograma(selectorSinGrupo()),
	celda: aire(celda(0, 1), 2),
	leyenda: aire(LEYENDA),
	mas: aire(contador(0, 1, 5), 5),
	tipos: aire({ ...botonDeTipo(0, 0), ancho: FORM.anchoTipo * 3 }),
	descripcion: aire(rect(IZQ, FORM.desc, FORM.anchoCampo, FORM.fecha + FORM.campo - FORM.desc, 0)),
	crear: aire(botonPrincipal(100, 170)),
	contador: aire(contador(0, 1, 2), 5),
	detalle: aire(detalle(0, 1, altoDeSituaciones(SITUACIONES_DESPUES)), 4),
	lapiz: aire(lapiz(1, 0), 6),
	ordinales: aire(rect(IZQ, FORM.ord, FORM.anchoCampo, FORM.campo, 250)),
	descargo: aire(rect(IZQ, FORM.descargo, FORM.anchoCampo, FORM.campo, 250)),
	guardar: aire(botonPrincipal(180, 250)),
};

export const PUNTOS = {
	mas: centro(contador(0, 1, 5)),
	tipo: centro(botonDeTipo(0, 0)),
	desc: { x: IZQ + 90, y: centro(rect(IZQ, FORM.desc, 10, FORM.descAlto, 0)).y },
	crear: centro(botonPrincipal(100, 170)),
	contador: centro(contador(0, 1, 2)),
	detalle: { x: detalle(0, 1, 0).x + 150, y: detalle(0, 1, 0).y + 50 },
	lapiz: centro(lapiz(1, 0)),
	ordinales: { x: IZQ + 200, y: centro(rect(IZQ, FORM.ord, 10, FORM.campo, 250)).y },
	opcion: { x: IZQ + 220, y: centro(opcion(1, 250)).y },
	descargo: { x: IZQ + 200, y: centro(rect(IZQ, FORM.descargo, 10, FORM.campo, 250)).y },
	guardar: centro(botonPrincipal(180, 250)),
};

export { CRECE };

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Disciplina', url: 'micolegio.micolevirtual.com/up2/' };
const EN_DISCIPLINA = { ubicacion: 'Menú ▸ Disciplina ▸ Disciplina', url: '/disciplina' };
const EN_EL_DIALOGO = { ubicacion: 'Menú ▸ Disciplina ▸ Disciplina ▸ diálogo de situaciones', url: '/disciplina' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Las situaciones se registran en Disciplina.', ...EN_EL_MENU, foco: FOCOS.disciplina, focoHasta: LLEGADA.pulsaSeccion + 22 },
	{ desde: 128, texto: 'Sin grupo elegido no hay rejilla: primero, tu grupo.', ...EN_DISCIPLINA, foco: FOCOS.selector, focoHasta: LLEGADA.seVaLaCascara - 6 },
	{ desde: 272, texto: 'En cada celda, sus contadores; el color es la gravedad.', ...EN_DISCIPLINA, foco: FOCOS.celda },
	{ desde: 420, texto: 'El + de la celda crea una situación nueva.', voz: 'El botón más de la celda crea una situación nueva.', ...EN_DISCIPLINA, foco: FOCOS.mas, focoHasta: ALTA.pulsaMas + 2 },
	{ desde: 539, texto: 'Primero, el tipo: hasta elegirlo no sale nada más.', ...EN_EL_DIALOGO, foco: FOCOS.tipos, focoHasta: ALTA.tipoEn + 16 },
	{ desde: 677, texto: 'Escribe qué pasó; la fecha ya trae la de hoy.', ...EN_EL_DIALOGO, foco: FOCOS.descripcion },
	{ desde: 798, texto: 'Crear guarda todo junto, y el diálogo se cierra solo.', ...EN_EL_DIALOGO, foco: FOCOS.crear, focoHasta: ALTA.pulsaCrear },
	{ desde: 934, texto: 'Para completarla: contador, detalle y el lápiz de la fila.', ...EN_DISCIPLINA, foco: FOCOS.contador, focoHasta: EDICION.pulsaContador + 4 },
	{ desde: 1087, texto: 'No la borres: edítala. Borrar no se deshace.', rojo: true, ...EN_EL_DIALOGO },
	{ desde: 1272, texto: 'Cada ordinal se guarda en el acto, sin botón.', ...EN_EL_DIALOGO, foco: FOCOS.ordinales, focoHasta: EDICION.despliega - 2 },
	{ desde: 1395, texto: 'El descargo, en cambio, pide Guardar cambios.', ...EN_EL_DIALOGO, foco: FOCOS.descargo, focoHasta: EDICION.llegaGuardar - 20 },
];

export const TARJETA = 1560;
export const DURACION = 1680;

export const CLAVE = 'docente-situacion';
export const TITULO = 'Registrar una situación';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Disciplina, y el grupo' },
	{ desde: LLEGADA.entraLaRejilla, titulo: 'La rejilla y sus colores' },
	{ desde: 420, titulo: 'Crear una situación con el +' },
	{ desde: 934, titulo: 'Editarla: el ordinal se guarda solo' },
	{ desde: 1395, titulo: 'Lo demás, con Guardar cambios' },
];

export const CIERRE: Cierre = {
	hiciste: 'Registraste una situación con el + y la completaste al editarla.',
	seVe: 'Salen «Falta creada.», «Ordinal asignado.» y «Cambios guardados.», y el contador sube.',
	despues: 'Siguiente: uniforme y llegadas tarde, en la misma rejilla.',
	voz: 'Siguiente: uniforme y llegadas tarde.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* Los avisos caen dentro del paso que los explica. */
if (ALTA.aviso < PASOS[6].desde || ALTA.aviso >= PASOS[7].desde) { throw new Error('Guion: «Falta creada.» sale fuera del paso 7.'); }
if (EDICION.avisoOrdinal < PASOS[9].desde || EDICION.avisoOrdinal >= PASOS[10].desde) { throw new Error('Guion: «Ordinal asignado.» sale fuera del paso 10.'); }
if (EDICION.guarda < PASOS[10].desde || EDICION.guarda + 30 > TARJETA) { throw new Error('Guion: «Cambios guardados.» tiene que salir en el último paso, antes de la tarjeta.'); }
/* El tecleo acaba antes de ir al botón. */
if (ALTA.empieza + SITUACION_NUEVA.descripcion.length * ALTA.porTecla > ALTA.llegaCrear - 40) { throw new Error('Guion: la descripción no acaba de escribirse antes de ir a Crear.'); }
if (EDICION.empiezaDescargo + DESCARGO_NUEVO.length * EDICION.porTecla > EDICION.llegaGuardar - 20) { throw new Error('Guion: el descargo no acaba antes de ir a Guardar cambios.'); }
