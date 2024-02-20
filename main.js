import * as THREE from './node_modules/three/build/three.module.js';
import * as CANNON from './node_modules/cannon-es/dist/cannon-es.js';
import { buildPegboard } from './pinboard.js'
import { buildCamera, buildScene, buildRenderer, buildPhysicsWorld } from './gameWorld.js';
import { calculateReward } from './pinboardCalculations.js';
import { createPlayer } from './player.js';

let scene = buildScene();
let camera= buildCamera();
let renderer = buildRenderer();
let physicsWorld = buildPhysicsWorld();
let totalTokens = 100;

let winnings = 0;
const gameStatus = { gameStarted: false};
const rewardIndex = { bucketNumber: null};
const doOnce = {done: false};
const hasStarted = {started: false};
let player;


document.getElementById('startGame').addEventListener('click', startGame, false);

const totalCreditsElement = document.getElementById('totalCredits');
const totalWinningsElement = document.getElementById('totalWinnings');

function updateTotalCredits(){
    if(totalTokens + winnings <= 10){
        totalCreditsElement.innerHTML = `Total Credits:   ${totalTokens + winnings} (INSUFFICIENT FUNDS)`;
    }else{
        totalCreditsElement.innerHTML = `Total Credits:   ${totalTokens + winnings}`;
    }
}

function updateTotalWinnings(){
    totalWinningsElement.innerHTML = `Total Winnings: ${winnings}`;
}

const {pegs, baskets} = buildPegboard(scene, physicsWorld, gameStatus, rewardIndex);

function startGame(){
    if(totalTokens >= 10){
        if(!gameStatus.gameStarted){
            gameStatus.gameStarted = true;
            totalTokens=totalTokens-10;
            const start = Math.floor(Math.random() * 100);
            let angle = (Math.floor(Math.random() * 60) / 20);
            if(angle===0){
                angle= 1;
            }
            player = createPlayer(scene, physicsWorld);
            
            if(start <= 49){
                player.body.velocity.set(-angle, -9.81, 0);
            }else{    
                player.body.velocity.set(angle, -9.81, 0);
            }
            updateTotalCredits();
        }
    }
}


function animate() {
    physicsWorld.step(1 / 60);
	requestAnimationFrame( animate );
    
    if(gameStatus.gameStarted){
        hasStarted.started = true;
        if(doOnce.done){
            doOnce.done = false;
        }
        if(player.body){
            if (player.body.position.y <= -20.5) {
                setTimeout(function(){
                    scene.remove(player.mesh);
                    physicsWorld.removeBody(player.body);
                    gameStatus.gameStarted = false;
                }, 500);
            }

            player.mesh.position.copy(player.body.position);
            player.mesh.quaternion.copy(player.body.quaternion);
        }
    }else{
        if(hasStarted.started){
            if(doOnce.done === false){
                if(rewardIndex.bucketNumber != null){
                    console.log(gameStatus.gameStarted);
                    let reward = calculateReward(rewardIndex);
                    console.log(reward);
                    winnings= winnings + reward;
                    updateTotalWinnings();
                    updateTotalCredits();
                    doOnce.done=true;
                }
            }
        }
    }
    renderer.render( scene, camera );
}


animate();
