/* Salen de `Metas.dc.html` (`myvc_ucn/diseno/gen_metas.py`). */

export type Estado = 'verde' | 'ambar' | 'rojo';

export const SEMAFORO: Record<Estado, { color: string; etiqueta: string; icono: string }> = {
	verde: { color: '#12876B', etiqueta: 'en meta', icono: '<path d="M5 12.5 10 17.5 19 7"></path>' },
	ambar: { color: '#9C8A0F', etiqueta: 'en riesgo', icono: '<path d="M12 8v5"></path><circle cx="12" cy="16.6" r="0.7" fill="currentColor"></circle><circle cx="12" cy="12" r="9"></circle>' },
	rojo: { color: '#C0521C', etiqueta: 'fuera de meta', icono: '<path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"></path><path d="M12 9v4"></path><circle cx="12" cy="17" r="0.6" fill="currentColor"></circle>' },
};

export const KPI = [
	{ etiqueta: 'Metas fijadas', valor: 6, pie: 'Las decide la junta de la Unión', delta: ['plano', 'para 2026', '12 de febrero'] as const },
	{ etiqueta: 'En meta', valor: 2, pie: 'Promedio académico y bautismos', delta: ['sube', '1', 'desde julio'] as const },
	{ etiqueta: 'En riesgo', valor: 3, pie: 'Matrícula, deserción y recaudo', delta: ['plano', 'cerca', 'pero sin llegar'] as const },
	{ etiqueta: 'Fuera de meta', valor: 1, pie: 'La proporción adventista', delta: ['baja', '0', 'igual que en julio'] as const },
	{ etiqueta: 'Días hasta el cierre', valor: 119, pie: 'Para la matrícula, menos', delta: ['plano', '31 dic', 'cierre del año'] as const },
];

export const METAS: { nombre: string; sub: string; valor: string; objetivo: string; cumpl: number; estado: Estado; nota: string }[] = [
	{ nombre: 'Matrícula nacional', sub: 'Fijada por la Unión el 12 de febrero', valor: '7.420', objetivo: '7.600', cumpl: 97.6, estado: 'ambar', nota: 'Faltan 180 alumnos y quedan cuatro meses.' },
	{ nombre: 'Alumnos de familia adventista', sub: 'El indicador que la Unión reporta a la División', valor: '62,4 %', objetivo: '65,0 %', cumpl: 96.0, estado: 'rojo', nota: 'Cerca, pero lleva siete años alejándose.' },
	{ nombre: 'Deserción por debajo de', sub: 'Retiros sobre matrícula inicial', valor: '4,7 %', objetivo: '4,0 %', cumpl: 85.1, estado: 'ambar', nota: 'A 0,4 puntos por año, la meta llega en 2028.' },
	{ nombre: 'Promedio académico', sub: 'Escala 1,00 a 5,00', valor: '4,12', objetivo: '4,10', cumpl: 100.5, estado: 'verde', nota: 'Cumplida en marzo y sostenida desde entonces.' },
	{ nombre: 'Recaudo del año', sub: 'Sobre lo facturado', valor: '87,4 %', objetivo: '90,0 %', cumpl: 97.1, estado: 'ambar', nota: 'Va 1,9 puntos por encima de 2025.' },
	{ nombre: 'Bautismos en el año', sub: 'Alumnos bautizados', valor: '192', objetivo: '180', cumpl: 106.7, estado: 'verde', nota: 'Superada en agosto, y faltan dos campañas.' },
];

/** La proporción de familia adventista, 2019-2026: cruzó la meta en 2023 y no volvió. */
export const ADVENTISTA = { anios: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026], valores: [68.9, 68.2, 67.0, 66.1, 65.0, 64.3, 63.6, 62.4] };
