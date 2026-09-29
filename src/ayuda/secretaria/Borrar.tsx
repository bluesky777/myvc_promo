import React from 'react';

import { Boton } from '../montar-el-ano/ant';
import { Dialogo, LETRA, botonesDelPie, cajaCentrada, type Rect } from './piezas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «¿SEGURO QUE DESEAS ELIMINAR?» (`comunes/modal/confirmar-borrado.ts`), con las opciones que le
 * pasa Alumnos (`panel-alumnos.ts:1090-1098`): el nombre, el Id, «Se va a la papelera con su
 * historial. Se puede restaurar buscándolo abajo.» y el «¡PELIGRO!» rojo. En la cáscara.
 */

export const CAJA_BORRAR = cajaCentrada(500, 300);
export const PIE_BORRAR = botonesDelPie(CAJA_BORRAR, [{ texto: 'Cancelar' }, { texto: 'Eliminar' }]);

/** El párrafo que dice que se puede deshacer, en la cáscara. */
export const rectMensajeBorrar = (): Rect => ({ x: CAJA_BORRAR.x + 18, y: CAJA_BORRAR.y + 58 + 18 + 60, ancho: CAJA_BORRAR.ancho - 36, alto: 52 });

export const DialogoBorrar: React.FC<{ nombre: string; id: number; t: number; sale?: number; encimaEliminar?: boolean }> = ({ nombre, id, t, sale = 0, encimaEliminar = false }) => (
	<Dialogo
		caja={CAJA_BORRAR}
		titulo="¿Seguro que deseas eliminar?"
		t={t}
		sale={sale}
		pie={
			<>
				<div style={{ position: 'absolute', left: PIE_BORRAR[0].x - CAJA_BORRAR.x, top: 14 }}><Boton texto="Cancelar" ancho={PIE_BORRAR[0].ancho} /></div>
				<div style={{ position: 'absolute', left: PIE_BORRAR[1].x - CAJA_BORRAR.x, top: 14 }}>
					<Boton texto="Eliminar" tipo="primary" peligro ancho={PIE_BORRAR[1].ancho} encima={encimaEliminar} />
				</div>
			</>
		}
	>
		<div style={{ fontSize: LETRA + 1, fontWeight: 600, height: 26 }}>{nombre}</div>
		<div style={{ fontSize: LETRA - 1, fontWeight: 600, height: 26 }}>Id: {id}</div>
		<div style={{ fontSize: LETRA, lineHeight: '22px', marginTop: 8 }}>Se va a la papelera con su historial. Se puede restaurar buscándolo abajo.</div>
		<div style={{ color: 'red', fontWeight: 900, textAlign: 'center', fontSize: 26, marginTop: 14 }}>¡PELIGRO!</div>
	</Dialogo>
);
