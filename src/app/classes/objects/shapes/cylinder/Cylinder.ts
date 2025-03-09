import { EnvironmentSet } from "src/app/classes/EnvironmentSet";
import { SetObject } from "../Object";
import { CreateCylinder } from "@babylonjs/core";

export class Cylinder extends SetObject {

	constructor(set: EnvironmentSet) {
		super(set);
	}

	override initObject() {
		this.setObject = CreateCylinder("Cylinder", {}, this.set.scene);
		this.setName("Cylinder");
	}
}