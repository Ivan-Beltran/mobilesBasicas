const LETTERS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]+$/
const ALNUM = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.,'#()-]+$/

// ---- Filtros en tiempo real (bloquean teclas inválidas) ----
export const onlyLetters = (v: string) => v.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]/g, "")
export const onlyDigits = (v: string) => v.replace(/\D/g, "")
export const onlyDecimal = (v: string) => {
    const clean = v.replace(/[^0-9.]/g, "")
    const [int, ...dec] = clean.split(".")
    return dec.length ? `${int}.${dec.join("").slice(0, 2)}` : int
}
export const skuFilter = (v: string) => v.toUpperCase().replace(/[^A-Z0-9-]/g, "")

// ---- Validadores (devuelven mensaje o null) ----
export const validateName = (v: string, label: string) => {
    const t = v.trim()
    if (!t) return `${label} es obligatorio`
    if (/\d/.test(t)) return `${label} no puede contener números`
    if (!LETTERS.test(t)) return `${label} solo admite letras`
    if (t.length < 2) return `${label} debe tener al menos 2 letras`
    return null
}
export const validateAlnum = (v: string, label: string) => {
    const t = v.trim()
    if (!t) return `${label} es obligatorio`
    if (t.length < 3) return `${label} debe tener al menos 3 caracteres`
    if (!ALNUM.test(t)) return `${label} contiene caracteres no permitidos`
    return null
}
export const validatePhone = (v: string) => {
    if (!v.trim()) return "El teléfono es obligatorio"
    if (!/^\d+$/.test(v)) return "El teléfono solo admite números"
    if (v.length !== 8) return "El teléfono debe tener 8 dígitos"
    return null
}
export const validateEmail = (v: string) => {
    if (!v.trim()) return "El correo es obligatorio"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return "Correo inválido (ej. nombre@correo.com)"
    return null
}
export const validatePassword = (v: string) => {
    if (!v) return "La contraseña es obligatoria"
    if (v.length < 8) return "Mínimo 8 caracteres"
    if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return "Debe incluir letras y números"
    return null
}
export const validateConfirm = (p: string, c: string) =>
    !c ? "Confirma la contraseña" : p !== c ? "Las contraseñas no coinciden" : null

export const validateNumber = (v: string, label: string, opts: { integer?: boolean; min?: number } = {}) => {
    if (!v.trim()) return `${label} es obligatorio`
    if (!/^\d+(\.\d{1,2})?$/.test(v)) return `${label} solo admite números`
    if (opts.integer && v.includes(".")) return `${label} debe ser un entero`
    if (opts.min !== undefined && Number(v) < opts.min) return `${label} debe ser mayor o igual a ${opts.min}`
    return null
}
export const validateDescription = (v: string) => {
    const t = v.trim()
    if (!t) return "La descripción es obligatoria"
    if (t.length < 10) return "La descripción debe tener al menos 10 caracteres"
    return null
}

// Muestra la alerta final con todos los errores
export const collectErrors = (errors: Record<string, string | null>) =>
    Object.fromEntries(Object.entries(errors).filter(([, m]) => m)) as Record<string, string>