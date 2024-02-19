import * as THREE from './node_modules/three/build/three.module.js';
import * as CANNON from './node_modules/cannon-es/dist/cannon-es.js';

export function buildWorld( scene, world, pegs, baskets){
    pegs = buildPegs(scene, world);
    baskets = buildBaskets(scene, world);
}

function buildPegs(scene, world){
    const pinGeometry = new THREE.CircleGeometry( 0.6 );
    const pinMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
    let pegs =[];

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col <= row; col++) {
            const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
            const pinBody = new CANNON.Body({
                mass: 0,
                shape: new CANNON.Sphere(0.2),
                collisionResolution: false,
            });
            const x = col * 2.5 - row * 1.25;
            const y = -row * 2.5;
            pinMesh.position.set(x, y, 0);
            pinBody.position.copy(pinMesh.position);
            scene.add(pinMesh);
            world.addBody(pinBody);
            pegs.push(pinBody);
        }
    }
    return(pegs);
}

function buildBaskets(scene, world) {
    
    const basketGeometry = new THREE.BoxGeometry(1.5, 1, 1);
    const basketMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

    let baskets = [];

    for(let i = 0; i <= 6; i++){
        const basketMesh = new THREE.Mesh(basketGeometry, basketMaterial);
        scene.add(basketMesh);

        const boxShape = new CANNON.Box(new CANNON.Vec3(0.6, 0.3, 0.3));
        const boxBody = new CANNON.Body({ 
            mass: 0,
            shape: boxShape,
        });
        basketMesh.position.set(-8 + (i*2.7), -15, 0);
        boxBody.position.copy(basketMesh.position);
        world.addBody(boxBody);
        baskets.push(basketMesh);
    }
    return(baskets);
}
