
import * as THREE from 'three';
import { brain } from './quad/quad';
import { makeGrid, updateGrid } from './quad/gridMoves';

var canvas = document.getElementById("main-view");

var scene, camera, renderer;
var geometry, material, player;
var directionHistories = new Array(4);
var actionIdHistory = new Array(8);

init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    geometry = new THREE.BoxGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    // ghost image
    var ghost = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x440000, wireframe: true } ) );
    scene.add( ghost );

    var playerBody = new THREE.Mesh( geometry, material );

    player = new THREE.Object3D();
    player.add(playerBody);

    directionHistories[0] = new THREE.ArrowHelper(new THREE.Vector3( 1, 0, 0), new THREE.Vector3( 210, 0, 0), 50, 0x00ffff, 10, 20);
    directionHistories[1] = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(-210, 0, 0), 50, 0x00ffff, 10, 20);
    directionHistories[2] = new THREE.ArrowHelper(new THREE.Vector3(0,  1, 0), new THREE.Vector3(0,  210, 0), 50, 0x00ffff, 10, 20);
    directionHistories[3] = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, -210, 0), 50, 0x00ffff, 10, 20);
    directionHistories.map(x => player.add(x));

    scene.add(player);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.getElementById("main").appendChild( renderer.domElement );

    makeGrid(scene);

}

let timer = 0;
function animate() {
    timer++;


    for(var i=0; i < 10; ++i){
      let actionId = brain.forward(calcInput());

      //directionHistories.map(x => x.setLength(50, 10, 20));
      //directionHistories[actionId].setLength(100, 10, 20);
      setHistoryArrows(actionId);

      var prevPosition = { x: player.position.x, y: player.position.y };

      switch(actionId){
        case 0:
          player.position.x += 4;
          break;
        case 1:
          player.position.x -= 4;
          break;
        case 2:
          player.position.y += 4;
          break;
        case 3:
          player.position.y -= 4;
          break;
      }
      brain.backward(calcReward(prevPosition));

      if(Math.random() < 0.002){
        player.position.x = 500 * Math.random() - 250;
        player.position.y = 500 * Math.random() - 250;
      }

      if(timer % 60 == 0){
        updateGrid(brain);
      }
    }


    requestAnimationFrame( animate );
    renderer.render( scene, camera );

}

function setHistoryArrows(newId) {
  var removeAction = actionIdHistory.unshift();
  actionIdHistory.push(newId);

  var counts = [0, 0, 0, 0];
  for(var i=0; i < actionIdHistory.length; ++i){
    if(typeof actionIdHistory[i] === "number"){
      counts[actionIdHistory[i]]++;
    }
  }

  for(var i=0; i < counts.length; ++i){
    var perc = counts[i] / actionIdHistory.length;
    directionHistories[i].setLength(10 + perc * 90, 10, 20);
  }
}

function calcInput(){
  return [
    player.position.x,
    player.position.y,
  ];
}

function calcReward({ x, y }){
  let prevDist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  let dist = Math.sqrt(Math.pow(player.position.x, 2) + Math.pow(player.position.y, 2));
  return Math.tanh(prevDist - dist);
}
