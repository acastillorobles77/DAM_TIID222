const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output }); // esto es para leer desde la consola

let productos = [
    { nombre: "Café Americano", precio: 15, stock: 10, categoria: "Bebida" },
    { nombre: "Chocolate Caliente", precio: 18, stock: 3, categoria: "Bebida" },
    { nombre: "Té", precio: 12, stock: 5, categoria: "Bebida" },
    { nombre: "Agua de sabor", precio: 10, stock: 6, categoria: "Bebida" },
    { nombre: "Refresco", precio: 15, stock: 7, categoria: "Bebida" },
    { nombre: "Pan Dulce", precio: 10, stock: 14, categoria: "Postre" },
    { nombre: "Dona", precio: 12, stock: 20, categoria: "Postre" },
    { nombre: "Galletas", precio: 8, stock: 9, categoria: "Postre" },
    { nombre: "Sandwich", precio: 25, stock: 21, categoria: "Postre" },
    { nombre: "Torta", precio: 30, stock: 13, categoria: "Postre" },
    { nombre: "Papas fritas", precio: 15, stock: 10, categoria: "Postre" },
    { nombre: "Fruta picada", precio: 15, stock: 2, categoria: "Postre" },
    { nombre: "Yogurt", precio: 15, stock: 4, categoria: "Postre" },
    { nombre: "Gelatina", precio: 10, stock: 1, categoria: "Postre" }
];

let pedidos = [];

let totalAcumulado = 0;

function agregarProducto(nombre, precio) {
    productos.push({ nombre: nombre, precio: precio });
    console.log(nombre + " agregado al menú.");
}

function menuCaja() {
    console.log("\n===== CAJA =====");
    console.log("1. Ver productos");
    console.log("2. Agregar producto al pedido");
    console.log("3. Agregar nuevo producto al menú");
    console.log("4. Ver lista de pedidos y total acumulado");
    console.log("5. Salir");
}

async function caja() {
    let opcion = 0;
    do {
        menuCaja();
        opcion = await rl.question("Elige una opción: ");
        opcion = opcion.trim();

        if (opcion === "1") {
            mostrar_productos(true);

        } else if (opcion === "2") {
            mostrar_productos(false);
            let num = await rl.question("Número de producto: ");
            const index = parseInt(num) - 1;
            if (index >= 0 && index < productos.length) {
                await agregarPedido(index);
            } else {
                console.log("Producto no válido.");
            }

        } else if (opcion === "3") {
            let nombre = await rl.question("Nombre del nuevo producto: ");
            let precio = await rl.question("Precio: ");
            agregarProducto(nombre, parseFloat(precio));

        } else if (opcion === "4") {
            mostrar_pedidos();

        } else if (opcion === "5") {
            console.log("\nTotal final: $" + totalAcumulado);

        } else {
            console.log("Opción no válida.");
        }

    } while (opcion !== "5");
}

function mostrar_productos(mostrarAgotados) {
    console.log("Lista de productos disponibles:");
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].stock > 0) {
            console.log(`${i + 1}. ${productos[i].nombre}: $${productos[i].precio}. Stock disponible: ${productos[i].stock} unidades disponibles.`);
        }
        else if (mostrarAgotados) {
            console.log(`${i + 1}. ${productos[i].nombre}: $${productos[i].precio}. ** Producto agotado **`);
        }
    }
    mostrar_promociones();
    console.log("\n");
}

function mostrar_promociones() {
    let d = new Date();
    console.log(`hoy es ${d.getDay()}`);
    if (d.getDay() == 2) // mostrar Bebida los martes
    {
        let Bebida = productos.filter(producto => {
            return producto.categoria === "Bebida";
        });
        console.log("Los siguientes productos tienen descuento del 2x1:");
        Bebida.forEach(producto => {
            console.log(`Nombre: ${producto.nombre}, precio: $${producto.precio}`);
        });
    }
    else if (d.getDay() == 3) // mostrar Postre los miércoles
    {
        let Postre = productos.filter(producto => {
            return producto.categoria === "Postre";
        });
        console.log("Los siguientes productos tienen descuento del 2x1:");
        Postre.forEach(producto => {
            console.log(`Nombre: ${producto.nombre}, precio: $${producto.precio}`);
        });
    }
    else {
        console.log("El día de hoy no hay promociones.");
    }
}

function productoEnPromocion(index) {
    let d = new Date();
    return (productos[index].categoria === "Bebida" && d.getDay() == 2) || (productos[index].categoria === "Postre" && d.getDay() == 3);
}

async function agregarPedido() {
    let pedidoActual = [];
    let seguirAgregando = true;
    do {
        mostrar_productos(false);

        let indiceProducto = Number(await rl.question("Elige el número del producto: ")) - 1;

        if (indiceProducto < 0 || indiceProducto >= productos.length || productos[indiceProducto].stock <= 0) {
            console.error("Producto inválido");
            continue;
        }

        let cantidad = Number(await rl.question("¿Cuántos quieres? "));

        if (productoEnPromocion(indiceProducto)) {
            console.log("Este producto está en promoción al 2x1 el dia de hoy");
            cantidad *= 2;
        }

        pedidoActual.push({
            nombre: productos[indiceProducto].nombre,
            precio: productos[indiceProducto].precio,
            cantidad: cantidad
        });

        productos[indiceProducto].stock -= cantidad;

        let respuesta = await rl.question("¿Agregar otro producto? (s/n): ");
        seguirAgregando = respuesta.toLowerCase() === "s";

    } while (seguirAgregando);

    pedidos.push(pedidoActual);
    console.log("Pedido creado con éxito\n");
}

