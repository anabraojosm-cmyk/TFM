const piezas = {
  "2345": {nombre:"Ventana 1", tipologia:"Ventana", materiales:"Cristal, aluminio", dimensiones:"3 metros", fecha:"Siglo XX", autor:"Bien institución"},
  "2346": {nombre:"Ventana 2", tipologia:"Ventana", materiales:"Cristal, aluminio", dimensiones:"3 metros", fecha:"Siglo XX", autor:"Bien institución"},
  "1089": {nombre:"Cuadro 1", tipologia:"Pintura", materiales:"Lienzo", dimensiones:"150 x 120 cm", fecha:"Siglo XVII", autor:"Zurbarán"},
  "1090": {nombre:"Cuadro 2", tipologia:"Pintura", materiales:"Lienzo", dimensiones:"140 x 100 cm", fecha:"Siglo XVII", autor:"Zurbarán"},
  "1086": {nombre:"Cuadro 3", tipologia:"Pintura", materiales:"Lienzo", dimensiones:"130 x 95 cm", fecha:"Siglo XVII", autor:"Zurbarán"},
  "1083": {nombre:"Cuadro 4", tipologia:"Pintura", materiales:"Lienzo", dimensiones:"120 x 90 cm", fecha:"Siglo XVII", autor:"Zurbarán"},
  "1465": {nombre:"Tapiz 1", tipologia:"Tapiz", materiales:"Textil", dimensiones:"3 metros", fecha:"Siglo XVIII", autor:"Bien institución"},
  "1726": {nombre:"Alfombra 1", tipologia:"Alfombra", materiales:"Lana", dimensiones:"4 metros", fecha:"Siglo XIX", autor:"Bien institución"},
  "1040": {nombre:"Cortina 1", tipologia:"Textil", materiales:"Tela", dimensiones:"3 metros", fecha:"Siglo XX", autor:"Bien institución"},
  "1041": {nombre:"Cortina 2", tipologia:"Textil", materiales:"Tela", dimensiones:"3 metros", fecha:"Siglo XX", autor:"Bien institución"},
  "0034": {nombre:"Radiador 1", tipologia:"Radiador", materiales:"Metal", dimensiones:"1 metro", fecha:"Siglo XX", autor:"Bien institución"},
  "1263": {nombre:"Escultura 1", tipologia:"Escultura", materiales:"Bronce", dimensiones:"80 cm", fecha:"Siglo XIX", autor:"Bien institución"},
  "1274": {nombre:"Escultura 2", tipologia:"Escultura", materiales:"Mármol", dimensiones:"90 cm", fecha:"Siglo XIX", autor:"Bien institución"},
  "2040": {nombre:"Librería 1", tipologia:"Mueble", materiales:"Madera", dimensiones:"2 metros", fecha:"Siglo XX", autor:"Bien institución"},
  "2041": {nombre:"Librería 2", tipologia:"Mueble", materiales:"Madera", dimensiones:"2 metros", fecha:"Siglo XX", autor:"Bien institución"},
  "1050": {nombre:"Silla 1", tipologia:"Mueble", materiales:"Madera", dimensiones:"1 metro", fecha:"Siglo XX", autor:"Bien institución"}
};

/* ELEMENTOS DOM */
const menuButton = document.getElementById("menuButton");
const menuPanel = document.getElementById("menuPanel");
const searchButton = document.getElementById("searchButton");
const codeInput = document.getElementById("codeInput");
const objectInfo = document.getElementById("objectInfo");

/* MENÚ DESPLEGABLE */
menuButton.addEventListener("click", function(event) {
  event.stopPropagation();
  menuPanel.classList.toggle("active");
});

/* CERRAR MENÚ SI SE HACE CLICK FUERA */
document.addEventListener("click", function(event) {
  if (!menuPanel.contains(event.target) && !menuButton.contains(event.target)) {
    menuPanel.classList.remove("active");
  }
});

/* FUNCIÓN BUSCADOR */
function buscarPieza() {
  const code = codeInput.value.trim();
  const pieza = piezas[code];

  if (pieza) {
    objectInfo.innerHTML = `
      <span><strong>Nombre:</strong> ${pieza.nombre}</span>
      <span><strong>Tipología:</strong> ${pieza.tipologia}</span>
      <span><strong>Material:</strong> ${pieza.materiales}</span>
      <span><strong>Dimensiones:</strong> ${pieza.dimensiones}</span>
      <span><strong>Fecha:</strong> ${pieza.fecha}</span>
      <span><strong>Autor:</strong> ${pieza.autor}</span>
    `;
  } else {
    objectInfo.innerHTML = `
      <span><strong>Código no encontrado</strong></span>`;
  }
}

/* BOTÓN BUSCAR */
searchButton.addEventListener("click", buscarPieza);

/* BÚSQUEDA CON ENTER */
codeInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") buscarPieza();
});

// Ruta al modelo dentro del repositorio
const MODEL_PATH = "models/salamaravillas.glb";

const container = document.getElementById("viewer");


// Crear mensaje de error (oculto al inicio)
const errorBox = document.createElement("div");
errorBox.style.position = "fixed";
errorBox.style.top = "20px";
errorBox.style.left = "20px";
errorBox.style.padding = "12px 18px";
errorBox.style.background = "rgba(0,0,0,0.85)";
errorBox.style.color = "white";
errorBox.style.fontFamily = "sans-serif";
errorBox.style.fontSize = "16px";
errorBox.style.borderRadius = "6px";
errorBox.style.zIndex = "9999";   // 🔥 Esto garantiza que se vea
errorBox.style.display = "none";
errorBox.innerText = "❌ No se pudo cargar el modelo 3D.";
document.body.appendChild(errorBox);

// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Cámara
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 3);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

// Luces
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(3, 5, 2);
scene.add(dir);

// Cargar GLB
const loader = new THREE.GLTFLoader();
loader.load(
  MODEL_PATH,
  (gltf) => {
    scene.add(gltf.scene);
  },
  undefined,
  (error) => {
    console.error("Error cargando GLB:", error);
    errorBox.style.display = "block"; // Mostrar mensaje
  }
);

// Animación
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Ajustar tamaño
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
