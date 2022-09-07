import * as THREE from 'three';
export default class Notes {
	constructor(keys) {
		this.keys = keys;

		this.vel = 0.01;

		this.score = 0;
		this.combo = 0;
		this.accuracy = 0;
		this.totalNotes = 0;
		this.hits = 0;
		this.misses = 0;

		this.listener = new THREE.AudioListener();
		this.sound = new THREE.Audio(this.listener);
		this.audioLoader = new THREE.AudioLoader();
		this.audio = require('./assets/normal-hitnormal.ogg');

		this.audioLoader.load(this.audio, (buffer) => {
			this.sound.setBuffer(buffer);
			this.sound.setLoop(false);
			this.sound.setVolume(0.5);
		});
	}

	setCheckNote(songNote, time) {
		setTimeout(() => {
			//this.sound.play();
			this.checkNote(songNote);
		}, time);
	}

	playSound() {}

	checkNote(songNote) {
		if (this.keys.isDown(this.keys.pos[songNote.column])) {
			this.score += 1;
			this.combo += 1;
			console.log(this.score);
			this.accuracy += 1;
		} else {
			this.combo = 0;
			this.accuracy -= 1;
		}

		this.totalNotes += 1;
	}
}
