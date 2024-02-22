import * as THREE from './node_modules/three/build/three.module.js';
import * as CANNON from './node_modules/cannon-es/dist/cannon-es.js';

export function buildPegboard( scene, world, gameStatus, rewardIndex ){
    const pegs = buildPegs(scene, world);
    const baskets = buildBaskets(scene, world, gameStatus, rewardIndex);
    buildWorldBorder(scene, world);
    return {pegs, baskets};
}

function buildPegs(scene, world){
    const pinGeometry = new THREE.CircleGeometry( 0.8);
    const loader = new THREE.TextureLoader();
    
    let pinTexture =  loader.load(
        './metal.png',
    );
    let pinMaterial = new THREE.MeshBasicMaterial( {
        map: pinTexture
    });
    let newPegs =[];

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col <= row; col++) {
            if(row === row.length - 1 && col === 3)
            {
                continue;
            }else{
                const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
                const pinBody = new CANNON.Body({
                    mass: 0,
                    shape: new CANNON.Sphere(0.4),
                });
                const x = col * 5.25 - row * 2.625;
                const y = 2 -row * 4;
                pinMesh.position.set(x, y, 0);
                pinBody.position.copy(pinMesh.position);
                scene.add(pinMesh);
                world.addBody(pinBody);
                newPegs.push({ mesh: pinMesh, body: pinBody });
            }
        }
    }
    return(newPegs);
}

function buildBaskets(scene, world, gameStatus, rewardIndex) {
    
    const basketGeometry = new THREE.BoxGeometry(4.5, 1, 1);
    
    let newBaskets = [];
    const colors = [0x0000FF,  0x66FF00, 0xFFFF00, 0xFF6600, 0xFF0000, 0xFF6600, 0xFFFF00, 0x66FF00, 0x0000FF];
    
    for(let i = 0; i <= 8; i++){
        let customColor = colors[i];
        const basketMaterial = new THREE.MeshBasicMaterial({ color: customColor });
        const basketMesh = new THREE.Mesh(basketGeometry, basketMaterial);
        scene.add(basketMesh);
        
        const boxShape = new CANNON.Box(new CANNON.Vec3(2.25, 0.5, 0.5)); 
        
        const boxBody = new CANNON.Body({ 
            mass: 0,
            shape: boxShape,
            collisionResponse:1,
        });
        boxBody.addShape(boxShape);
        
        basketMesh.position.set((-21) + (i*5.3), -34.5, 0);
        
        boxBody.position.copy(basketMesh.position);
        world.addBody(boxBody);
        
        boxBody.addEventListener('collide', (event) => {
            handleBucketCollision(event, newBaskets, rewardIndex);
        });
        newBaskets.push({ mesh: basketMesh, body: boxBody });
    }

    return(newBaskets);
}

function handleBucketCollision(event, baskets, rewardIndex) {
    const  { target }  = event; 
     
    for (let i = 0; i < baskets.length; i++) {
        if (target === baskets[i].body) {
            rewardIndex.bucketNumber = i;
            break;
        }
    }
}

function buildWorldBorder(scene, world){
    const verticalGeometry = new THREE.BoxGeometry(1, 70, 1);
    const horizontalGeometry = new THREE.BoxGeometry(47, 1, 1);
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    
    
    const leftVerticalMesh = new THREE.Mesh(verticalGeometry, wallMaterial);
    const rightVerticalMesh = new THREE.Mesh(verticalGeometry, wallMaterial);
    // const bottomHorizontalMesh = new THREE.Mesh(horizontalGeometry, wallMaterial);
    const topHorizontalMesh = new THREE.Mesh(horizontalGeometry, wallMaterial);

    scene.add(leftVerticalMesh);
    scene.add(rightVerticalMesh);
    // scene.add(bottomHorizontalMesh);
    scene.add(topHorizontalMesh);

    
    leftVerticalMesh.position.set(-23.5, 0, 0);
    rightVerticalMesh.position.set(23.5, 0, 0);
    // bottomHorizontalMesh.position.set(0, -23, 0);
    topHorizontalMesh.position.set(0, 34.5, 0);

    const verticalWallShape = new CANNON.Box(new CANNON.Vec3(0.5, 35, 1)); 
    const horizontalWallShape = new CANNON.Box(new CANNON.Vec3(26, 0.5, 1)); 
    
    const leftVerticalBody = new CANNON.Body({ 
        mass: 0,
        shape: verticalWallShape,
    });
    const rightVerticalBody = new CANNON.Body({ 
        mass: 0,
        shape: verticalWallShape,
    });
    // const bottomHorizontalBody = new CANNON.Body({ 
    //     mass: 0,
    //     shape: horizontalWallShape,
    // });
    const topHorizontalBody = new CANNON.Body({ 
        mass: 0,
        shape: horizontalWallShape,
    });

    leftVerticalBody.addShape(verticalWallShape);
    rightVerticalBody.addShape(verticalWallShape);
    // bottomHorizontalBody.addShape(horizontalWallShape);
    topHorizontalBody.addShape(horizontalWallShape);

    leftVerticalBody.position.copy(leftVerticalMesh.position);
    rightVerticalBody.position.copy(rightVerticalMesh.position);
    // bottomHorizontalBody.position.copy(bottomHorizontalMesh.position);
    topHorizontalBody.position.copy(topHorizontalMesh.position);
    
    world.addBody(leftVerticalBody);
    world.addBody(rightVerticalBody);
    // world.addBody(bottomHorizontalBody);
    world.addBody(topHorizontalBody);


}

function buildWalls(scene, world){
    const wallGeometry = new THREE.BoxGeometry(0.9, 3, 1);
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

    let newWalls = [];

    for(let i = 0; i <= 7; i++){
        const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
        scene.add(wallMesh);
        wallMesh.position.set(-14 + i * 4, -22, 0);

        const wallShape = new CANNON.Box(new CANNON.Vec3(0.5, 1.5, 1)); 
        const wallBody = new CANNON.Body({ 
            mass: 0,
            shape: wallShape,
        });
        wallBody.addShape(wallShape);
        wallBody.position.copy(wallMesh.position);
        world.addBody(wallBody);
        
        newWalls.push({ mesh: wallMesh, body: wallBody });
    }
  
    return(newWalls);
}
