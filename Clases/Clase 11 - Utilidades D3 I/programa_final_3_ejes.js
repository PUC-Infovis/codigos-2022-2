// Creamos constantes para esta visualización.
const WIDTH = 800;
const HEIGHT = 400;
const MARGIN = {
  top: 70,
  bottom: 70,
  right: 30,
  left: 30,
};

const HEIGHTVIS = HEIGHT - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = WIDTH - MARGIN.right - MARGIN.left;

// Creamos un SVG en body junto con su tamaño ya definido.
const svg = d3.select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)

// Creamos un contenedor específico para agregar la visualización.
// El resto del espacio lo usaremos para incluir los ejes.
const contenedor = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left} ${MARGIN.top})`);


// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function joinDeDatos(datos) {

  // Obtenemos los rangos de los datos. En este caso solo necesitamos el máximo.
  const maximaFrecuencia = d3.max(datos, (d) => d.frecuencia);

  // Definimos una escala lineal para determinar la altura.
  // Mapea un número entre 0 y maximaFrecuencia a un rango entre 0 y (HEIGHT - los margenes)
  // Así nos aseguramos que el número mapeado esté en los rangos de nuestro contenedor.
  const escalaAltura = d3
    .scaleLinear()
    .domain([0, maximaFrecuencia])
    .range([0, HEIGHTVIS]);

  // Definimos una escala lineal para determinar la posición en el eje Y.
  // Mapea un número entre 0 y maximaFrecuencia a un rango entre (HEIGHT - los margenes) y 0.
  // Así nos aseguramos que el número mapeado esté en los rangos de nuestro contenedor.
  const escalaY = d3
    .scaleLinear()
    .domain([0, maximaFrecuencia])
    .range([HEIGHTVIS, 0]);

  // Creamos un eje izquierdo con D3 y le damos nuestra escala línea
  // para que sepa qué valores incluir en el eje.
  const ejeY = d3.axisLeft(escalaY);

  // Agregamos al SVG el eje. La función call se encarga de indicarle al
  // objeto ejeY a qué selección de la visualización debe vincular sus 
  // datos para agregar el eje.
  // Luego personalizamos las líneas del eje.
  svg
    .append("g")
    .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
    .call(ejeY)
    .selectAll("line")
    .attr("x1", WIDTHVIS)
    .attr("stroke-dasharray", "5")
    .attr("opacity", 0.5);

  // Definimos una escala de datos categóricos para determinar la posición en el eje X.
  // Esta escala genera una banda por cada cateoría. 
  // Esta escala determinará la posición y ancho de cada banda en función del dominio y rango.
  // Mapea cada categoría a una banda específica.
  const escalaX = d3
    .scaleBand()
    .domain(datos.map((d) => d.categoria))
    .rangeRound([0, WIDTHVIS])
    .padding(0.5);

  // Creamos un eje inferior con D3 y le damos nuestra escala línea
  // para que sepa qué valores incluir en el eje.
  const ejeX = d3.axisBottom(escalaX);

  // Agregamos al SVG el eje. La función call se encarga de indicarle al
  // objeto ejeX a qué selección de la visualización debe vincular sus 
  // datos para agregar el eje.
  // Luego personalizamos el texto de dicho eje.
  svg
    .append("g")
    .attr("transform", `translate(${MARGIN.left}, ${HEIGHTVIS + MARGIN.top})`)
    .call(ejeX)
    .selectAll("text")
    .attr("font-size", 20);

  // Vinculamos los datos con cada elemento rect con el comando join.
  const enter_and_update = contenedor
    .selectAll("rect")
    .data(datos)
    .join("rect")

  // Personalizamos según la información de los datos.
  // Usamos nuestras escalas para determinar las posiciones y altura de las barras.
  enter_and_update.attr("width", escalaX.bandwidth())
    .attr("fill", "orange")
    .attr("height", (d) => escalaAltura(d.frecuencia))
    .attr("x", (d) => escalaX(d.categoria))
    .attr("y", (d) => escalaY(d.frecuencia));
}

// Creamos una función que parsea los datos del csv al formato deseado.
const parseo = (d) => ({
  categoria: d.categoria,
  frecuencia: parseInt(d.frecuencia),
});

////////////////////////////////////////////
////                                    ////
////          CODIGO A EJECUTAR         ////
////                                    ////
////////////////////////////////////////////

function runCode(option) {
  if (option == 1) {
    // Opción 1: Cargamos el CSV y le indicamos que ocupe la función
    // parseo para procesar cada línea.
    // No olviden hacer python3 -m http.server para que esta opción funcione.
    d3.csv("datos_mate.csv", parseo)
      .then((datos) => {
        // Usamos .then para acceder a los datos ya cargados
        // y actualizamos el svg.
        console.log(datos);
        joinDeDatos(datos);
      })
      .catch((error) => console.log(error));
  }

  else if (option == 2) {
    // opción 2: Cargamos el json y aquí ya vienen los datos con 
    // el formato deseado, así que no necesitamos la función parseo.
    // No olviden hacer python3 -m http.server para que esta opción funcione.
    d3.json("datos_leng.json")
      .then((datos) => {
        console.log(datos);
        joinDeDatos(datos);
      })
      .catch((error) => console.log(error));
  }

  else if (option == 3) {
    // opción 3: Cargamos el json de internet.
    // Esta opción no requiere hacer python3 -m http.server.
    const BASE_URL = "https://gist.githubusercontent.com/Hernan4444/";
    const URL = BASE_URL + "7f34b01b0dc34fbc6ad8dd1e686b6875/raw/bfb874f18a545e0a33218b5fd345b97cbfa74e84/letter.json"
    d3.json(URL)
      .then((datos) => {
        console.log(datos);
        joinDeDatos(datos);
      })
      .catch((error) => console.log(error));
  }

  else if (option == 4) {
    // opción 4: usar los datos desde el mismo archivo JS
    // Esta opción no requiere hacer python3 -m http.server.
    const datos = [
      {
        "categoria": "Rojo",
        "frecuencia": 77
      },
      {
        "categoria": "Azul",
        "frecuencia": 108
      },
      {
        "categoria": "Verde",
        "frecuencia": 16
      },
    ]
    joinDeDatos(datos);
  }
}

const OPTION = 3;
runCode(OPTION);