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

function agregarProducto(nombre, precio, categoria, stock = 10) {
    productos.push({ nombre: nombre, precio: precio, categoria: categoria, stock: stock });
    console.log(`${nombre} agregado al menú.`);
}

function menuCaja() {
    console.log("\n===== CAJA =====");
    console.log("1. Ver productos");
    console.log("2. Agregar o modificar producto de un pedido");
    console.log("3. Agregar nuevo producto al menú");
    console.log("4. Ver lista de pedidos");
    console.log("5. Cobrar y ver total (Subtotal, IVA y Total)");
    console.log("6. Notificar estado del pedido (Callbacks)");
    console.log("7. Salir");
}

function calcularCuentaCaja() {
    if (pedidos.length === 0) {
        console.log("\nNo hay productos en el pedido actual.");
        return;
    }

    const listaItems = pedidos.flat();

    const subtotal = listaItems.reduce((suma, item) => {
        const { precio, cantidad = 1 } = item;
        return suma + (precio * cantidad);
    }, 0);

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    console.log("\n====== DESGLOSE DE CUENTA ======");
    console.log(`Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`IVA(16 %): $${iva.toFixed(2)}`);
    console.log(`Total a pagar: $${total.toFixed(2)}`);
    console.log("=================================");
}

function notificarListo(numPedido) {
    console.log(`\nEl pedido #${numPedido} está LISTO.\n`);
}

function notificarCancelado(numPedido) {
    console.log(`\nEl pedido #${numPedido} ha sido CANCELADO.\n`);
}

async function cambiarEstadoPedido(callbackListo, callbackCancelado) {
    let numPedido = await rl.question("Número del pedido: ");
    let index = parseInt(numPedido) - 1;

    if (index >= 0 && index < pedidos.length) {
        console.log("1. Pedido listo");
        console.log("2. Pedido cancelado");
        let opcion = await rl.question("Elige el estado: ");

        if (opcion === "1") {
            callbackListo(numPedido);
        } else if (opcion === "2") {
            callbackCancelado(numPedido);
        } else {
            console.log("Opción no válida.");
        }
    } else {
        console.log("Pedido no encontrado.");
    }
}

async function caja() {
    let opcion = "";
    do {
        menuCaja();
        opcion = await rl.question("Elige una opción: ");
        opcion = opcion.trim();

        if (opcion === "1") {
            mostrar_productos(true);

        } else if (opcion === "2") {
            if (pedidos.length > 0) {
                console.log(`Actualmente hay ${pedidos.length} pedidos.`);
                let indexPedido = Number(await rl.question("Escribe el número del pedido a modificar (0 para nuevo): ")) - 1;
                if (indexPedido >= 0 && indexPedido < pedidos.length) {
                    await agregarPedido(indexPedido);
                } else {
                    await agregarPedido();
                }
            } else {
                await agregarPedido();
            }

        } else if (opcion === "3") {
            let nombre = await rl.question("Nombre del nuevo producto: ");
            let precio = await rl.question("Precio: ");
            let categoria = await rl.question("Escribe la categoría del producto (Bebida, Postre): ");
            let stock = await rl.question("Stock inicial: ");
            agregarProducto(nombre, parseFloat(precio), categoria, Number(stock));

        } else if (opcion === "4") {
            mostrar_pedidos();

        } else if (opcion === "5") {
            calcularCuentaCaja();

        } else if (opcion === "6") {
            await cambiarEstadoPedido(notificarListo, notificarCancelado);

        } else if (opcion === "7") {
            console.log("Saliendo de caja...");

        } else {
            console.log("Opción no válida.");
        }

    } while (opcion !== "7");
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

async function agregarPedido(num = -1) {
    let pedidoActual = [];
    if (num >= 0) {
        pedidoActual = pedidos[num].productos;;
    }
    let seguirAgregando = true;
    do {
        mostrar_productos(false);

        let indiceProducto = Number(await rl.question("Elige el número del producto: ")) - 1;

        if (indiceProducto < 0 || indiceProducto >= productos.length || productos[indiceProducto].stock <= 0) {
            console.error("Producto inválido");
            continue;
        }

        let cantidad = Number(await rl.question("¿Cuántos quieres? "));

        if (cantidad > productos[indiceProducto].stock) {
            console.log(`No hay suficiente stock. Solo quedan ${productos[indiceProducto].stock}`);
            continue;
        }

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

    if (num < 0) {
        pedidos.push({
            productos: pedidoActual, estado: "Pendiente"
        });
        console.log("Pedido creado con éxito\n");
    }
    else {
        pedidos[num].productos = pedidoActual;
        pedidos[num].estado = "Pendiente";

        console.log("El pedido ha sido actualizado exitosamente\n");
    }
}

function mostrar_pedidos() {
    if (pedidos.length === 0) {
        console.log("No hay pedidos aún.");
    }
    else {
        for (let i = 0; i < pedidos.length; i++) {
            console.log(`Pedido ${i + 1}:`);
            for (let item of pedidos[i].productos) {

                console.log(`  - ${item.nombre} x${item.cantidad}: $${item.precio * item.cantidad}`);
            }
            console.log("Estado: " + pedidos[i].estado + "\n");
        }
    }
}

// función para buscar productos
async function buscarProducto() {
    let opcionn = "";
    do {
        console.log("==== BUSCAR PRODUCTOS ====")
        console.log("1. Productos caros")
        console.log("2. Productos baratos")
        console.log("3. Bebidas")
        console.log("4. Postres")
        console.log("5. Regresar al menu")

        opcionn = await rl.question("Seleccione una opcion: ");
        switch (opcionn) {
            case "1":
                let productosCaros = productos.filter(producto => producto.precio > 20);
                console.log("Productos caros:");
                productosCaros.forEach(producto => {
                    console.log(producto.nombre + " - $" + producto.precio);
                });
                break;
            case "2":
                let productosBaratos = productos.filter(producto => producto.precio <= 20);
                console.log("Productos baratos:");
                productosBaratos.forEach(producto => {
                    console.log(producto.nombre + " - $" + producto.precio);
                });
                break;
            case "3":
                let bebidas = productos.filter(producto => producto.categoria === "Bebida");
                console.log("Bebidas:");
                bebidas.forEach(producto => {
                    console.log(producto.nombre + " - $" + producto.precio);
                });
                break;
            case "4":
                let postres = productos.filter(producto => producto.categoria === "Postre");
                console.log("Postres:");
                postres.forEach(producto => {
                    console.log(producto.nombre + " - $" + producto.precio);
                });
                break;
            case "5": // regresar al menú
                break;
            default:
                console.log("Opcion invalida");
                break;
        }
    } while (opcionn !== "5");
}

function realizarPedido(pedido) {
    return new Promise((resolve, reject) => {
        console.log("==== COCINA ====");
        console.log("Pedido recibido:");

        for (let item of pedido.productos) {
            console.log(`- ${item.nombre} x${item.cantidad}`);
        }

        console.log("\nPeparando pedido...");
        console.log("Espere unos segundos...\n");

        setTimeout(() => {
            let resultado = Math.random();

            if (resultado < 0.7) {
                resolve("Pedido realizado.");
            } else {
                reject("Error en la cocina. Falta un ingrediente.")
            }
        }, 3000);
    });
}

async function procesarPedido() {
    if (pedidos.length === 0) {
        console.log("\nNo hay pedidos pendientes");
        return;
    }

    console.log("\n==== PEDIDOS ====");
    for (let i = 0; i < pedidos.length; i++) {
        console.log("\npedido " + (i + 1));

        for (let item of pedidos[i].productos) {
            console.log(`- ${item.nombre} x${item.cantidad}`);
        }
        console.log("Estado: " + pedidos[i].estado);
    }

    let numero = await rl.question("\nSeleccione el numero del pedido que desea realizar: ");

    let indice = Number(numero) - 1;

    if (indice < 0 || indice >= pedidos.length) {

        console.log("Número de pedido inválido.");
        return;

    }

    if (pedidos[indice].estado !== "Pendiente") {

        console.log(
            `Este pedido ya tiene el estado: ${pedidos[indice].estado}`
        );

        return;
    }

    try {

        console.log("\nProcesando pedido...");

        await realizarPedido(pedidos[indice]);



        pedidos[indice].estado = "Realizado";

        console.log(
            "\n El pedido se realizó correctamente."
        );


    } catch (error) {


        pedidos[indice].estado = "Fallido";

        console.log(
            `\n ${error}`
        );

    }
}

async function cocina() {
    let opcion = "";
    do {
        console.log("\n==== SISTEMA DE COCINA =====\n")
        console.log("1. Agregar producto");
        console.log("2. Mostrar productos");
        console.log("3. Editar producto");
        console.log("4. Buscar producto")
        console.log("5. Eliminar producto");
        console.log("6. Ver pedidos");
        console.log("7. Realizar pedidos")
        console.log("8. Salir");

        opcion = await rl.question("Seleccione una opción: ");
        console.log(`cocina: se detectó ${opcion}`);

        switch (opcion) {

            case "1":
                let nombre = await rl.question("Nombre del nuevo producto: ");
                let precio = await rl.question("Precio: ");
                let categoria = await rl.question("Escribe la categoría del producto (Bebida, Postre): ");
                let stock = await rl.question("Stock inicial: ");
                agregarProducto(nombre, parseFloat(precio), categoria, Number(stock));
                break;
            case "2":
                mostrar_productos();
                break;
            case "3":
                await editarProducto();
                break;
            case "4":
                await buscarProducto();
                break;
            case "5":
                await eliminarProducto();
                break;
            case "6":
                mostrar_pedidos();
                break;
            case "7":
                await procesarPedido();
                break;
            case "8":
                console.log("Saliendo del sistema...");
                break;
            default:
                console.log("Opción inválida. Intente de nuevo.");
                break;
        }
    } while (opcion !== "8");
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
        let categoria = await rl.question("Ingrese la categoría del producto (Bebida, Postre): ");
        productos[posicion].nombre = nombre;
        productos[posicion].precio = parseFloat(precio);
        productos[posicion].stock = Number(stock);
        productos[posicion].stock = categoria;

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
    console.clear();
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

main();
