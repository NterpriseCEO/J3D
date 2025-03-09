import { EnvironmentSet } from "src/app/classes/EnvironmentSet";
import { SetObject } from "../Object";
import { CreatePlane } from "@babylonjs/core";

export class Plane extends SetObject {

	constructor(set: EnvironmentSet) {
		super(set);
	}

	override initObject() {
		this.setObject = CreatePlane("Plane", {}, this.set.scene);
		this.setName("Plane");
	}
}