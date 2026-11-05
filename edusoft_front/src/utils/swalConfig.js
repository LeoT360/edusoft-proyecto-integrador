/**
 * mostrarAlerta — envoltura de SweetAlert2 que aplica los colores del tema claro u oscuro.
 * Acepta las mismas opciones que Swal.fire y permite sobrescribirlas.
 */
import Swal from 'sweetalert2';

export const mostrarAlerta = (config = {}) => {
  const esDark = document.body.classList.contains('dark');

  return Swal.fire({
    confirmButtonColor: esDark ? '#60a5fa' : '#1d4ed8',
    cancelButtonColor: esDark ? '#64748b' : '#94a3b8',
    background: esDark ? '#1e293b' : '#ffffff',
    color: esDark ? '#e2e8f0' : '#172033',
    iconColor: config.icon === 'error'
      ? (esDark ? '#f87171' : '#dc2626')
      : config.icon === 'success'
        ? (esDark ? '#4ade80' : '#16a34a')
        : undefined,
    ...config,
    customClass: {
      popup: esDark ? 'swal2-dark-popup' : '',
      ...(config.customClass || {}),
    },
  });
};
