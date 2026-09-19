const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output }); // esto es para leer desde la consola

let productos = [];
let pedidos = [];

async function mostrar_productos()
{
    console.log("Lista de productos disponibles:");
    for (let i = 0; i < productos.length; i++)
    {
        console.log(`${i + 1}. ${productos[i].nombre}: $${productos[i].precio}`);
    }
    console.log("\n");
}

async function crear_pedido()
{
    let pedidoActual = [];
    let seguirAgregando = true;
    do 
    {
        await mostrar_productos();

        let indiceProducto = Number(await rl.question("Elige el número del producto: ")) - 1;

        if (indiceProducto < 0 || indiceProducto >= productos.length)
        {
            console.error("Producto inválido");
            continue;
        }

        let cantidad = Number(await rl.question("¿Cuántos quieres? "));

        pedidoActual.push({
            nombre: productos[indiceProducto].nombre,
            precio: productos[indiceProducto].precio,
            cantidad: cantidad
        });

        let respuesta = await rl.question("¿Agregar otro producto? (s/n): ");
        seguirAgregando = respuesta.toLowerCase() === "s";

    } while (seguirAgregando);

    pedidos.push(pedidoActual);
    console.log("Pedido creado con éxito\n");
}

async function mostrar_pedidos()
{
    if (pedidos.length === 0)
    {
        console.log("No hay pedidos aún.");
    }
    else
    {
        for (let i = 0; i < pedidos.length; i++)
        {
            console.log(`Pedido ${i + 1}:`);
            for (let item of pedidos[i])
            {
                console.log(`  - ${item.nombre} x${item.cantidad}: $${item.precio * item.cantidad}`);
            }
        }
    }
}

async function cliente()
{
    let opcion = 0;
    do
    {
        console.log("Elige la opción deseada:");
        console.log("1. Consultar productos");
        console.log("2. Crear pedido");
        console.log("3. Mostrar pedidos actuales");
        console.log("4. Salir");
        opcion = Number(await rl.question("Elige la opción: "));
        console.log(`se detectó ${opcion}`);
        console.log("\n");
        switch (opcion)
        {
            case 1: // Consultar productos
                await mostrar_productos();
                break;
            case 2: // Crear pedido
                await crear_pedido();
                break;
            case 3: // Mostrar pedidos actuales
                await mostrar_pedidos();
                break;
            case 4: // salir
                break; // nada
            default:
                console.error("Opción inválida");
                break;
        }
    } while (opcion != 4);
}

async function main() 
{
    let producto_prueba = {
        nombre: "espagueti",
        precio: 100
    };
    productos.push(producto_prueba);
    let opcion = 0;
    do 
    {
        console.log("Escribe la opción deseada:");
        console.log("1. Caja");
        console.log("2. Cocina");
        console.log("3. Cliente");
        console.log("4. Salir");
        opcion = Number(await rl.question("Elige la opción: "));
        console.log(`se detectó ${opcion}`);
        console.log("\n");
        switch (opcion) 
        {
            case 1: // Caja
                break;
            case 2: // Cocina
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
