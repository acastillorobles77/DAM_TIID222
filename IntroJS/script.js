let nombre = prompt("¿Cuál es tu nombre?");
if (nombre != "") 
{
    console.log("Hola " + nombre + "!!");
    document.write("<h1>Hola: " + nombre + "</h1>");
}
else 
{
    console.error("Nombre en blanco");
    document.write("<h1>Error: Nombre en blanco</h1>");
}