function mostrar_pedidos() {
    if (pedidos.length === 0) {
        console.log("No hay pedidos aún.");
    }
    else {
        for (let i = 0; i < pedidos.length; i++) {
            console.log(`Pedido ${i + 1}:`);
            for (let item of pedidos[i]) {

                console.log(`  - ${item.nombre} x${item.cantidad}: $${item.precio * item.cantidad}`);
            }
        }
    }
}

async function cocina() {
    let opcion = "";
    do {
        console.log("\n==== SISTEMA DE COCINA =====\n");
        console.log("1. Agregar producto");
        console.log("2. Mostrar productos");
        console.log("3. Editar producto");
        console.log("4. Eliminar producto");
        console.log("5. Salir");

        opcion = await rl.question("Seleccione una opción: ");
        console.log(`cocina: se detectó ${opcion}`);

        switch (opcion) {
            case "1":
                let nombre = await rl.question("Nombre del nuevo producto: ");
                let precio = await rl.question("Precio: ");
                let stock = await rl.question("");
                agregarProducto(nombre, parseFloat(precio));
                break;
            case "2":
                mostrar_productos(true);
                break;
            case "3":
                await editarProducto();
                break;
            case "4":
                await eliminarProducto();
                break;
            case "5":
                console.log("Saliendo del sistema...");
                break;
            default:
                console.log("Opción inválida. Intente de nuevo.");
                break;
        }
    } while (opcion !== "5");
}

async function editarProducto() {
    if (productos.length === 0) {
        console.log("\nNo hay productos para editar.\n");
        return;
    }

    console.log("\n===== EDITAR PRODUCTOS =====\n");
    mostrar_productos(true);

    let numero = await rl.question("\nIngresa el número del producto que quieres editar: ");
    let posicion = parseInt(numero) - 1;

    if (posicion >= 0 && posicion < productos.length) {
        let nombre = await rl.question("Ingrese el nuevo nombre del producto: ");
        let precio = await rl.question("Ingrese el nuevo precio del producto: ");
        let stock = await rl.question("Ingrese el nuevo stock del producto: ");
        productos[posicion].nombre = nombre;
        productos[posicion].precio = parseFloat(precio);
        productos[posicion].stock = Number(stock);

        console.log("\nProducto editado correctamente.\n");
    } else {
        console.log("\nNúmero de producto inválido.\n");
    }
}

async function eliminarProducto() {
    if (productos.length === 0) {
        console.log("\nNo hay productos para eliminar.\n");
        return;
    }

    console.log("\n===== ELIMINAR PRODUCTOS =====\n");
    for (let i = 0; i < productos.length; i++) {
        console.log((i + 1) + ". " + productos[i].nombre + " - $" + productos[i].precio);
    }

    let numero = await rl.question("\nIngresa el número del producto que quieres eliminar: ");
    let posicion = parseInt(numero) - 1;

    if (posicion >= 0 && posicion < productos.length) {
        productos.splice(posicion, 1);
        console.log("\nProducto eliminado correctamente.\n");
    } else {
        console.log("\nNúmero de producto inválido.\n");
    }
}

async function cliente() {
    let opcion = 0;
    do {
        console.log("Elige la opción deseada:");
        console.log("1. Consultar productos");
        console.log("2. Crear pedido");
        console.log("3. Mostrar pedidos actuales");
        console.log("4. Salir");
        opcion = Number(await rl.question("Elige la opción: "));
        console.log(`se detectó ${opcion}`);
        console.log("\n");
        switch (opcion) {
            case 1: // Consultar productos
                mostrar_productos(false);
                break;
            case 2: // Crear pedido
                await agregarPedido();
                break;
            case 3: // Mostrar pedidos actuales
                mostrar_pedidos();
                break;
            case 4: // salir
                break; // nada
            default:
                console.error("Opción inválida");
                break;
        }
    } while (opcion != 4);
}

async function main() {
    let opcion = 0;
    do {
        console.log("Escribe la opción deseada:");
        console.log("1. Caja");
        console.log("2. Cocina");
        console.log("3. Cliente");
        console.log("4. Salir");
        opcion = Number(await rl.question("Elige la opción: "));
        console.log(`se detectó ${opcion}`);
        console.log("\n");
        switch (opcion) {
            case 1: // Caja
                await caja();
                break;
            case 2: // Cocina
                await cocina();
                break;
            case 3: // Cliente
                await cliente();
                break;
            case 4: // salir
                break; // nada
            default:
                console.error("Opción inválida");
                break;
        }
    } while (opcion != 4);
    rl.close();
}

console.clear();

main();
