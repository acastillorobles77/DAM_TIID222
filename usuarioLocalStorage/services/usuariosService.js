// validaciones aquí

import { guardarDatos, obtenerDatos } from '../storage/localStorage';

const CLAVE_USUARIOS = 'usuarios';
const EDAD_MINIMA = 1;
const EDAD_MAXIMA = 120;
const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;

export const validarUsuario = (nombre, edad) => {
    const errores = {};

    const nombreLimpio = String(nombre ?? '').trim();
    if (!nombreLimpio) {
        errores.nombre = 'El nombre es obligatorio.';
    } else if (nombreLimpio.length < 3) {
        errores.nombre = 'El nombre debe tener al menos 3 caracteres.';
    } else if (!SOLO_LETRAS.test(nombreLimpio)) {
        errores.nombre = 'El nombre solo puede contener letras y espacios.';
    }

    const edadTexto = String(edad ?? '').trim();
    if (!edadTexto) {
        errores.edad = 'La edad es obligatoria.';
    } else if (!/^\d+$/.test(edadTexto)) {
        errores.edad = 'La edad debe ser un número entero.';
    } else {
        const edadNumero = Number(edadTexto);
        if (edadNumero < EDAD_MINIMA || edadNumero > EDAD_MAXIMA) {
            errores.edad = `La edad debe estar entre ${EDAD_MINIMA} y ${EDAD_MAXIMA}.`;
        }
    }

    return { valido: Object.keys(errores).length === 0, errores };
};

const nombreDuplicado = (usuarios, nombre, idIgnorado = null) =>
    usuarios.some(
        (u) =>
            u.id !== idIgnorado &&
            u.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
    );

export const obtenerUsuarios = async () => {
    return await obtenerDatos(CLAVE_USUARIOS, []);
};

export const obtenerUsuarioPorId = async (id) => {
    const usuarios = await obtenerUsuarios();
    return usuarios.find((u) => u.id === String(id)) ?? null;
};

export const agregarUsuario = async (nombre, edad) => {
    const { valido, errores } = validarUsuario(nombre, edad);
    if (!valido) return { ok: false, errores };

    const usuarios = await obtenerUsuarios();
    if (nombreDuplicado(usuarios, nombre)) {
        return { ok: false, errores: { nombre: 'Ya existe un usuario con ese nombre.' } };
    }

    const nuevo = {
        id: Date.now().toString(),
        nombre: nombre.trim(),
        edad: Number(edad),
    };
    await guardarDatos(CLAVE_USUARIOS, [...usuarios, nuevo]);
    return { ok: true, usuario: nuevo };
};

export const actualizarUsuario = async (id, nombre, edad) => {
    const { valido, errores } = validarUsuario(nombre, edad);
    if (!valido) return { ok: false, errores };

    const usuarios = await obtenerUsuarios();
    const existe = usuarios.some((u) => u.id === String(id));
    if (!existe) return { ok: false, errores: { general: 'El usuario ya no existe.' } };

    if (nombreDuplicado(usuarios, nombre, String(id))) {
        return { ok: false, errores: { nombre: 'Ya existe un usuario con ese nombre.' } };
    }

    const actualizados = usuarios.map((u) =>
        u.id === String(id) ? { ...u, nombre: nombre.trim(), edad: Number(edad) } : u
    );
    await guardarDatos(CLAVE_USUARIOS, actualizados);
    return { ok: true };
};

export const eliminarUsuario = async (id) => {
    const usuarios = await obtenerUsuarios();
    const restantes = usuarios.filter((u) => u.id !== String(id));
    await guardarDatos(CLAVE_USUARIOS, restantes);
    return { ok: restantes.length !== usuarios.length };
};
