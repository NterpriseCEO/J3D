import { Mesh, Vector3 } from "@babylonjs/core";
import { EnvironmentSet } from "../../EnvironmentSet";
import { BaseObject } from "../BaseObject";

export class SetObject extends BaseObject {

	override setObject!: Mesh;

	constructor(set: EnvironmentSet) {
		super(set);
		this.initObject();
		super.initObject();
	}

	remove() {
		this.setObject.dispose();
	}

	override updateObject(path: any[], value: any): void {
		super.updateObject(path, value);

		switch (path[0]) {
			case "position":
				this.setObject.position = new Vector3(
					this.position.x,
					this.position.y,
					this.position.z
				);
				break;
			case "rotation":
				// Degrees to radians
				this.setObject.rotation = new Vector3(
					this.rotation.x * (Math.PI/180),
					this.rotation.y * (Math.PI / 180),
					this.rotation.z * (Math.PI / 180)
				);
				break;
			case "scale":
				this.setObject.scaling = new Vector3(
					this.scale.x,
					this.scale.y,
					this.scale.z
				);
				break;
		}
	}

	override updateModelFromObject() {
		const position = this.setObject.position;
		const rotation = this.setObject.rotation;
		const scale = this.setObject.scaling;

		this.position = {
			x: position.x,
			y: position.y,
			z: position.z 
		};
		this.scale = {
			x: scale.x,
			y: scale.y,
			z: scale.z
		};

		// Radians to degrees
		this.rotation = new Vector3(
			rotation.x * (180 / Math.PI),
			rotation.y * (180 / Math.PI),
			rotation.z * (180 / Math.PI)
		);
	}
}