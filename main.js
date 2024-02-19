import * as THREE from './node_modules/three/build/three.module.js';
import * as CANNON from './node_modules/cannon-es/dist/cannon-es.js';
import { buildWorld } from './pinboard.js'

import { calculatePlinkoPosition } from './pinboardPhysics.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75,  1280/720, 0.1, 1000 );
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


const renderer = new THREE.WebGLRenderer();

// renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setSize( 1280 , 720 );
document.body.appendChild( renderer.domElement );

const puckGeometry = new THREE.SphereGeometry( 0.5 );
const puckMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});

const puck = new THREE.Mesh(puckGeometry, puckMaterial);

scene.add(puck);

function startGame(){
    // getStartingValue();
    // console.log(getStartingValue());
   
    if(getStartingValue() <= 49){
        sphereBody.angularVelocity.set(0, 0 ,0.1);
    }else{
        sphereBody.angularVelocity.set(0 , 0 ,-0.1);
    }
}

document.getElementById('startGame').addEventListener('click', startGame, false);


function getStartingValue(){
    return Math.floor(Math.random() * 100);
}

camera.position.z = 30;

const physicsWorld = new CANNON.World({
    // gravity: new CANNON.Vec3(0, -1, 0),
    gravity: new CANNON.Vec3(0, -9.81, 0),
});
let puckMass = 1;

const sphereBody = new CANNON.Body({
    mass: puckMass,
    shape: new CANNON.Sphere(1),
});
sphereBody.position.set(0, 5, 0);


physicsWorld.addBody(sphereBody);
let pegs = [];
let baskets = [];
buildWorld(scene, physicsWorld, pegs, baskets);


function animate() {
    physicsWorld.step(1 / 60);
	requestAnimationFrame( animate );
    
    puck.position.copy(sphereBody.position);
    puck.quaternion.copy(sphereBody.quaternion);
    // sphereBody.velocity.set(0, -3, 0);
    
    if(sphereBody.position.y <= -14){
        sphereBody.velocity.set(0, 0 ,0);
        sphereBody.angularVelocity.set(0, 0 ,0);
        sphereBody.position.set(0, 5, 0);
    }

	renderer.render( scene, camera );
}


animate();
