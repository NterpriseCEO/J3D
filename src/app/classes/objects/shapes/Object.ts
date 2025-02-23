import { Mesh } from "@babylonjs/core";
import { EnvironmentSet } from "../../EnvironmentSet";

export class SetObject {

	set: EnvironmentSet;
	setObject!: Mesh;

	constructor(set: EnvironmentSet) {
		this.set = set;
		this.initObject();
	}

	initObject() {}

	remove() {
		this.setObject.dispose();
	}
}