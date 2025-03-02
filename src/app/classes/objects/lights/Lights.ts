import { AdvancedDynamicTexture, Rectangle, TextBlock } from "@babylonjs/gui";
import { EnvironmentSet } from "../../EnvironmentSet";
import { Color3, CreateSphere, Mesh, StandardMaterial, Vector3 } from "@babylonjs/core";
import { BaseObject } from "../BaseObject";

export class LightObject extends BaseObject {

	override setObject: any;
	rect: Rectangle = new Rectangle();
	text: TextBlock = new TextBlock();
	lightSphere!: Mesh;

	constructor(set: EnvironmentSet) {
		super(set);
		this.initObject();
		super.initObject();
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
		this.rect.width = "200px";
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
		this.rect.linkOffsetY = -50; // Position slightly above the light
	}

	override updateObject(path: any[], value: any): void {
		super.updateObject(path, value);

		switch (path[0]) {
			case "name":
				this.lightSphere.name = value + "_lightSphere";
				
				this.text.text = value;
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

	remove() {
		this.setObject.dispose();
		this.rect.dispose();
		this.lightSphere.dispose();
	}
}