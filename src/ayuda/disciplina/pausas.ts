import type { Punto } from '../../comunes/Cursor';

/*
 * EL PUNTERO SE QUEDA QUIETO MIENTRAS PULSA. `Cursor` va de punto a punto sin parar, así que si el
 * clic cae entre la llegada a un mando y la salida hacia el siguiente, el anillo sale donde el
 * puntero ya se está yendo. Esto mete, por cada clic, un punto igual al de llegada `quieto`
 * fotogramas después del clic: la mano llega, pulsa, y luego se va.
 */
export function conPausas(puntos: Punto[], clics: number[], quieto = 8): Punto[] {
	const lista = [...puntos].sort((a, b) => a.frame - b.frame);
	for (const c of clics) {
		const antes = lista.filter((p) => p.frame <= c).pop();
		const despues = lista.find((p) => p.frame > c);
		if (!antes || !despues) { continue; }
		if (despues.x === antes.x && despues.y === antes.y) { continue; }
		const hasta = Math.min(c + quieto, despues.frame - 1);
		if (hasta > c) { lista.push({ frame: hasta, x: antes.x, y: antes.y }); lista.sort((a, b) => a.frame - b.frame); }
	}
	return lista;
}
