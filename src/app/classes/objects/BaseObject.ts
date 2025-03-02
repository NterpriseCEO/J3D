import { Vector3 } from "@babylonjs/core";
import { EnvironmentSet } from "../EnvironmentSet";
import { LightObject } from "./lights/Lights";

export class BaseObject {

	set: EnvironmentSet;

	setObject!: any;
	name: string = "";
	position: {
		x: number,
		y: number,
		z: number
	} = { x: 0, y: 0, z:0 };
	rotation: {
		x: number,
		y: number,
		z: number
	} = { x: 0, y: 0, z: 0 };
	scale: {
		x: number,
		y: number,
		z: number
	} = { x: 1, y: 1, z: 1 };

	constructor(set: EnvironmentSet) {
		this.set = set;
	}

	initObject() {
		this.name = this.setObject.name;
	}

	updateObject(path: any[], value: any) {
		path = path.slice(1);
		this.setPropertyByPath(this, JSON.parse(JSON.stringify(path)), value);

		// The changed property
		switch (path[0]) {
			case "name":
				this.name = value;
				this.setObject.name = value;
				this.setObject.id = value;
				break;
			default:
				break;
		}
	}

	setPropertyByPath(object: any, path: any[], value: string): any {
		const property = path.splice(0, 1)[0];
		if(path.length > 0) {
			return this.setPropertyByPath(object[property], path, value)
		}else {
			object[property ] = value;
		}
	}

	updateModelFromObject() {}
}