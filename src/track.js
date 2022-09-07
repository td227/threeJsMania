import * as THREE from 'three';
//import parseFile from './parseFile.js';
import Notes from './notes';
import Audio from './audio';

export default class Track {
	constructor(renderer, camera, scene, keys, musicDeley) {
		//here we instantiate the all the obbjects we need
		this.renderer = renderer;
		this.camera = camera;
		this.scene = scene;
		this.keys = keys;
		this.musicDeley = musicDeley;

		this.cubeCamera;

		//objects in the scene
		this.tunnel;
		this.tunnel2;
		this.keyWidths = [];
		this.key = {};
		this.keyLights = [];

		//time in seconds for note to fall to judgement line
		this.fallTime = 0.75;

		//this will be used to calculate time time at which point the first note falls
		//this is important to sync the notes with the music
		this.timeZero = 0;

		this.endSphere;
		this.notes = [];
		this.sliders = [];

		this.globalColor;
		this.yStartPoint = 1200;
		this.yEndPoint = 0;
		this.xPos = [-48, -16, 16, 48];

		this.tRot = -1.4;
		this.pos = [-1, -16, 16, 32];

		this.songNotes = [];
		this.lastTime = Date.now();
		this.firstNoteTime = Date.now();
	}

	async setup() {
		this.setWindowResizer();
		this.createTrack();
		this.keyAtts();
		let audio = new Audio(this.renderer, this.camera, this.scene, this.musicDeley, this.songPath, this);
		this.songNotes = await audio.parseFile(this.vel, this.keys);

		//this.createNotes(this.noteInterval);
		this.loop();
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	update() {
		let delta = (Date.now() - this.lastTime) / 1000;
		this.lastTime = Date.now();
		//console.log(delta);
		this.notes.forEach((note) => {
			note.position.y += this.key.yVel * delta;
			if (note.position.y < this.yEndPoint - 1000) {
				this.scene.remove(note);
			}
		});
		this.sliders.forEach((slider) => {
			slider.forEach((x) => {
				x.position.y += this.key.yVel * delta;
				if (x.position.y < this.yEndPoint - 1000) {
					//200 to account for the height of the slider :P
					this.scene.remove(x);
				}
			});
		});

		this.tunnel.position.y += this.key.yVel * delta * 2;
		if (this.tunnel.position.y < 400 - 15000 / 8) {
			this.tunnel.position.set(0, 400, 0);
		}
		this.tunnel2.position.y -= this.key.yVel * delta * 2;
		//this.tunnel2.rotateY(0.004);
		if (this.tunnel2.position.y > 400 + 15000 / 8) {
			this.tunnel2.position.set(0, 400, 0);
		}

		this.keyLights.forEach((light) => {
			light.material.opacity = light.material.opacity - 0.0125;
		});
	}

	loop() {
		requestAnimationFrame(this.loop.bind(this));
		this.update();
		this.render();
	}

	async createNotes(timeZero2) {
		//let audio = new Audio(this.renderer, this.camera, this.scene, this.musicDeley, this.songPath);
		//this.songNotes = await audio.parseFile(this.vel, this.keys);
		let width = this.xPos[3] - this.xPos[2];
		const noteGeometry = new THREE.PlaneGeometry(width, (width / 256) * 65);
		// let noteMaterials = [
		// 	new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./src/assets/note.png') }),
		// 	new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./src/assets/note2.png') }),
		// 	new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./src/assets/note2.png') }),
		// 	new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./src/assets/note.png') })
		// ];
		let noteMaterials = [
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/note.png')) }),
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/note2.png')) }),
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/note2.png')) }),
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/note.png')) })
		];

		let sliderMaterials = [
			[
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/sliderTop.png')) }),
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/sliderMid.png')) }),
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/sliderTail.png')) })
			],
			[
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/sliderTop2.png')) }),
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/sliderMid2.png')) }),
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/sliderTail2.png')) })
			],
			[
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/sliderTop2.png')) }),
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/sliderMid2.png')) }),
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/sliderTail2.png')) })
			],
			[
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/sliderTop.png')) }),
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/sliderMid.png')) }),
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(require('./assets/sliderTail.png')) })
			]
		];
		this.gameNotes = new Notes(this.keys);

