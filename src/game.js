import * as THREE from 'three';

import Track from './track';
import Keys from './keys';

export default class Game {
	constructor() {
		this.keys = new Keys();
		this.startGame();
	}
	startGame() {
		THREE.Cache.enabled = true;
		let width = window.innerWidth;
		let height = window.innerHeight;
		let viewAngle = 75,
			aspect = width / height,
			near = 0.1,
			far = 5000;

		let scene = new THREE.Scene();
		let camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);

		camera.position.z = 150;

		let renderer = new THREE.WebGLRenderer();
		document.body.appendChild(renderer.domElement);
		renderer.setSize(width, height);
		this.track = new Track(renderer, camera, scene, this.keys);
		this.track.setup();
	}
}
