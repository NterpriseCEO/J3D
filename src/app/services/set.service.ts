import { Injectable } from "@angular/core";
import { EnvironmentSet } from "../classes/EnvironmentSet";
import { BaseObject } from "../classes/objects/BaseObject";

@Injectable({
	providedIn: "root"
})
export class SetService {

	sets: EnvironmentSet[] = [];
	currentSet!: EnvironmentSet;

	constructor() { }

	createSet(canvas: HTMLCanvasElement) {
		const set = new EnvironmentSet(canvas);
		this.currentSet = set;
		this.sets.push(set);
	}

	addObjectToCurrentSet(setObject: BaseObject) {
		this.currentSet.addObject(setObject);
	}

	countSetObjects() {
		return this.currentSet.setObjects.length;
	}

	getSetObjects() {
		return this.currentSet.setObjects;
	}

	selectObjectByName(name: string) {
		this.currentSet.selectedObjectIndex.next(this.currentSet.setObjects.findIndex(i => i?.name === name));
	}

	deselectObject() {
		this.currentSet.selectedObjectIndex.next(-1);
		this.currentSet.deselectObject();
	}
}
