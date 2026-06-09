/*
 * Archivo: wa-link.ts
 * Ruta: src/lib/whatsapp/wa-link.ts
 * Creado: 2026-06-06
 * Descripción: Genera links de WhatsApp (wa.me) para CTAs del sitio tenant.
 *              No requiere API key — son links directos al chat.
 *
 * Para mensajes programáticos (API de WhatsApp Business), ver los Server Actions
 * que usan WHATSAPP_ACCESS_TOKEN (Fase 2).
 */

/**
 * Normaliza un número de teléfono argentino para usar en wa.me.
 * Agrega el código de país 54 si no lo tiene.
 * Elimina espacios, guiones y paréntesis.
 *
 * @param telefono - Número en cualquier formato (ej: "11 4444-1234", "15-1234-5678")
 * @returns Número limpio con código de país (ej: "5491144441234")
 */
function normalizarTelefono(telefono: string): string {
  // Quitar todo lo que no sea dígito
  const soloDigitos = telefono.replace(/\D/g, '')

  // Si ya empieza con 54, está bien
  if (soloDigitos.startsWith('54')) return soloDigitos

  // Celulares de CABA: 11 + 8 dígitos → 54 9 11 + 8 dígitos
  if (soloDigitos.startsWith('11') && soloDigitos.length === 10) {
    return `549${soloDigitos}`
  }

  // Otros números argentinos: agregar 54 adelante
  if (soloDigitos.length >= 8 && soloDigitos.length <= 12) {
    return `54${soloDigitos}`
  }

  // Número internacional o desconocido: devolver como está
  return soloDigitos
}

/**
 * Genera un link de WhatsApp (wa.me) con un mensaje pre-cargado.
 *
 * @param telefono - Número de la agencia (del campo whatsapp_number)
 * @param mensaje  - Texto del mensaje pre-escrito (se encodea automáticamente)
 * @returns URL de wa.me lista para usar en un <a href>
 */
export function generarLinkWhatsApp(telefono: string, mensaje?: string): string {
  const numero = normalizarTelefono(telefono)
  const base = `https://wa.me/${numero}`
  if (!mensaje) return base
  return `${base}?text=${encodeURIComponent(mensaje)}`
}

/**
 * Genera el mensaje pre-cargado para consultar sobre una propiedad.
 *
 * @param tituloPropiedad - Título de la propiedad
 * @param urlPropiedad    - URL completa de la propiedad (opcional, para que el agente la vea)
 */
export function mensajeConsultaPropiedad(
  tituloPropiedad: string,
  urlPropiedad?: string,
): string {
  const base = `Hola! Me interesa la propiedad: *${tituloPropiedad}*`
  if (urlPropiedad) {
    return `${base}\n${urlPropiedad}\n¿Podrían darme más información?`
  }
  return `${base}. ¿Podrían darme más información?`
}

/**
 * Genera el mensaje pre-cargado para solicitar una tasación.
 */
export function mensajeTasacion(): string {
  return 'Hola! Me gustaría solicitar una tasación de mi propiedad. ¿Podrían ayudarme?'
}

/**
 * Helper combinado: genera el link completo para consultar una propiedad.
 */
export function linkConsultaPropiedad(
  telefonoAgencia: string,
  tituloPropiedad: string,
  urlPropiedad?: string,
): string {
  return generarLinkWhatsApp(
    telefonoAgencia,
    mensajeConsultaPropiedad(tituloPropiedad, urlPropiedad),
  )
}
