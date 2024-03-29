import * as THREE from './node_modules/three/build/three.module.js';
import * as CANNON from './node_modules/cannon-es/dist/cannon-es.js';

//Create the player puck
export function createPlayer(scene, physicsWorld) {
    const puckGeometry = new THREE.SphereGeometry(0.5);
    const loader = new THREE.TextureLoader();
    
    let puckTexture =  loader.load(
        './marbel.png',
    );
    let puckMaterial = new THREE.MeshBasicMaterial( {
        map: puckTexture,
        color:'#FFFF00'
    });
    const puck = new THREE.Mesh(puckGeometry, puckMaterial);
    scene.add(puck);
    let puckMass = 1;

    const puckShape = new CANNON.Sphere(0.5);
    const puckBody = new CANNON.Body({
        mass: puckMass,
        shape: puckShape, 
    });
    puckBody.position.set(0, 10, 0);
 
    physicsWorld.addBody(puckBody);
    return { mesh: puck, body: puckBody };
}
