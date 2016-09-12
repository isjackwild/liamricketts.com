let canvas, ctx, camera, renderer, scene, light, showStopper;
let raf, then, now, delta;
let width, height;
let clothGeometry;
let geometry, mesh, material;

const pins = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
const THREE = window.THREE;
let boxMesh;

export const init = () => {
	canvas = document.getElementsByClassName('showstopper__canvas')[0];
	showStopper = document.getElementsByClassName('showstopper');
	window.addEventListener('resize', onResize);
	onResize();
	setupScene();
    animate();
}

const setupScene = () => {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const options = {
		canvas: canvas,
	}

    renderer = new THREE.WebGLRenderer(options);
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log(window.innerWidth, window.innerHeight, width, height);

}

const onResize = () => {
	width = showStopper.clientWidth;
	height = showStopper.clientHeight;
}

const animate = () => {

    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render(scene, camera);

}