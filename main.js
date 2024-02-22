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
const shouldMove = { move: false };
const stepCount = { steps: 0 };
const columnPosition = {column: 0};
const markedPostion = {spot : 0};
const gameComplete = {finished: false};

let player;

document.getElementById('startGame').addEventListener('click', startGame, false);

const totalCreditsElement = document.getElementById('totalCredits');
const totalWinningsElement = document.getElementById('totalWinnings');
const rewardMessageElement = document.getElementById('rewardMessage');

const basicRadio = document.getElementById('basic');
const bigMoneyRadio = document.getElementById('big_money');
const basicSettings = document.getElementById('basicSettings');
const bigMoneySettings = document.getElementById('bigMoneySettings');
const popupMessage =  document.getElementById('popup');
const betBasicInput =  document.getElementById('basicSettingInput');
const betInput =  document.getElementById('bigMoneySettingInput');
const autoplayEnabledRadio =  document.getElementById('autoplay_enabled');
const autoplayDisabledRadio =  document.getElementById('autoplay_disabled');

document.getElementById('closePopup').addEventListener('click', closePopup, false);


// Attach event listeners to radio buttons
basicRadio.addEventListener('change', handleRadioButtonChange);
bigMoneyRadio.addEventListener('change', handleRadioButtonChange);
autoplayDisabledRadio.addEventListener('change', handleAutoPlayChange);
autoplayEnabledRadio.addEventListener('change', handleAutoPlayChange);
betInput.addEventListener('change', updateTotalCredits);




function handleRadioButtonChange() {
    if (basicRadio.checked) {
        basicSettings.style.display = 'block';
        bigMoneySettings.style.display = 'none';
    } else if (bigMoneyRadio.checked) {
        basicSettings.style.display = 'none';
        bigMoneySettings.style.display = 'block';
    }
}

function handleAutoPlayChange(){
    if(autoplayDisabledRadio.checked){
        autoplayEnabledRadio.checked = false;
    }else{
        autoplayDisabledRadio.checked = false;
        autoplayEnabledRadio.checked = true;
    }
}

function showPopup() {
    popupMessage.style.display = 'block';
}

function closePopup() {
    popupMessage.style.display = 'none';
}


function updateTotalCredits(){
    if( betInput.value > totalTokens ){
        totalCreditsElement.innerHTML = `Total Credits:   ${totalTokens} (INSUFFICIENT FUNDS)`;
    }else{
        totalCreditsElement.innerHTML = `Total Credits:   ${totalTokens}`;
    }
}

function updateTotalWinnings(){
    totalWinningsElement.innerHTML = `Total Winnings: ${winnings}`;
}

function createRewardMessage(reward){
    if(reward !== 0){
        rewardMessageElement.innerHTML = `Congratulations you won: ${reward}`;
    }else{
        rewardMessageElement.innerHTML = `No luck this time, try again.`;
    }
}

function createMessage(message){
    rewardMessageElement.innerHTML = `${message}`;
}

const {pegs, baskets} = buildPegboard(scene, physicsWorld, gameStatus, rewardIndex);

function startGame() {
    if (totalTokens >= 10 && totalTokens !== 0) {
        if (!gameStatus.gameStarted) {
            gameStatus.gameStarted = true;
            player = createPlayer(scene, physicsWorld);
            
            if (basicRadio.checked) {
                totalTokens -= 10;
                player.body.velocity.set(0, -9.81, 0);
            } else {
                totalTokens -= betInput.value;
                const startPos = Math.floor(Math.random() * 100);
                const angle = (Math.floor(Math.random() * 60) / 20) || 0.5;
                const direction = startPos <= 49 ? -1 : 1;
                player.body.velocity.set(direction * angle, -9.81, 0);
            }

            updateTotalCredits();
            gameComplete.finished = false;
        }
    } else {
        createMessage(`Unable to place bet, insufficient funds.`);
        showPopup();
    }
}


function animate() {
    physicsWorld.step(1 / 60);
	requestAnimationFrame( animate );
    
    if(basicRadio.checked){
        basicGame();
    }else{
        if(autoplayDisabledRadio.checked){
            physicsGame();
        }else{
            if(gameComplete.finished){
                gameComplete.finished = false;
                startGame();
            }
            physicsGame();
        }
    }
    renderer.render( scene, camera );
}
    

handleRadioButtonChange();
handleAutoPlayChange();
animate();
    
