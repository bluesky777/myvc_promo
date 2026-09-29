import { Paso } from '../tiempos';
import { FOCOS_LLEGADA, TiemposDeLlegada } from './Llegada';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA LLEGADA A LA PLANILLA, CON VOZ (encargo del 2026-09-29: un tercio más cortos). Es la misma de
 * `LLEGADA_CORTA` --menú, Académico, Mis asignaturas, el botón «Planilla» de 9°B-- con los viajes
 * del puntero apretados y dos rótulos que caben en lo que tardan en decirse. `LLEGADA_CORTA` se
 * queda como estaba porque la usan vídeos de otros lotes (rúbricas, asistencia).
 *
 * La usan los vídeos del docente que abren la planilla: nota rápida, «no me deja escribir»,
 * Real/M/R, boletín independiente, nivelaciones en lote.
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 */
export const LLEGADA_RAPIDA: TiemposDeLlegada = {
	cursorEntra: 4,
	llegaAcademico: 30,
	pulsaAcademico: 36,
	abreAcademico: 38,
	llegaMisAsignaturas: 96,
	pulsaMisAsignaturas: 104,
	montaLista: 108,
	llegaBoton: 150,
	pulsaBoton: 208,
	cursorSale: 218,
	seVaLaCascara: 222,
	entraLaPlanilla: 248,
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_LISTA = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };

/** Los dos rótulos de la llegada. El tercero, el de la planilla, empieza en `entraLaPlanilla + 8`. */
export const PASOS_DE_LLEGADA = (): Paso[] => [
	{
		desde: 8,
		texto: 'Abre Académico y entra en Mis asignaturas.',
		...EN_EL_MENU,
		foco: FOCOS_LLEGADA.academico,
		focoHasta: LLEGADA_RAPIDA.pulsaAcademico + 20,
	},
	{
		desde: 130,
		texto: 'En la fila de 9°B, pulsa Planilla.',
		voz: 'En la fila de noveno B, pulsa Planilla.',
		...EN_LA_LISTA,
		foco: FOCOS_LLEGADA.botonPlanilla,
		focoHasta: LLEGADA_RAPIDA.seVaLaCascara - 6,
	},
];
