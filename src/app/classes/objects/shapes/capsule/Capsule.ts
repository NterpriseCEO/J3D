import { CreateCapsule } from "@babylonjs/core";
import { SetObject } from "../Object";
import { EnvironmentSet } from "src/app/classes/EnvironmentSet";

export class Capsule extends SetObject {

	constructor(set: EnvironmentSet) {
		super(set);
	}

	override initObject() {
		this.setObject = CreateCapsule("ribbon", {}, this.set.scene);  //scene is
	}
}