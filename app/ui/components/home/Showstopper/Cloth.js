export const restDistance = 100;
export const xSegs = window.innerWidth <= 768 ? 10 : 20;
export const ySegs = window.innerWidth <= 768 ? 20 : 10;

const MASS = 0.08;
const THREE = window.THREE;

const pins = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ];


const TIMESTEP = 18 / 1000;
const TIMESTEP_SQ = TIMESTEP * TIMESTEP;

let windStrength = 2;
const windForce = new THREE.Vector3( 0, 0, 0 );

const DAMPING = 0.03;
const DRAG = 1 - DAMPING;

const GRAVITY = 600;
const gravity = new THREE.Vector3( 0, - GRAVITY, 0 ).multiplyScalar( MASS );

export const updateWind = (time) => {
	windStrength = Math.cos( time / 2000 ) * 5 + 8;
	windForce.set( Math.sin( time / 2000 ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) ).normalize().multiplyScalar( windStrength );
}


const plane = (width, height) => {
	return ( u, v ) => {
		var x = ( u - 0.5 ) * width;
		var y = ( v + 0.5 ) * height;
		var z = 0;
		return new THREE.Vector3( x, y, z );
	};
}
export const clothFunction = plane( restDistance * xSegs, restDistance * ySegs );

const diff = new THREE.Vector3();
const satisifyConstraints = ( p1, p2, distance ) => {
	diff.subVectors( p2.position, p1.position );
	const currentDist = diff.length();
	if ( currentDist === 0 ) return; // prevents division by 0
	const correction = diff.multiplyScalar( 1 - distance / currentDist );
	const correctionHalf = correction.multiplyScalar( 0.5 );
	p1.position.add( correctionHalf );
	p2.position.sub( correctionHalf );
}

class Particle {
	constructor(x, y, z, mass) {
		this.position = clothFunction( x, y );
		this.previous = clothFunction( x, y );
		this.original = clothFunction( x, y );
		this.a = new THREE.Vector3( 0, 0, 0 );
		this.mass = mass;
		this.invMass = 1 / mass;
		this.tmp = new THREE.Vector3();
		this.tmp2 = new THREE.Vector3();
	}

	addForce(force) {
		this.a.add(
			this.tmp2.copy( force ).multiplyScalar( this.invMass )
		);
	}

	integrate(timesq) {
		const newPos = this.tmp.subVectors( this.position, this.previous );
		newPos.multiplyScalar( DRAG ).add( this.position );
		newPos.add( this.a.multiplyScalar( timesq ) );

		this.tmp = this.previous;
		this.previous = this.position;
		this.position = newPos;

		this.a.set( 0, 0, 0 );
	}
}


export class Cloth {
	constructor(width = xSegs, height = ySegs) {
		console.log(width, height);
		this.width = width;
		this.height = height;
		this.tmpForce = new THREE.Vector3();

		const particles = [];
		const constraints = [];
		let u, v;

		for ( v = 0; v <= height; v ++ ) {
			for ( u = 0; u <= width; u ++ ) {
				particles.push(
					new Particle( u / width, (v / height) * -1, 0, MASS )
				);
			}
		}

		for ( v = 0; v < height; v ++ ) {
			for ( u = 0; u < width; u ++ ) {
				constraints.push( [
					particles[ index( u, v ) ],
					particles[ index( u, v + 1 ) ],
					restDistance
				] );

				constraints.push( [
					particles[ index( u, v ) ],
					particles[ index( u + 1, v ) ],
					restDistance
				] );
			}
		}

		for ( u = width, v = 0; v < height; v ++ ) {
			constraints.push( [
				particles[ index( u, v ) ],
				particles[ index( u, v + 1 ) ],
				restDistance
			] );
		}

		for ( v = height, u = 0; u < width; u ++ ) {
			constraints.push( [
				particles[ index( u, v ) ],
				particles[ index( u + 1, v ) ],
				restDistance
			] );
		}

		this.particles = particles;
		this.constraints = constraints;

		function index( u, v ) {
			return u + v * ( width + 1 );
		}

		this.index = index;
	}

	simulate(time, faces) {
		faces.forEach((face) => {
			const normal = face.normal;
			this.tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(windForce));
			this.particles[face.a].addForce(this.tmpForce);
			this.particles[face.b].addForce(this.tmpForce);
			this.particles[face.c].addForce(this.tmpForce);
		});

		this.particles.forEach((particle) => {
			particle.addForce(gravity);
			particle.integrate(TIMESTEP_SQ);
		});

		this.constraints.forEach((constraint) => {
			satisifyConstraints(constraint[0], constraint[1], constraint[2])
		});

		pins.forEach((xy) => {
			const p = this.particles[xy];
			p.position.copy(p.original);
			p.previous.copy(p.original);
		});
	}
}