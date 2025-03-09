import { EnvironmentSet } from "src/app/classes/EnvironmentSet";
import { SetObject } from "../Object";
import { CreateTorus } from "@babylonjs/core";

export class Torus extends SetObject {

	constructor(set: EnvironmentSet) {
		super(set);
	}

	override initObject() {
		this.setObject = CreateTorus("Torus", {}, this.set.scene);
		this.setName("Torus");
	}
}