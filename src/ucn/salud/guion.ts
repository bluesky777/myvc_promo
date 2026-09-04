/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL GUION DE «SALUD ESCOLAR».
 *
 * LO QUE CUENTA: **un colegio solo no puede saber que treinta y cuatro fiebres son muchas.** Sabe
 * cuántas lleva, no cuántas son normales. La red sí lo sabe, y por eso el aviso existe.
 *
 *   1  LAS CIFRAS         once mil atenciones, y las cinco que las resumen
 *   2  EL AÑO             mes a mes, con marzo y agosto de pico
 *   3  EL AVISO           y ahí aparece el brote de fiebre, en rojo
 *   4  EL PORQUÉ          la fiebre, subrayada entre los motivos: es la que dispara el aviso
 *
 * EL ORDEN IMPORTA: primero se enseña lo normal y luego lo anormal. Al revés, el brote sería un
 * número más. Y el gráfico de motivos va **después** del aviso a propósito: no es una lista, es la
 * respuesta a por qué saltó justo ése.
 */

export const FPS = 30;

export const MARCO = 0;
export const KPIS = 28;
export const PASO_KPI = 6;

export const CARD_MESES = 76;
export const BARRAS_MES = 92;

export const CARD_AVISOS = 148;
export const AVISOS_ENTRAN = 162;
export const PASO_AVISO = 16;
/** El primero se subraya: es el que da sentido a la pantalla. */
export const RESALTE = 232;

export const CARD_MOTIVOS = 262;
export const BARRAS_MOTIVO = 276;
/** La fiebre se enciende cuando ya se ha leído el aviso: es su explicación, no un dato suelto. */
export const FIEBRE = 330;

export const SALIDA = 386;
export const DURACION = 430;
