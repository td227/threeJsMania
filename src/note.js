import * as THREE from '../node_modules/three/build/three.module.js ';

export default class Note {
	constructor(vel, keys, column, time, isSlider = false, duration = 0) {
		this.column = column;
		this.vel = vel;
		this.time = time;
		this.isSlider = isSlider;
		this.duration = duration;
		this.note = {};

		this.keys = keys;
		this.x = column;
		this.y = -10;

		this.droptime = this.time - 1000 / vel;
	}
}
