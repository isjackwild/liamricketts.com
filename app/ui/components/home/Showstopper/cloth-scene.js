import { Cloth, simulate, clothFunction, updateWind, xSegs, ySegs, restDistance } from './Cloth.js';
import _ from 'lodash';

let canvas, ctx, camera, renderer, scene, light, showStopper;
let raf, then, now, delta;
let width, height, aR;
const mouse = {
	x: 0,
	y: 0,
}
let mouseover = false;
let mouseleaveTimeout = null;
let clothGeometry, cloth;
const THREE = window.THREE;
let boxMesh;
const textureArray = window.innerWidth <= 768 ? window.site.showstopperMobile : window.site.showstopperDesktop;
const textureUrl = textureArray[Math.floor(Math.random() * textureArray.length)];

export const init = () => {
	if (!textureUrl) return;

	canvas = document.getElementsByClassName('showstopper__canvas')[0];
	showStopper = document.getElementsByClassName('showstopper')[0];
	window.addEventListener('resize', onResize);
	showStopper.addEventListener('mousemove', onMouseMove);
	showStopper.addEventListener('mouseleave', onMouseLeave);
	now = new Date().getTime();
	onResize();
	setupScene();
	setupCloth();
	setupRenderer();
	setCameraDistance();
	animate();
}

export const kill = () => {
	window.removeEventListener('resize', onResize);
	showStopper.removeEventListener('mousemove', onMouseMove);
	showStopper.removeEventListener('mouseleave', onMouseLeave);
	clearTimeout(mouseleaveTimeout);
	cancelAnimationFrame(raf);
}

const convertRange = ( value, r1, r2 ) => { 
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}

const onMouseMove = _.throttle((e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
	mouseover = true;
	clearTimeout(mouseleaveTimeout);
	mouseleaveTimeout = setTimeout(() => {
		mouseover = false;
	}, 11111);
}, 16.66, {leading: true},);

const onMouseLeave = () => {
	mouseover = false;
}

const onResize = () => {
	width = showStopper.clientWidth;
	height = showStopper.clientHeight;
	aR = width / height;

	if (renderer) renderer.setSize(width, height);
	if (camera) {
		setCameraDistance();
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}
}

const setupScene = () => {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
	setCameraDistance();

	scene.add(camera);


	// const groundMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true } );
	// const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
	// mesh.position.y = -250;
	// mesh.rotation.x = - Math.PI / 2;
	// scene.add( mesh );


	// const boxGeometry = new THREE.BoxGeometry( 10, 10, 10 );
 //    const boxMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
 //    boxMesh = new THREE.Mesh( boxGeometry, boxMaterial );
 //    scene.add( boxMesh );

 	light = new THREE.DirectionalLight( 0xdfebff, 0.5 );
	light.position.set( 50, 200, 100 );
	light.position.multiplyScalar( 1.3 );

	light.castShadow = true;

	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;

	var d = 300;

	light.shadow.camera.left = - d;
	light.shadow.camera.right = d;
	light.shadow.camera.top = d;
	light.shadow.camera.bottom = - d;

	light.shadow.camera.far = 1000;

	// scene.add( light );

	scene.add( new THREE.AmbientLight( 0xffffff ) );
}

const setCameraDistance = () => {
	if (!cloth) return;
	const fov = (camera.fov * (Math.PI / 180) );
	// const dist = Math.abs(cloth.width / Math.sin(fov/2));
	const dist = (cloth.width * restDistance) / 2 / Math.tan(Math.PI * camera.fov / 360);
	camera.position.z = dist / aR;
}

const setupCloth = () => {
	cloth = new Cloth(xSegs, ySegs);

	const onLoaded = () => {
		PubSub.publish('load.loaded');
	}
	const loader = new THREE.TextureLoader();
	PubSub.publish('load.add');
	const clothTexture = loader.load(textureUrl, onLoaded, null, onLoaded);
	clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
	clothTexture.repeat.y = -1;
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

	const multi = {
		x: convertRange(mouse.x, [0, width], [-1, 1]),
		y: convertRange(mouse.y, [0, height], [-1, 1]),
		mouseover,
	}

	updateWind(time, multi);

	cloth.simulate(time, clothGeometry.faces);

	cloth.particles.forEach((particle, i) => {
		clothGeometry.vertices[i].copy(particle.position);
	});
}

const render = () => {
	clothGeometry.computeFaceNormals();
	clothGeometry.computeVertexNormals();

	clothGeometry.normalsNeedUpdate = true;
	clothGeometry.verticesNeedUpdate = true;

	camera.lookAt(scene.position);

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