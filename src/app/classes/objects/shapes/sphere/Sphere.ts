import { EnvironmentSet } from "src/app/classes/EnvironmentSet";
import { SetObject } from "../Object";
import { CreateSphere } from "@babylonjs/core";

export class Sphere extends SetObject {

	constructor(set: EnvironmentSet) {
		super(set);
	}

	override initObject() {
		this.setObject = CreateSphere("sphere", {}, this.set.scene);
	}
}