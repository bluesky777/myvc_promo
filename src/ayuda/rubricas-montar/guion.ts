import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { FOCOS_LLEGADA } from '../planilla-nota-rapida/Llegada';
import { FOCO_BOTON_RUBRICAS } from './tiempo';
import { ASIGNATURA_ID } from './datos';
import { FOCOS } from './estado';
import { AVISO_GUARDADA, GUARDADA, L, LLEGADA, QUEDA_EN_100, T } from './tiempo';

/*
 * EL GUION DE «RÚBRICAS: MONTAR LA MATRIZ». Los tiempos y el porqué de cada uno están en
 * `tiempo.ts`; aquí van los rótulos, que necesitan los focos, y los focos salen del estado de la
 * pantalla (`estado.ts`), que a su vez necesita los tiempos. Partirlo así evita el círculo.
 */

export { ENTRA, LLEGADA, T, AVISO_GUARDADA, BOTON_RUBRICAS } from './tiempo';

export const FPS = 30;

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_LISTA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };
const EN_RUBRICAS = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Rúbricas', url: `/rubricas/${ASIGNATURA_ID}` };

export const TEXTOS_DE_PASOS = {
	p1: 'Ve a Académico, Mis asignaturas.',
	p2: 'En 9°A, el botón Rúbricas.',
	p3: '«Nueva rúbrica»: criterios por niveles.',
	p4: 'Ponle un nombre que la distinga.',
	p5: '«Sembrar niveles» trae los de la escala del colegio.',
	p7: 'Un criterio por fila, con su peso.',
	p8: 'Si no suman 100, lo avisa; pero deja guardar.',
	p9: 'Se corrige a 30: ahora suma 100.',
	p10: 'En cada celda, qué hace el alumno en ese nivel.',
	p11: 'Sale «Rúbrica guardada»; se enlaza al calificar.',
	p12: 'Si ya está enlazada a un indicador, dice «en uso».',
	p13: 'Cambiar pesos o puntajes NO recalcula lo ya calificado.',
};

const focos = FOCOS;
const X = TEXTOS_DE_PASOS;

export const PASOS: Paso[] = [
	{ desde: 10, texto: X.p1, ...EN_EL_MENU, foco: FOCOS_LLEGADA.academico, focoHasta: LLEGADA.pulsaAcademico + 20 },
	{ desde: 116, texto: X.p2, voz: 'En noveno A, el botón Rúbricas.', ...EN_LA_LISTA, foco: FOCO_BOTON_RUBRICAS, focoHasta: LLEGADA.seVaLaCascara - 6 },
	{ desde: L(10), texto: X.p3, ...EN_RUBRICAS, foco: focos.nueva, focoHasta: L(T.pulsaNueva - 10) },
	{ desde: L(126), texto: X.p4, ...EN_RUBRICAS, foco: focos.nombre },
	{ desde: L(222), texto: X.p5, ...EN_RUBRICAS, foco: focos.sembrar, focoHasta: L(T.pulsaSembrar + 10) },
	{ desde: L(363), texto: X.p7, ...EN_RUBRICAS },
	{ desde: L(622), texto: X.p8, ...EN_RUBRICAS, foco: focos.avisoPesos },
	/* Sin foco: la corrección quita el aviso y la matriz sube a mitad del paso; un recuadro fijo señalaría el hueco. */
	{ desde: L(T.pulsaCorrige), texto: X.p9, ...EN_RUBRICAS },
	{ desde: L(T.pulsaCelda[0]), texto: X.p10, ...EN_RUBRICAS, foco: focos.fila1 },
	{ desde: L(GUARDADA), texto: X.p11, ...EN_RUBRICAS },
	{ desde: L(1206), texto: X.p12, ...EN_RUBRICAS, foco: focos.filaTaller, focoHasta: L(T.pulsaTaller - 10) },
	{ desde: L(T.llegaEnlace), texto: X.p13, voz: 'Cambiar pesos o puntajes no recalcula lo ya calificado.', ...EN_RUBRICAS, foco: focos.enUso },
];

export const TARJETA = L(1480);
export const DURACION = TARJETA + 120;

export const CLAVE = 'rubricas-montar';

export const TITULO = 'Rúbricas: montar la matriz';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Mis asignaturas, Rúbricas' },
	{ desde: L(10), titulo: 'Nueva rúbrica y sus niveles' },
	{ desde: L(363), titulo: 'Criterios y pesos: que sumen 100' },
	{ desde: L(T.pulsaCelda[0]), titulo: 'Descriptores y Guardar' },
	{ desde: L(1206), titulo: 'En uso: cambiarla no recalcula' },
];

export const CIERRE: Cierre = {
	hiciste: 'Montaste una rúbrica: niveles de la escala y tres criterios que suman 100.',
	seVe: 'Sale «Rúbrica guardada», y en la lista, «3 criterios × 4 niveles».',
	despues: 'Siguiente: «Rúbricas: calificar».',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

{
	const p = PASOS;
	/* El rótulo de «Rúbrica guardada» empieza cuando sale el aviso. */
	if (p[9].desde !== AVISO_GUARDADA.desde) {
		throw new Error('Guion: «Rúbrica guardada» no sale donde empieza el paso que lo cuenta.');
	}
	/* La corrección cae dentro del paso que la cuenta, y el aviso de 110 ya se ve en el anterior. */
	if (L(QUEDA_EN_100) < p[7].desde || L(T.tecleaPeso[2] + 5) > p[6].desde) {
		throw new Error('Guion: el 110 o su corrección no caen en el paso que los cuenta.');
	}
}
