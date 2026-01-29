// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe5e5e5);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  document.querySelector(".map-area").clientWidth /
    document.querySelector(".map-area").clientHeight,
  0.1,
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("map3d"),
  antialias: true
});

// Orbit Controls (DRAG & ZOOM)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = true;
controls.enableZoom = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 3.0; // pwede 0.5 – 3

renderer.setSize(
  document.querySelector(".map-area").clientWidth,
  document.querySelector(".map-area").clientHeight
);

// Camera position
camera.position.set(0, 15, 30);
camera.lookAt(0, 0, 0);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));

// Load 3D Model
const loader = new THREE.GLTFLoader();
loader.load(
  "models/campus_map.glb",
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    // 🔲 Compute model size
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    // 🎥 Move camera to fit model
    camera.position.copy(center);
    camera.position.x += size * 0.3;
    camera.position.y += size * 0.6;
    camera.position.z += size * 0.3;

    camera.lookAt(center);

    // 🎮 OrbitControls target
    controls.target.copy(center);
    controls.update();
  },
  undefined,
  function (error) {
    console.error("Error loading model:", error);
  }
);

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Resize fix
window.addEventListener("resize", () => {
  const width = document.querySelector(".map-area").clientWidth;
  const height = document.querySelector(".map-area").clientHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});