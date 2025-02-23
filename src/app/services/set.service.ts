import { Injectable } from '@angular/core';
import { EnvironmentSet } from '../classes/EnvironmentSet';
import { SetObject } from '../classes/objects/shapes/Object';

@Injectable({
	providedIn: 'root'
})
export class SetService {

	sets: EnvironmentSet[] = [];
	currentSet!: EnvironmentSet;

	constructor() { }

	createSet(canvas: HTMLCanvasElement) {
		const set = new EnvironmentSet(canvas);
		this.currentSet = set;
		set.initSet();
		this.sets.push(set);
	}

	addObjectToCurrentSet(setObject: SetObject) {
		this.currentSet.addObject(setObject);
	}

	countSetObjects() {
		return this.currentSet.setObjects.length;
	}

	setObjects() {
		return this.currentSet.setObjects;
	}
}
