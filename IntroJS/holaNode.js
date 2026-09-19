console.log("Hola node.js");

let edad1 = 20;
let edad2 = 11;

console.log(`La edad promedio es: ${ (edad1 + edad2) / 2 }`);

/* Medir tiempo de un proceso */
console.time("miProceso");
for (let i = 0; i < 100000000; i++)
{
    // nada
}
console.timeEnd("miProceso");
