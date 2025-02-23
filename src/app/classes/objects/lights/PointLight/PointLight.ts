import { EnvironmentSet } from "src/app/classes/EnvironmentSet";
import { LightObject } from "../Lights";
import { Vector3, PointLight as Light } from "@babylonjs/core";

export class PointLight extends LightObject {

	constructor(set: EnvironmentSet) {
		super(set);
	}

	override initObject() {
		const light = new Light("pointLight", Vector3.Zero(), this.set.scene);
		light.intensity = 0.7;

		this.setObject = light;

		super.initObject();
	}
}