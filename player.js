import * as THREE from './node_modules/three/build/three.module.js';
import * as CANNON from './node_modules/cannon-es/dist/cannon-es.js';

export function createPlayer(scene, physicsWorld) {
    const puckGeometry = new THREE.SphereGeometry(0.5);
    const puckMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    const puck = new THREE.Mesh(puckGeometry, puckMaterial);

    scene.add(puck);
    let puckMass = 1;

    const puckShape = new CANNON.Sphere(0.5);
    const puckBody = new CANNON.Body({
        mass: puckMass,
        shape: puckShape, // Use the same radius as the geometry
    });
    puckBody.position.set(0, 12, 0);
 
    physicsWorld.addBody(puckBody);
    return { mesh: puck, body: puckBody };
}
