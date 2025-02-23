import { AdvancedDynamicTexture, Rectangle, TextBlock } from "@babylonjs/gui";
import { EnvironmentSet } from "../../EnvironmentSet";
import { Color3, CreateSphere, Mesh, StandardMaterial } from "@babylonjs/core";

export class LightObject {

	set: EnvironmentSet;
	setObject: any;
	rect!: Rectangle;
	lightSphere!: Mesh;


	constructor(set: EnvironmentSet) {
		this.set = set;
		this.initObject();
	}

	initObject() {
		const lightSphere = CreateSphere("lightSphere", { diameter: 1 }, this.set.scene);
		lightSphere.position = this.setObject.position;
		const material = new StandardMaterial("light");
		material.emissiveColor = new Color3(1, 1, 1);
		lightSphere.material = material;

		const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
		advancedTexture.renderScale = 1;

		// Create a Rectangle for the label
		const rect = new Rectangle();
		rect.width = "200px";
		rect.height = "40px";
		rect.cornerRadius = 10;
		rect.color = "White";
		rect.thickness = 2;
		rect.background = "black";
		advancedTexture.addControl(rect);

		// Create a TextBlock inside the rectangle
		const text = new TextBlock();
		text.text = "Point Light Source";
		text.color = "white";
		text.fontSize = 20;
		rect.addControl(text);

		// Attach the widget to the light's sphere position
		rect.linkWithMesh(lightSphere);
		rect.linkOffsetY = -50; // Position slightly above the light

		this.lightSphere = lightSphere;
		this.rect = rect;
	}

	remove() {
		this.setObject.dispose();
		this.rect.dispose();
		this.lightSphere.dispose();
	}
}