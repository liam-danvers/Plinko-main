import * as THREE from './node_modules/three/build/three.module.js';
import * as CANNON from './node_modules/cannon-es/dist/cannon-es.js';

//World configuration
export function buildScene() {
    const scene = new THREE.Scene();
    let initialColor=0xc4c4c4;
    scene.background = new THREE.Color(initialColor); 
    
    return scene;
}

export function buildCamera(){
    const camera = new THREE.OrthographicCamera( -26 , 35 , 32 , -32 , 1, 1000 );
    camera.position.z = 10;
    return camera;

}

export function buildRenderer(){
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( 500 , 500 );
    document.body.appendChild( renderer.domElement );
    return renderer;
}

export function buildPhysicsWorld(){
    const physicsWorld = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.81, 0),
    });
    return physicsWorld;
}
