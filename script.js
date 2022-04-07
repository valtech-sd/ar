const parameters = {
  materialColor: '#ffeded',
};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// textures
const TextureLoader = new THREE.TextureLoader();
const vfsTexture = TextureLoader.load('assets/images/vfs.png');
const spaceTexture = TextureLoader.load('assets/images/space.jpg');

// objects
// material
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff9f,
  wireframe: true,
});

// meshes

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  material
);

const logo = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1.5, 2, 5, 5, 5),
  new THREE.MeshBasicMaterial({
    map: vfsTexture,
  })
);

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 1.5, 1.5, 5, 5, 5),
  material
);

const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 0.5, 1.5, 32),
  material
);

const triangle = new THREE.Mesh(
  new THREE.RingGeometry(1, 1.5, 3),
  material
)

const objectsDistance = 4;
logo.position.y = -objectsDistance * 0;
torus.position.y = -objectsDistance * 1;
torusKnot.position.y = -objectsDistance * 2;
box.position.y = -objectsDistance * 4;
cylinder.position.y = -objectsDistance * 5;
triangle.position.y = -objectsDistance * 6;

logo.position.x = 2;
torus.position.x = -2;
torusKnot.position.x = 2;
box.position.x = 2;
cylinder.position.x = -2;
triangle.position.x = 2;

scene.add(torus, logo, torusKnot, box, cylinder, triangle);

const sectionMeshes = [torus, torusKnot, box, cylinder, triangle];

// stars
const starGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const starMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  size: 0.3,
  sizeAttenuation: true,
});

function addStar() {
  const star = new THREE.Mesh(starGeometry, starMaterial);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(300));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(600).fill().forEach(addStar);
// scene.background = spaceTexture

// lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// scroll
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / sizes.height);

  if (newSection != currentSection) {
    currentSection = newSection;
  }
});

// cursor
const cursor = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
  cursor.x = (event.clientX / sizes.width) * 2 - 1;
  cursor.y = -(event.clientY / sizes.height) * 2 + 1;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

function animate() {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // animate camera
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  const parallaxX = -cursor.x;
  const parallaxY = -cursor.y;
  cameraGroup.position.x +=
    (-parallaxX - cameraGroup.position.x) * 3 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 3 * deltaTime;

  // animate meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.3;
    mesh.rotation.y += deltaTime * 0.12;
  }

  // animate box logo
  logo.rotation.y += deltaTime * 0.3;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  requestAnimationFrame(animate);
}

animate();
