import { EnvironmentSet } from "src/app/classes/EnvironmentSet";
import { SetObject } from "../Object";
import { CreateDisc } from "@babylonjs/core";

export class Disc extends SetObject {

	constructor(set: EnvironmentSet) {
		super(set);
	}

	override initObject() {
		this.setObject = CreateDisc("Disc", {}, this.set.scene);
		this.setName("Disc");
	}
}