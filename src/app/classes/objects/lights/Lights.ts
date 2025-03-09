import { AdvancedDynamicTexture, Rectangle, TextBlock } from "@babylonjs/gui";
import { EnvironmentSet } from "../../EnvironmentSet";
import { Color3, CreateSphere, Mesh, StandardMaterial, Vector3 } from "@babylonjs/core";
import { BaseObject } from "../BaseObject";
import { Observable, of } from "rxjs";

export class LightObject extends BaseObject {

	override setObject: any;
	rect: Rectangle = new Rectangle();
	text: TextBlock = new TextBlock();
	lightSphere!: Mesh;

	constructor(set: EnvironmentSet) {
		super(set);
		this.initObject();
	}

	override initObject() {
		this.lightSphere = CreateSphere(this.name + "_lightSphere", { diameter: 1 }, this.set.scene);
		this.lightSphere.position = this.setObject.position;
		const material = new StandardMaterial("light");
		material.emissiveColor = new Color3(1, 1, 1);
		this.lightSphere.material = material;

		const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
		advancedTexture.renderScale = 1;

		// Create a Rectangle for the label
		this.rect.width = "300px";
		this.rect.height = "40px";
		this.rect.cornerRadius = 10;
		this.rect.color = "White";
		this.rect.thickness = 2;
		this.rect.background = "black";
		advancedTexture.addControl(this.rect);

		// Create a TextBlock inside the rectangle
		this.text.text = this.name;
		this.text.color = "white";
		this.text.fontSize = 20;
		this.rect.addControl(this.text);

		// Attach the widget to the light's sphere position
		this.rect.linkWithMesh(this.lightSphere);
		this.rect.linkOffsetY = -70; // Position slightly above the light
	}

	override updateObject(path: any[], value: any): Observable<BaseObject> {
		super.updateObject(path, value);

		switch (path[0]) {
			case "name":
				this.setName(value);
				break;
			case "position":
				// Degrees to radians
				this.setObject.position = this.lightSphere.position = new Vector3(
					this.position.x,
					this.position.y,
					this.position.z
				);
				break;
		}

		return of(this);
	}

	override setName(prefix: string): string {
		const newName = super.setName(prefix);
		this.lightSphere.name = newName + "_lightSphere";
		this.lightSphere.id = newName + "_lightSphere";
		this.text.text = newName;

		return newName;
	}

	override updateModelFromObject() {
		const position = this.lightSphere.position;
		const rotation = this.lightSphere.rotation;

		this.position = {
			x: position.x,
			y: position.y,
			z: position.z
		};

		// Radians to degrees
		this.rotation = new Vector3(
			rotation.x * (180 / Math.PI),
			rotation.y * (180 / Math.PI),
			rotation.z * (180 / Math.PI)
		);
	}

	override remove() {
		this.setObject.dispose();
		this.rect.dispose();
		this.lightSphere.dispose();
	}
}