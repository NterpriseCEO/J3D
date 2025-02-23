import { ArcRotateCamera, Engine, GizmoManager, Scene, Vector3 } from "@babylonjs/core";
import { SetObject } from "./objects/shapes/Object";
import { LightObject } from "./objects/lights/Lights";

export class EnvironmentSet {

	engine!: Engine;
	scene!: Scene;
	camera!: ArcRotateCamera;
	canvas!: HTMLCanvasElement

	setObjects: (SetObject | LightObject)[] = [];

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
	}

	initSet() {
		this.engine = new Engine(this.canvas, true);
		this.scene = new Scene(this.engine);

		this.camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 15, Vector3.Zero());
		this.camera.allowUpsideDown = false;
		// Prevents zooming too far in and doing the inverted zoom thingy
		this.camera.lowerRadiusLimit = 2;
		this.camera.setTarget(Vector3.Zero());
		this.camera.attachControl(this.canvas, true);

		// Shows the sizing/rotation/positioning gizmo on the screen when objects are clicked
		const gizmoManager = new GizmoManager(this.scene);
		gizmoManager.positionGizmoEnabled = true;
		gizmoManager.rotationGizmoEnabled = true;
		gizmoManager.scaleGizmoEnabled = true;

		this.engine.runRenderLoop(() => {
			this.scene.render();
		});
	}

	addObject(setObject: SetObject) {
		this.setObjects.push(setObject)
	}
}