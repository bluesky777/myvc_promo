import { enElFotograma } from '../encuadre';
import { BOTONES, rectanguloDelBoton } from '../planilla/datos';
import { LLEGADA_CORTA, TiemposDeLlegada } from '../planilla-nota-rapida/Llegada';
import { LA_DE_RUBRICAS, NUEVA } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «RÚBRICAS: MONTAR LA MATRIZ».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS DOS DUDAS QUE MATA
 *
 *     1. **Los pesos tienen que sumar 100**, y la pantalla lo dice con el aviso amarillo y la suma
 *        en rojo; pero NO impide guardar (`avisoPesos`: «una rúbrica a medio montar tiene que
 *        poder guardarse»). Se ve con números: 110 dice «se puede pasar de 100».
 *     2. **Cambiar pesos o puntajes NO recalcula lo ya calificado.** Lo dice el aviso de «Esta
 *        rúbrica ya está en uso», con esas palabras. Es el último rótulo y el más largo.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA   Académico -> Mis asignaturas -> «Rúbricas» de 9°A
 *     2. LA MATRIZ    Nueva rúbrica, nombre, sembrar los niveles, tres criterios con su peso
 *     3. LOS PESOS    110 -> el aviso; se corrige a 30 y suma 100; dos descriptores; Guardar
 *     4. EN USO       la lista, y la del taller, que ya calificó: el aviso de «ya está en uso»
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL RITMO: se teclea a una letra cada 3 fotogramas (10 por segundo, un docente que escribe
 * seguido) y los descriptores a una cada 2, que es lo más rápido que se lee todavía como teclear.
 * Guardar es un POST: medio segundo hasta «Rúbrica guardada». Sembrar es un GET: medio segundo
 * hasta que salen los niveles. Todo lo demás es la pantalla respondiendo en el sitio.
 *
 * Dura unos 61 s: son dos cosas que no se entienden la una sin la otra (montar, y saber que cambiarla
 * luego no toca lo calificado).
 */

export const FPS = 30;

const RUBRICAS = BOTONES.indexOf('Rúbricas');

/*
 * La llegada, más corta que `LLEGADA_CORTA` (que es de otros vídeos y no se toca): los mismos
 * pasos, con los viajes del puntero a 30–60 fotogramas. La usan los dos vídeos de rúbricas.
 */
export const LLEGADA: TiemposDeLlegada = {
	...LLEGADA_CORTA,
	cursorEntra: 10,
	llegaAcademico: 34,
	pulsaAcademico: 40,
	abreAcademico: 42,
	llegaMisAsignaturas: 80,
	pulsaMisAsignaturas: 88,
	montaLista: 92,
	llegaBoton: 158,
	pulsaBoton: 172,
	cursorSale: 182,
	seVaLaCascara: 185,
	entraLaPlanilla: 215,
};
export const ENTRA = LLEGADA.entraLaPlanilla;
export const L = (f: number) => ENTRA + f;

/** El botón «Rúbricas» de la fila de 9°A, en coordenadas de la cáscara. */
export const BOTON_RUBRICAS = rectanguloDelBoton(LA_DE_RUBRICAS, RUBRICAS);

/* ── La pantalla, en fotogramas LOCALES ───────────────────────────────────────────────────── */

export const POR_LETRA = 3;
export const POR_LETRA_DESCRIPTOR = 2;
const IDA_Y_VUELTA = 15;

export const T = {
	cursorEntra: 16,
	llegaNueva: 70,
	pulsaNueva: 80,
	pulsaNombre: 135,
	tecleaNombre: 145,
	llegaSembrar: 240,
	pulsaSembrar: 250,
	/* Cada criterio: pulsar la definición, teclearla, pulsar el peso, teclearlo, «+ Criterio»: 96. */
	pulsaDef: [370, 466, 562],
	tecleaDef: [378, 474, 570],
	pulsaPeso: [416, 512, 608],
	tecleaPeso: [424, 520, 616],
	pulsaMasCriterio: [450, 546],
	/** La corrección del tercer peso: 40 -> 30, con dos retrocesos. */
	pulsaCorrige: 752,
	corrige: 764,
	pulsaCelda: [866, 963],
	tecleaCelda: [878, 975],
	llegaGuardar: 1039,
	pulsaGuardar: 1049,
	pulsaVolver: 1190,
	llegaTaller: 1225,
	pulsaTaller: 1237,
	llegaEnlace: 1347,
	cursorSale: 1465,
};

export const SALEN_LOS_NIVELES = T.pulsaSembrar + IDA_Y_VUELTA;
export const GUARDADA = T.pulsaGuardar + IDA_Y_VUELTA;
/** Las teclas de la corrección: «4», «», «3», «30». */
export const CORRECCION = ['4', '', '3', NUEVA.criterios[2].corregido!];
export const QUEDA_EN_100 = T.corrige + (CORRECCION.length - 1) * 5;

export const AVISO_GUARDADA = { desde: L(GUARDADA), dura: 75 };

/** El foco del botón «Rúbricas» de la llegada. */
export const FOCO_BOTON_RUBRICAS = enElFotograma(BOTON_RUBRICAS);
