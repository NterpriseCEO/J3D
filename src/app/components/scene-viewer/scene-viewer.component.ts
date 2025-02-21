import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AxesViewer, Color3, CreateBox, CreateSphere, Engine, GizmoManager, HemisphericLight, Material, PointLight, Scene, StandardMaterial, UniversalCamera, Vector3 } from '@babylonjs/core';
import { AdvancedDynamicTexture, Rectangle, TextBlock } from "@babylonjs/gui";

@Component({
	selector: 'app-scene-viewer',
	templateUrl: './scene-viewer.component.html',
	styleUrl: './scene-viewer.component.scss',
	standalone: false
})
export class SceneViewerComponent implements AfterViewInit {

	@ViewChild("canvas") canvas!: ElementRef<HTMLCanvasElement>;
	@ViewChild("canvasWrapper") canvasWrapper!: ElementRef<HTMLElement>;

	engine!: Engine;
	scene!: Scene;
	camera!: UniversalCamera;

	constructor() {}

	ngAfterViewInit() {
		const canvas = this.canvas.nativeElement;
		new ResizeObserver(() => {
			const componentDimensions = this.canvasWrapper.nativeElement.getBoundingClientRect();
			canvas.width = componentDimensions.width;
			canvas.height = componentDimensions.height;
			console.log(componentDimensions)
		}).observe(this.canvasWrapper.nativeElement);
		
		this.engine = new Engine(canvas, true);
		this.scene = new Scene(this.engine);

		this.camera = new UniversalCamera('camera1', new Vector3(0, 1, -20), this.scene);
		this.camera.setTarget(Vector3.Zero());
		this.camera.attachControl(canvas, true);

		const light = new PointLight("pointLight", new Vector3(0, 20, 0), this.scene);
		light.intensity = 0.7;

		const lightSphere = CreateSphere("lightSphere", { diameter: 3 }, this.scene);
		lightSphere.position = light.position;
		const material = new StandardMaterial("mat1");
		material.emissiveColor = new Color3(1, 1, 1);
		lightSphere.material = material;

		const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
		advancedTexture.renderScale = 4;

		// Create a Rectangle for the label
		const rect = new Rectangle();
		rect.width = "100px";
		rect.height = "40px";
		rect.cornerRadius = 10;
		rect.color = "White";
		rect.thickness = 2;
		rect.background = "black";
		advancedTexture.addControl(rect);

		// Create a TextBlock inside the rectangle
		const text = new TextBlock();
		text.text = "Light Source";
		text.color = "white";
		text.fontSize = 10;
		rect.addControl(text);

		// Attach the widget to the light's sphere position
		rect.linkWithMesh(lightSphere);
		rect.linkOffsetY = -50; // Position slightly above the light

		const gizmoManager = new GizmoManager(this.scene);
		gizmoManager.positionGizmoEnabled = true;
		gizmoManager.rotationGizmoEnabled = true;
		gizmoManager.scaleGizmoEnabled = true;

		CreateBox('box', {
			size: 10
		})

		this.engine.runRenderLoop(() => {
			this.scene.render();
		});
	}
}
