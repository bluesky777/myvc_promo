/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LOS ICONOS DE MATERIA, **COPIADOS DEL PROGRAMA DE HORARIOS**, no redibujados.
 *
 * Salen de `myvc_horarios/escritorio/src/app/iconos/icono-materia.html` tal cual: los mismos
 * trazos y los mismos colores. Redibujarlos «parecidos» sería enseñar en el vídeo un informe que
 * no es el que sale de la impresora, y el informe con dibujos es justo lo que este clip vende.
 *
 * Van como cadenas y se pintan con `dangerouslySetInnerHTML` a propósito: así se pegan **sin tocar
 * ni un atributo**. Pasarlos a JSX obligaría a renombrar `stroke-width` y compañía uno a uno, que
 * es donde se cuela la errata que nadie ve hasta que un dibujo sale sin contorno.
 *
 * Si en el programa cambian, aquí hay que volver a copiarlos. El extractor está en el historial de
 * esta sesión; son doce de los dieciséis que tiene el programa.
 */

export const ICONOS_DE_MATERIA: Record<string, string> = {
	matematicas: `<path d="M6 40 40 6v34z" fill="#F2D9A8" stroke="#7E5527" stroke-width="2.6" stroke-linejoin="round" />
<path d="M13 36h21V15z" fill="#FFFDF5" />
<path d="M34 36v-6M28 36v-4M22 36v-4M17 36v-3" stroke="#7E5527" stroke-width="1.8" stroke-linecap="round" />`,
	lengua: `<path d="M4 11c7-3 13-3 20 1v29c-7-4-13-4-20-1z" fill="#FFFDF5" stroke="#3F5E86" stroke-width="2.4" stroke-linejoin="round" />
<path d="M44 11c-7-3-13-3-20 1v29c7-4 13-4 20-1z" fill="#EDF2F8" stroke="#3F5E86" stroke-width="2.4" stroke-linejoin="round" />
<path d="M24 12v29" stroke="#3F5E86" stroke-width="2.2" />
<path d="M9 19c4-1.4 7.6-1.4 11 .4M9 26c4-1.4 7.6-1.4 11 .4M39 19c-4-1.4-7.6-1.4-11 .4" stroke="#8FA6C4" stroke-width="1.6" stroke-linecap="round" fill="none" />`,
	ingles: `<path d="M7 9h34a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H21l-9 8v-8H7a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3z" fill="#DCEBF8" stroke="#215883" stroke-width="2.6" stroke-linejoin="round" />
<path d="M12 17h24M12 24h16" stroke="#3F86C4" stroke-width="2.6" stroke-linecap="round" />`,
	religion: `<path d="M19 4h10v11h11v10H29v19H19V25H8V15h11z" fill="#D9C9A6" stroke="#6B5535" stroke-width="2.6" stroke-linejoin="round" />
<path d="M21.5 7h2v33h-2z" fill="#fff" opacity=".45" />`,
	etica: `<path d="M24 42C10 33 4 26 4 18.5 4 12 9 7 15 7c4 0 7 2 9 5 2-3 5-5 9-5 6 0 11 5 11 11.5C44 26 38 33 24 42z" fill="#E06A5A" stroke="#8D2B1E" stroke-width="2.6" stroke-linejoin="round" />
<path d="M13 13c-2.4 1.6-3.6 4-3.6 6.6" stroke="#fff" stroke-width="3" opacity=".5" stroke-linecap="round" fill="none" />`,
	artistica: `<path d="M24 5c11 0 20 7.4 20 16.5 0 5.6-4.6 7-8 7-2.6 0-4.4 1.6-4.4 4 0 2.2 1.4 3 1.4 5 0 2.8-3 5-9 5C13 42.5 4 34 4 22.5 4 12.6 13 5 24 5z" fill="#F0DCC0" stroke="#7E5527" stroke-width="2.6" stroke-linejoin="round" />
<circle cx="15" cy="16" r="3.2" fill="#C0392B" />
<circle cx="25" cy="13" r="3.2" fill="#2E86C1" />
<circle cx="34" cy="18" r="3.2" fill="#E5A62A" />
<circle cx="13" cy="27" r="3.2" fill="#2E7D3A" />`,
	deporte: `<path d="M18 22h12v6H18z" fill="#8A929C" stroke="#3E444C" stroke-width="2.2" />
<path d="M11 16h7v18h-7zM30 16h7v18h-7z" fill="#5A626D" stroke="#2A2F36" stroke-width="2.4" stroke-linejoin="round" />
<path d="M4 20h7v10H4zM37 20h7v10h-7z" fill="#5A626D" stroke="#2A2F36" stroke-width="2.4" stroke-linejoin="round" />`,
	sociales: `<defs>
<linearGradient id="soc-mar" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#8ECBF3" /><stop offset="1" stop-color="#2A6EA0" />
</linearGradient>
</defs>
<circle cx="24" cy="19.5" r="14.5" fill="url(#soc-mar)" stroke="#1D4F77" stroke-width="2.2" />
<path d="M11 14.5c4 2.4 8.6 2.8 12.4 1.2 3.2-1.4 6.8-.8 9.4 1.1M10.6 25.6c4.4-1.2 8.2-.2 11.2 1.7 2.8 1.7 6.4 1.4 9.2-.5" stroke="#3E9B57" stroke-width="3.2" stroke-linecap="round" fill="none" />
<ellipse cx="24" cy="19.5" rx="6.6" ry="14.5" fill="none" stroke="#1D4F77" stroke-width="1.5" />
<path d="M24 34v6" stroke="#7E5527" stroke-width="3" stroke-linecap="round" />
<path d="M14 44c2-3.2 5.6-4.6 10-4.6s8 1.4 10 4.6z" fill="#C9964F" stroke="#5E4021" stroke-width="2" stroke-linejoin="round" />`,
	naturales: `<defs>
<linearGradient id="nat-hoja" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#8FD87F" /><stop offset="1" stop-color="#2E7D3A" />
</linearGradient>
</defs>
<path d="M41 5C22 5 9 14 9 28c0 5.4 2 10 5.4 13.2C18 35 25 29 36 26 26 30 20 36 17.6 43.6 33 44 41 33 41 5z" fill="url(#nat-hoja)" stroke="#1F5F28" stroke-width="2.2" stroke-linejoin="round" />
<path d="M38 9C30 20 24 30 19 42" stroke="#1F5F28" stroke-width="1.8" stroke-linecap="round" fill="none" />
<path d="M33 13c-5 1.4-9.4 4-12.6 7.6" stroke="#fff" stroke-width="2.2" opacity=".45" stroke-linecap="round" fill="none" />`,
	quimica: `<path d="M20 5h8v13l11 19a5 5 0 0 1-4.3 7.6H13.3A5 5 0 0 1 9 37l11-19z" fill="#EAF4FB" stroke="#1B4763" stroke-width="2.8" stroke-linejoin="round" />
<path d="M13.4 30h21.2l4.4 7.6a5 5 0 0 1-4.3 7.4H13.3A5 5 0 0 1 9 37.6z" fill="#2E8B57" stroke="#1B4763" stroke-width="2.4" stroke-linejoin="round" />
<circle cx="19" cy="37" r="2.4" fill="#CFF0DC" />
<circle cx="28" cy="41" r="1.8" fill="#CFF0DC" />
<path d="M17 4h14" stroke="#1B4763" stroke-width="3.4" stroke-linecap="round" />`,
	fisica: `<path d="M12 40V22a12 12 0 0 1 24 0v18" fill="none" stroke="#B03A2A" stroke-width="9" stroke-linecap="butt" />
<path d="M12 40V22a12 12 0 0 1 24 0v18" fill="none" stroke="#5E1E13" stroke-width="2.2" stroke-linecap="butt" />
<path d="M7.5 40h9M31.5 40h9" stroke="#8A929C" stroke-width="9" stroke-linecap="butt" />
<path d="M7.5 36.5h9v7h-9zM31.5 36.5h9v7h-9z" fill="none" stroke="#4A5058" stroke-width="2" />`,
	tecnologia: `<path d="M4 7h40v25H4z" fill="#DCE6F0" stroke="#2A3540" stroke-width="2.6" stroke-linejoin="round" />
<path d="M9 12h30v15H9z" fill="#3F5E86" />
<path d="M12 15h14M12 20h20" stroke="#CFE0F2" stroke-width="2.2" stroke-linecap="round" />
<path d="M21 32h6v6h-6z" fill="#8A929C" stroke="#2A3540" stroke-width="2.2" />
<path d="M13 41h22" stroke="#2A3540" stroke-width="3.4" stroke-linecap="round" />`,
};

/** El envoltorio: los dibujos están hechos para una caja de 48 × 48. */
export const CAJA_ICONO = 48;
