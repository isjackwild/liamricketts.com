import { Cloth, simulate, clothFunction } from './Cloth.js';

let canvas, ctx, camera, renderer, scene, light, showStopper;
let raf, then, now, delta;
let width, height;
let clothGeometry, cloth;
const pins = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
const THREE = window.THREE;
let boxMesh;

export const init = () => {
	canvas = document.getElementsByClassName('showstopper__canvas')[0];
	showStopper = document.getElementsByClassName('showstopper')[0];
	window.addEventListener('resize', onResize);
	now = new Date().getTime();
	onResize();
	setupScene();
	setupCloth();
	setupRenderer();
	animate();
}

export const kill = () => {
	window.removeEventListener('resize', onResize);
	cancelAnimationFrame(raf);
}

const onResize = () => {
	width = showStopper.clientWidth;
	height = showStopper.clientHeight;

	if (renderer) renderer.setSize(width, height);
	if (camera) {
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}
}

const setupScene = () => {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
	camera.position.z = 400;

	// scene.add(camera);


	const groundMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true } );
	const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
	mesh.position.y = -250;
	mesh.rotation.x = - Math.PI / 2;
	scene.add( mesh );


	const boxGeometry = new THREE.BoxGeometry( 200, 200, 200 );
    const boxMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    boxMesh = new THREE.Mesh( boxGeometry, boxMaterial );
    scene.add( boxMesh );


	scene.add( new THREE.AmbientLight( 0xffffff ) );
}

const setupCloth = () => {
	cloth = new Cloth(16, 9)

	const loader = new THREE.TextureLoader();
	const clothTexture = loader.load( 'assets/198A3542-2000x1339.jpg' );
	clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
	clothTexture.anisotropy = 16;

	const clothMaterial = new THREE.MeshPhongMaterial( {
		specular: 0x030303,
		map: clothTexture,
		side: THREE.DoubleSide,
		alphaTest: 0.5
	} );

	// cloth geometry
	clothGeometry = new THREE.ParametricGeometry( clothFunction, cloth.width, cloth.height );
	clothGeometry.dynamic = true;

	const uniforms = { texture:  { value: clothTexture } };
	const vertexShader = document.getElementById( 'vertexShaderDepth' ).textContent;
	const fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;

	// cloth mesh
	const object = new THREE.Mesh( clothGeometry, clothMaterial );
	object.position.set( 0, 0, 0 );
	object.castShadow = true;
	scene.add( object );

	object.customDepthMaterial = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		side: THREE.DoubleSide
	});
}

const setupRenderer = () => {
	const options = {
		anitalias: true,
		canvas: canvas,
	}

	renderer = new THREE.WebGLRenderer(options);
	renderer.setClearColor( 0xFFD002 );
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(width, height);
}

const update = (delta) => {
	const time = Date.now();

	cloth.simulate(time, clothGeometry.faces);

	cloth.particles.forEach((particle, i) => {
		clothGeometry.vertices[i].copy(particle.position);
	});

	boxMesh.rotation.x += 0.01;
	boxMesh.rotation.y += 0.02;
}

const render = () => {
	clothGeometry.computeFaceNormals();
	clothGeometry.computeVertexNormals();

	clothGeometry.normalsNeedUpdate = true;
	clothGeometry.verticesNeedUpdate = true;

	renderer.render(scene, camera);
}

const animate = () => {
	then = now ? now : null;
	now = new Date().getTime();
	delta = then ? (now - then) / 16.666 : 1;

	update(delta);
	render();
	raf = requestAnimationFrame(animate);
}