function choosePath(){
    if(shouldMove.move){
        const step = Math.floor(Math.random() * 100);
        if(columnPosition.column >= -2 && columnPosition.column < 2){
            if(step <= 49){
            columnPosition.column = columnPosition.column -1;
            player.body.velocity.set(-10, 0, 0);
        }else{
            columnPosition.column = columnPosition.column +1;
            player.body.velocity.set(10, 0, 0);
        }
        markedPostion.spot = player.body.position.x;
    }else{
        if(step <= 12){
            columnPosition.column = columnPosition.column -1;
            player.body.velocity.set(-10, 0, 0);
        }else if (step > 10 && step <= 49){
            columnPosition.column = columnPosition.column +1;
            player.body.velocity.set(10, 0, 0);
        }else if (step > 50 && step <= 89){
            columnPosition.column = columnPosition.column -1;
            player.body.velocity.set(-10, 0, 0);
        }else{
            columnPosition.column = columnPosition.column +1;
            player.body.velocity.set(10, 0, 0);
        }
        markedPostion.spot = player.body.position.x;
        }
    }
}

function prepareEndstate(){
    let timer;
    if(autoplayDisabledRadio.checked){
        clearTimeout(timer);
        timer = setTimeout(function(){
            scene.remove(player.mesh);
            physicsWorld.removeBody(player.body);
            gameStatus.gameStarted = false;
            stepCount.steps = 0;
            columnPosition.column = 0;
            basicRadio.disabled= false;
            bigMoneyRadio.disabled= false;
            showPopup();
        }, 100);
    }else{
        clearTimeout(timer);
        timer = setTimeout(function(){
            scene.remove(player.mesh);
            physicsWorld.removeBody(player.body);
            gameStatus.gameStarted = false;
            stepCount.steps = 0;
            columnPosition.column = 0;
            basicRadio.disabled= false;
            bigMoneyRadio.disabled= false;
            gameComplete.finished = true;
        }, 500);
    }
}

function movePlayer(){
    if(stepCount.steps < 8){
        if(player.body.velocity.x === 0){
            if(player.body.position.y <= 6 - stepCount.steps*4 && player.body.position.y > 5.8 - stepCount.steps*4){
                shouldMove.move = true;
                choosePath();
            }
        }else{
            if(markedPostion.spot <= player.body.position.x -2.625 ||markedPostion.spot > player.body.position.x + 2.625){ 
                player.body.velocity.set(0, -10, 0);
                shouldMove.move = false;
                stepCount.steps= stepCount.steps +1;
            }
        }
    }
}

function createBaseReward(){
    let reward = calculateReward(rewardIndex, true, 10);
    createRewardMessage(reward);
    winnings = winnings + reward;
    totalTokens = totalTokens + reward;
    updateTotalWinnings();
    updateTotalCredits();
    doOnce.done=true;
}

function createReward(){
    let reward = calculateReward(rewardIndex, false, betInput.value);
    createRewardMessage(reward);
    winnings = winnings + reward;
    totalTokens = totalTokens + reward;
    updateTotalWinnings();
    updateTotalCredits();
    doOnce.done=true;
}

function disabledButtonsOnStart(){
    basicRadio.disabled= true;
    bigMoneyRadio.disabled= true;
    hasStarted.started = true;

    if(doOnce.done){
        doOnce.done = false;
    }
}


function basicGame(){
    if(gameStatus.gameStarted){
        disabledButtonsOnStart();
        
        if(player.body){
            player.body.isTrigger= true;
            physicsWorld.gravity.set(0, 0, 0);
            movePlayer();
            
            if (player.body.position.y <= -28) {
                player.body.isTrigger= false;
                prepareEndstate();
            }
               
            player.mesh.position.copy(player.body.position);
            player.mesh.quaternion.copy(player.body.quaternion);
        }
    }else{
        if(hasStarted.started){
            if(doOnce.done === false){
                if(rewardIndex.bucketNumber != null){
                    createBaseReward();
                }
            }
        }
    }
}

function physicsGame(){
    if(gameStatus.gameStarted){
        disabledButtonsOnStart();
        if(player.body){
            physicsWorld.gravity.set(0, -9.81, 0);
            if (player.body.position.y <= -28) {
                prepareEndstate();
            }
              
            player.mesh.position.copy(player.body.position);
            player.mesh.quaternion.copy(player.body.quaternion);
        }
    }else{
        if(hasStarted.started){
            if(doOnce.done === false){
                if(rewardIndex.bucketNumber != null){
                    createReward();
                }
            }
        }
    }
}