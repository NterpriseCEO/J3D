import { Injectable } from "@angular/core";
import { EnvironmentSet } from "../classes/EnvironmentSet";
import { BaseObject } from "../classes/objects/BaseObject";
import { Subject } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class SetService {

	sets: EnvironmentSet[] = [];
	currentSetChange: Subject<any> = new Subject();
	currentSet!: EnvironmentSet;

	constructor() { }

	createSet(canvas: HTMLCanvasElement) {
		const set = new EnvironmentSet(canvas);
		this.currentSet = set;
		this.sets.push(set);
		this.currentSetChange.next(null);
	}

	addObjectToCurrentSet(setObject: BaseObject) {
		this.currentSet.addObject(setObject);
	}

	countSetObjects() {
		return this.currentSet.setObjects.length;
	}

	getSetObjects() {
		return this.currentSet?.setObjects;
	}

	selectObjectByName(name: string) {
		this.currentSet.selectObjectByName(name);
	}

	deselectObject() {
		this.currentSet.deselectObject();
	}

	deleteSelectedObject() {
		this.currentSet.deleteSelectedObject();
	}

	deleteObjectByName(name: string) {
		this.currentSet.deleteObjectByName(name);
	}
}
