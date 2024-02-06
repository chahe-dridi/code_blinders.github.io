// Set up scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adjust the size of the boxes
const boxSize = 1.0; // Adjust the size of the box

// Create smaller square geometry
const squareGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);

// Load the texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('lk.png');

// Adjust texture mapping to eliminate artifacts
texture.wrapS = THREE.ClampToEdgeWrapping;
texture.wrapT = THREE.ClampToEdgeWrapping;
texture.minFilter = THREE.LinearFilter;

// Create material with the texture for the front, left, right, top, and bottom faces
const boxMaterial = new THREE.MeshBasicMaterial({ map: texture });

// Create a different material without a texture for the back face
const backMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue color

// Create an array of materials for each face of the textured box
const texturedMaterials = [
    boxMaterial, // Front face
    boxMaterial, // Back face
    boxMaterial, // Top face
    boxMaterial, // Bottom face
    boxMaterial, // Right face
    backMaterial, // Left face without texture
];

// Create a textured box mesh with the array of materials
const texturedBoxMesh = new THREE.Mesh(squareGeometry, texturedMaterials);

// Adjust the position of the textured box
texturedBoxMesh.position.x = -1; // Move to the left

// Add textured box mesh to the scene
scene.add(texturedBoxMesh);

// Create material without texture for the entire faces of the second box
const plainMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Red color

// Create an array of materials for each face of the plain box
const plainMaterials = [
    plainMaterial, // Front face
    plainMaterial, // Back face
    plainMaterial, // Top face
    plainMaterial, // Bottom face
    plainMaterial, // Right face
    plainMaterial, // Left face
];

// Create a plain box mesh with the array of materials
const plainBoxMesh = new THREE.Mesh(squareGeometry, plainMaterials);

// Adjust the position of the plain box
plainBoxMesh.position.x = 1; // Move to the right

// Add plain box mesh to the scene
scene.add(plainBoxMesh);

// Set camera position
camera.position.z = 5;

// Variables for smooth up and down motion
let time = 0;
const motionSpeed = 0.005;

// Variables for tilting the boxes
let tiltAngle = 0;
const tiltSpeed = 0.02;

// Render the scene
const animate = function () {
    requestAnimationFrame(animate);

    // Rotate the textured box around its own axis
    texturedBoxMesh.rotation.y += 0.01;

    // Rotate the plain box around its own axis
    plainBoxMesh.rotation.y -= 0.01;

    // Tilt the textured box up and down
    tiltAngle += tiltSpeed;
    texturedBoxMesh.rotation.x = Math.sin(tiltAngle) * 0.5; // Adjust the amplitude as needed

    // Tilt the plain box up and down
    plainBoxMesh.rotation.x = Math.sin(tiltAngle) * 0.5; // Adjust the amplitude as needed

    // Smooth up and down motion using a sine function for both boxes
    const upDownMotion = Math.sin(time) * 0.2; // Adjust the amplitude as needed
    texturedBoxMesh.position.y = upDownMotion;
    plainBoxMesh.position.y = upDownMotion;

    time += motionSpeed;

    renderer.render(scene, camera);
};

// Handle window resize
window.addEventListener("resize", () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});

animate();