		// const vel = (this.key.vel * (this.yEndPoint - this.yStartPoint)) / 200;
		const vel = this.key.yVel;
		console.warn('vel: ', vel);
		// vel = m/s
		// dist = m
		// time = speed / dist
		// dist = vel * s = m/s * s =
		//  1/s =
		const timeTaken = (1 / (vel / (this.yEndPoint - this.yStartPoint))) * 1000;
		console.log('cunt ' + timeTaken);
		// audio.startSong();
		//let timeZero = audio.timeZero;
		let timeZero = timeZero2;
		console.log(timeZero);
		this.songNotes.forEach((songNote, i) => {
			let checkOffset = Date.now() - Math.round(timeZero);
			let timingOffset = Date.now() - Math.round(timeZero) + timeTaken;
			if (i < 5) console.warn('timing offset: ' + timingOffset);
			let hold;
			if (songNote.isSlider) {
				hold = songNote.duration - songNote.time;
				//console.log(songNote.time - timingConstant);
				const sliderGeometry = [
					new THREE.PlaneGeometry(this.keyWidths[songNote.column], (width / 256) * 85),
					//new THREE.PlaneGeometry(this.keyWidths[songNote.column], (((width / 256) * hold) / 1000000) * Math.abs(vel)),
					new THREE.PlaneGeometry(this.keyWidths[songNote.column], (width / 256) * 85)
				];
				let slider = [];
				slider[0] = new THREE.Mesh(sliderGeometry[0], sliderMaterials[songNote.column][0]);
				slider[2] = new THREE.Mesh(sliderGeometry[2], sliderMaterials[songNote.column][2]);
				this.sliders[i] = slider;
			} else {
				let geometry = new THREE.PlaneGeometry(this.keyWidths[songNote.column], (width / 256) * 65);
				this.notes[i] = new THREE.Mesh(geometry, noteMaterials[songNote.column]);
				//this.notes[i] = new THREE.Mesh(noteGeos[songNote.column], noteMaterials[songNote.column]);
			}
			setTimeout(() => {
				let temp = parseFloat(this.yStartPoint) + (width / 256) * (hold / 1000) * Math.abs(vel);
				if (this.sliders[i]) {
					this.sliders[i][0].position.set(this.xPos[songNote.column], this.yStartPoint, 2);
					this.sliders[i][2].position.set(this.xPos[songNote.column], temp, 2);
					let midGeo = new THREE.PlaneGeometry(this.keyWidths[songNote.column], this.sliders[i][2].position.y - this.sliders[i][0].position.y);
					this.sliders[i][1] = new THREE.Mesh(midGeo, sliderMaterials[songNote.column][1]);
					this.sliders[i][1].position.set(this.xPos[songNote.column], (this.sliders[i][0].position.y + this.sliders[i][2].position.y) / 2, 1);
					this.scene.add(this.sliders[i][0], this.sliders[i][1], this.sliders[i][2]);
				} else {
					this.notes[i].renderOrder = -5;
					this.scene.add(this.notes[i]);
					this.notes[i].position.set(this.xPos[songNote.column], this.yStartPoint);
				}
			}, parseFloat(songNote.time) - parseFloat(timingOffset));
			if (i == 0) this.firstNoteTime = parseFloat(songNote.time) - parseFloat(timingOffset);
			if (i < 5) {
				console.group('DEBUG');
				console.log('foundTimeZero: ' + (Date.now() - Math.round(timeZero)));
				console.warn(timeZero);
				console.warn(songNote.time);

				console.log('timing offset:' + timingOffset);
				console.log('note start time: ' + (parseFloat(songNote.time) - parseFloat(timingOffset)));
				console.groupEnd();
			}
			// songNote.time - timingOffset
			let time = songNote.time - (Date.now() - timeZero);
			this.gameNotes.setCheckNote(songNote, parseFloat(songNote.time) - checkOffset);
		});
	}

	setWindowResizer() {
		let width, height;
		window.addEventListener('resize', () => {
			width = window.innerWidth;
			height = window.innerHeight;
			this.renderer.setSize(width, height);
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
		});
	}

	createTrack() {
		for (let i = 0; i < 4; i++) {
			if ([1, 2].includes(i)) this.keyWidths[i] = 75 / 1.75;
			else this.keyWidths[i] = 91 / 1.75;
		}
		console.log(this.keyWidths);
		this.xPos = [-this.keyWidths[0] / 2 - this.keyWidths[1], -this.keyWidths[1] / 2, this.keyWidths[1] / 2, this.keyWidths[1] + this.keyWidths[0] / 2];
		// let linePos = [-this.keyWidths[0] / 2 - this.keyWidths[1] / 2, 0, this.keyWidths[0] / 2 + this.keyWidths[1] / 2];
		// for (let i = 0; i < 4; i++) {
		// 	let lineGeo = new THREE.PlaneGeometry(1, 700);
		// 	let lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
		// 	let line = new THREE.Mesh(lineGeo, lineMat);
		// 	line.position.set(linePos[i], 0, -1);
		// 	this.scene.add(line);
		// }

		const loader = new THREE.TextureLoader();

		// this.globalColor = 0x0066ff;
		// const color2 = 0x292e73;
		// const color = 0x7f2f78;
		// const intensity = 2;
		// const light = new THREE.SpotLight(color, intensity);
		// light.position.set(-50, 0, 50);
		// light.target.position.set(100, 150, -30);
		// this.scene.add(light);
		// const light2 = new THREE.SpotLight(color2, intensity);
		// light2.position.set(50, 0, 50);
		// light2.target.position.set(-100, 150, -30);
		// light.penumbra = 1;
		// light2.penumbra = 1;

		this.renderer.physicallyCorrectLights = true;
		let cols = [0x7f2f78, 0x292e73];
		let pos = [50, -50];
		let targets = [350, -350];
		for (let i = 0; i < 2; i++) {
			let light = new THREE.DirectionalLight(cols[i], 100);
			light.position.set(pos[i], -1000, 40);
			light.target.position.set(targets[i], 200, 0);
			light.power = 1500;

			light.decay = 0.1;

			light.penumbra = 1;
			this.scene.add(light);
		}

		// this.scene.add(light2);
		// this.scene.add(light2.target);
		// this.scene.add(light.target);

		let texture = loader.load(require('./assets/wallTexture.png'), function (texture) {
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set(8, 8);
		});

		let material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			map: texture,
			transparent: true,
			shininess: 100,
			reflectivity: 1,
			side: THREE.DoubleSide
		});
		let texture2 = loader.load(require('./assets/wallTexture2.png'), function (texture) {
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set(8, 8);
		});

		let material2 = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			map: texture2,
			transparent: true,
			shininess: 100,
			reflectivity: 1,
			side: THREE.DoubleSide
		});

		// let pointLightsPos = [700, -700];
		// for (let i = 0; i < 2; i++) {
		// 	let SpotLight = new THREE.SpotLight(0xffffff, 1);
		// 	SpotLight.position.set(pointLightsPos[i], 500, 0);
		// 	SpotLight.target.position.set(pointLightsPos[i] - 50, 1000, 0);
		// 	SpotLight.penumbra = 1;
		// 	this.scene.add(SpotLight);
		// }

		let tunnelGeometry = new THREE.CylinderGeometry(700, 700, 15000, 8, 8, false);
		let tunnelOut = new THREE.Mesh(tunnelGeometry, material);
		tunnelGeometry.frustumCulled = false;
		tunnelOut.position.set(0, 400, 0);
		this.tunnel = tunnelOut;
		this.tunnel.rotateY(0.4);
		this.tunnel.renderOrder = -1;
		this.scene.add(this.tunnel);

		let tunnel2Geometry = new THREE.CylinderGeometry(800, 800, 15000, 8, 8, true);
		let tunnel2Out = new THREE.Mesh(tunnel2Geometry, material2);
		tunnel2Geometry.frustumCulled = false;
		tunnel2Out.position.set(0, 400, 0);
		this.tunnel2 = tunnel2Out;
		this.tunnel2.rotateY(0.4);
		this.tunnel2.renderOrder = -2;
		this.scene.add(this.tunnel2);

		const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
		this.cubeCamera = new THREE.CubeCamera(1, 100000, cubeRenderTarget);
		this.scene.add(this.cubeCamera);

		this.cubeCamera.position.set(0, -210, 200);
		this.cubeCamera.lookAt(0, 200, 0);
		this.camera.position.set(0, -210, 200);
		this.camera.lookAt(0, 200, 0);
		let tGeometry = new THREE.BoxGeometry(200, 4000, 1);
		let track = new THREE.Mesh(
			tGeometry,
			new THREE.MeshLambertMaterial({
				color: 0x000000,
				shininess: 100,
				envMap: cubeRenderTarget.texture,
				refractionRatio: 0.5,
				transparent: true,
				side: THREE.BackSide,
				combine: THREE.MixOperation,
				reflectivity: 0.5
			})
		);

		track.position.set(0, 0, -4);
		track.renderOrder = -3;
		this.scene.add(track);

		let sphereGeo = new THREE.SphereGeometry(125, 32, 32);
		let sphereMat = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			map: loader.load(require('./assets/flash.png')),
			transparent: true,
			emissive: 0xffffff,
			emissiveMap: loader.load(require('./assets/flash.png')),
			side: THREE.DoubleSide
		});
		let sphere = new THREE.Mesh(sphereGeo, sphereMat);
		sphere.renderOrder = 0;
		sphere.position.set(0, 1250, 150);
		//this.scene.add(sphere);
	}

	keyAtts() {
		this.key.vel = 0.5;

		//middle two columns should be 75 pixels and NOT 109 pixels
		const loader = new THREE.TextureLoader();
		this.key.width = this.keyWidths[0];

		this.key.height = (this.key.width / 75) * 109;

		let circles = [];
		for (let i = 0; i < 4; i++) {
			let planeGeometry = new THREE.PlaneGeometry(this.keyWidths[i], this.key.height);
			let kGeometry = new THREE.PlaneGeometry(this.keyWidths[i], (this.key.width / 75) * 632);
			let kLightMat = new THREE.MeshPhongMaterial({
				color: 0xffffff,
				map: loader.load(require('./assets/keyLight.png')),
				emissiveMap: loader.load(require('./assets/keyLight.png')),
				emissive: 0xffffff,
				emissiveIntensity: 1,
				transparent: true
			});
			circles[i] = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
			this.keyLights[i] = new THREE.Mesh(kGeometry, kLightMat);
		}

		let key1 = require('./assets/key.png');
		let key2 = require('./assets/key2.png');
		let key3 = require('./assets/key3.png');
		let key4 = require('./assets/key.png');
		let keyPressed1 = require('./assets/keyPressed.png');
		let keyPressed2 = require('./assets/key2Pressed.png');
		let keyPressed3 = require('./assets/key3Pressed.png');
		let keyPressed4 = require('./assets/keyPressed.png');

		this.key.materials = [
			new THREE.MeshBasicMaterial({ map: loader.load(key1) }),
			new THREE.MeshBasicMaterial({ map: loader.load(key2) }),
			new THREE.MeshBasicMaterial({ map: loader.load(key3) }),
			new THREE.MeshBasicMaterial({ map: loader.load(key4) })
		];

		this.key.pressedMats = [
			new THREE.MeshBasicMaterial({ map: loader.load(keyPressed1) }),
			new THREE.MeshBasicMaterial({ map: loader.load(keyPressed2) }),
			new THREE.MeshBasicMaterial({ map: loader.load(keyPressed3) }),
			new THREE.MeshBasicMaterial({ map: loader.load(keyPressed4) })
		];

		this.yEndPoint = -40;
		this.key.yVel = (this.yEndPoint - this.yStartPoint) / this.fallTime;
		console.log(this.yEndPoint);
		console.log(this.yStartPoint);
		const jLineMat = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			map: loader.load(require('./assets/jLine.png')),
			emissiveMap: loader.load(require('./assets/jLine.png')),
			emissive: 0xffffff,
			emissiveIntensity: 1,
			transparent: true
		});
		const jGeometry = new THREE.PlaneGeometry(this.xPos[3] + this.keyWidths[3] / 2 - (this.xPos[0] - this.keyWidths[0] / 2), (this.key.width / 75) * 532);
		const jLine = new THREE.Mesh(jGeometry, jLineMat);
		jLine.position.set((this.xPos[1] + this.xPos[2]) / 2, this.yEndPoint + 2, 5);
		this.scene.add(jLine);

		let scaleWidth = this.key.width / 75;
		let sideGeometry = new THREE.BoxGeometry(scaleWidth * 510, 2500, 1);
		let leftMaterial = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			map: loader.load(require('./assets/trackLeft.png')),
			emissiveMap: loader.load(require('./assets/trackLeft.png')),
			emissive: 0xffffff,
			emissiveIntensity: 1,
			shininess: 100,
			reflectivity: 1,
			transparent: true
		});
		let rightMaterial = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			map: loader.load(require('./assets/trackRight.png')),
			emissiveMap: loader.load(require('./assets/trackRight.png')),
			emissive: 0xffffff,
			emissiveIntensity: 1,
			shininess: 100,
			reflectivity: 1,
			transparent: true
		});
		let leftTrack = new THREE.Mesh(sideGeometry, leftMaterial);
		let rightTrack = new THREE.Mesh(sideGeometry, rightMaterial);
		leftTrack.position.set(-15 + this.xPos[0] - (scaleWidth * 510) / 2, this.yEndPoint, 10);
		rightTrack.position.set(15 + this.xPos[3] + (scaleWidth * 510) / 2, this.yEndPoint, 10);
		this.scene.add(leftTrack, rightTrack);

		circles.forEach((circle, i) => {
			circle.position.set(this.xPos[i], this.yEndPoint - this.key.height / 2, 3);
			circle.rotateX(0);

			setInterval(() => {
				if (this.keys.isDown(this.keys.pos[i])) {
					circle.material = this.key.pressedMats[i];
				} else {
					circle.material = this.key.materials[i];
				}
			}, 1);
			this.scene.add(this.keyLights[i]);
			this.scene.add(circle);
		});

		this.keyLights.forEach((light, i) => {
			light.position.set(this.xPos[i], this.yEndPoint + this.key.height * 3 - 5, 3);
			setInterval(() => {
				if (this.keys.isDown(this.keys.pos[i])) {
					light.material.opacity = 0.5;
				}
			}, 1);
		});
	}
}
