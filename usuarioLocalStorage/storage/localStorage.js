const obtenerAlmacenamiento = () => {
    if (!window.localStorage) {
        throw new Error("LocalStorage no funciona en este navegador.");
    }
    return window.localStorage;
};

export const guardarDatos = async (clave, valor) => {
    const almacenamiento = obtenerAlmacenamiento();
    almacenamiento.setItem(clave, JSON.stringify(valor));
};

export const obtenerDatos = async (clave, valorPorDefecto = null) => {
    const almacenamiento = obtenerAlmacenamiento();
    const texto = almacenamiento.getItem(clave);
    if (texto === null) return valorPorDefecto;
    try {
        return JSON.parse(texto);
    } catch (error) {
        console.warn(`Dato corrupto en la clave "${clave}"`, error);
        return valorPorDefecto;
    }
};

export const eliminarDatos = async (clave) => {
    const almacenamiento = obtenerAlmacenamiento();
    almacenamiento.removeItem(clave);
};
