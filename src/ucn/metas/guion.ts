/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL GUION DE «METAS Y SEMÁFORO».
 *
 * LO QUE CUENTA: la Unión fija la meta una vez al año, en febrero, y **el portal la persigue solo
 * hasta diciembre**. Nadie tiene que pedir el dato ni montar la hoja de cálculo de octubre.
 *
 *   1  LAS SEIS METAS      cada barra crece hasta donde va, y la marca negra es adónde tenía que ir
 *   2  EL SEMÁFORO         y sólo al final de su barra se enciende su color
 *   3  EL 96 % EN ROJO     que es la pregunta que hace que la pantalla valga
 *
 * EL SEMÁFORO SE ENCIENDE DESPUÉS DE LA BARRA, no a la vez: primero se ve cuánto falta y luego cómo
 * lo llama el portal. Encendido desde el principio, el color sería una etiqueta puesta a mano.
 *
 * Y EL TERCER ACTO ES EL QUE IMPORTA: un 96 % pintado de rojo al lado de un 100,5 % en verde parece
 * un error hasta que se ve la línea de ocho años. El semáforo no mira sólo cuánto falta, mira **hacia
 * dónde va**: una meta que se aleja año tras año está fuera de meta aunque esté cerca.
 */

export const FPS = 30;

export const MARCO = 0;
export const KPIS = 26;
export const PASO_KPI = 6;

export const TABLERO = 72;
export const FILAS = 86;
export const PASO_FILA = 15;
/** El color llega 12 fotogramas después de que su barra haya terminado de crecer. */
export const RETRASO_SEMAFORO = 20;

export const CARD_LINEA = 208;
export const LINEA = 224;
export const LINEA_DUR = 54;
/** El aviso que explica el rojo, cuando la línea ya ha cruzado la meta y se ve. */
export const EXPLICA = 300;

export const SALIDA = 348;
export const DURACION = 392;
