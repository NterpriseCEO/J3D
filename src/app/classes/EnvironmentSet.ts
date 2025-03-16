import { ArcRotateCamera, Color3, Color4, CreateDisc, CreateGround, CreateLines, CreatePlane, CreateSphere, DynamicTexture, Engine, GizmoManager, Mesh, PointLight, Scene, StandardMaterial, Vector3, Viewport } from "@babylonjs/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { BaseObject } from "./objects/BaseObject";
import { LightObject } from "./objects/lights/Lights";

export class EnvironmentSet {

	engine!: Engine;
	scene!: Scene;
	camera!: ArcRotateCamera;
	canvas!: HTMLCanvasElement;
	selectedObjectIndex: BehaviorSubject<number> = new BehaviorSubject(-1);
	objectListUpdated: Subject<any> = new Subject();
	objectUpdated: Subject<any> = new Subject();

	private isDragging: boolean = false;
	private mouseX: number = 0;
	private mouseY: number = 0;
	private objectHitDetected: boolean = false;
	private gizmoManager!: GizmoManager;

	setObjects: BaseObject[] = [];

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.initSet();
	}

	initSet() {
		this.engine = new Engine(this.canvas, true);
		this.scene = new Scene(this.engine);
		this.scene.clearColor = new Color4(0.2, 0.2, 0.2, 1);

		this.camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 15, Vector3.Zero());
		this.camera.allowUpsideDown = false;
		// Prevents zooming too far in and doing the inverted zoom thingy
		this.camera.lowerRadiusLimit = 2;
		this.camera.setTarget(Vector3.Zero());
		this.camera.attachControl(this.canvas, true);

		// Camera 2 is for the XYZ indicator visual
		const camera2 = new ArcRotateCamera('CAM2', -Math.PI / 4, 0.4 * Math.PI, 160, Vector3.Zero(), this.scene);
		camera2.layerMask = 0x10000000;
		camera2.viewport = new Viewport(0, 0, 0.1, 0.3);
		// Camera 3 is for the XYZ text
		const camera3 = new ArcRotateCamera('CAM3', -Math.PI / 4, 0.4 * Math.PI, 160, Vector3.Zero(), this.scene);
		camera3.layerMask = 0x20000000;
		camera3.viewport = new Viewport(0, 0, 0.1, 0.3);

		this.scene.activeCameras?.push(camera2);
		this.scene.activeCameras?.push(camera3);
		this.scene.activeCameras?.push(this.camera);

		// Need to make object names starting with _J3D illegal 
		const originPoint = CreateGround("_J3DSceneOriginPoint", {
			width: 10,
			height: 10,
			subdivisions: 10
		}, this.scene);
		const originPointMaterial = new StandardMaterial("OriginPointMaterial");
		originPointMaterial.wireframe = true;
		originPointMaterial.emissiveColor = new Color3(0.9, 0.9, 0.9);
		originPoint.material = originPointMaterial;

		// Shows the sizing/rotation/positioning gizmo on the screen when objects are clicked
		this.gizmoManager = new GizmoManager(this.scene);
		this.gizmoManager.positionGizmoEnabled = true;
		this.gizmoManager.rotationGizmoEnabled = true;
		this.gizmoManager.scaleGizmoEnabled = true;
		// Prevents gizmo attachment on mouse down
		this.gizmoManager.usePointerToAttachGizmos = false;

		this.gizmoManager.onAttachedToMeshObservable.add(mesh => {
			let isPointLight = false;

			// Ignores the XYZ Coords Meshes
			if(mesh?.id.startsWith("_J3D")) {
				this.gizmoManager.attachToMesh(null);
			}

			this.selectedObjectIndex.next(this.setObjects.findIndex(object => {
				// Determines which object component name to compare with
				// name of the clicked mesh
				const name = (object as LightObject)?.lightSphere
					? (object as LightObject).lightSphere.name : object.name;
				isPointLight = !!(object as LightObject)?.lightSphere;
				return mesh?.name === name;
			}));
			this.gizmoManager.rotationGizmoEnabled = !isPointLight;
			this.gizmoManager.scaleGizmoEnabled = !isPointLight;
		});

		this.gizmoManager.gizmos.positionGizmo?.onDragObservable.add(() => {
			this.setObjects[this.selectedObjectIndex.value].updateModelFromObject();
		});
		this.gizmoManager.gizmos.scaleGizmo?.onDragObservable.add(() => {
			this.setObjects[this.selectedObjectIndex.value].updateModelFromObject();
		});
		this.gizmoManager.gizmos.rotationGizmo?.onDragObservable.add(() => {
			this.setObjects[this.selectedObjectIndex.value].updateModelFromObject();
		});

		this.scene.onPointerDown = (e, pickResult) => {
			// Detects mesh clicking
			this.objectHitDetected = pickResult?.hit && e.button === 0;
			this.isDragging = false;
			this.mouseX = e.clientX;
			this.mouseY = e.clientY;
		}

		this.scene.onPointerMove = (e) => {
			const deltaX = Math.abs(e.clientX - this.mouseX);
			const deltaY = Math.abs(e.clientY - this.mouseY);

			// Detects more than 3 units of drag
			if(deltaX > 3 || deltaY > 3) {
				this.isDragging = true;
			}
		}

		this.scene.onPointerUp = (e, pickResult) => {
			// if no dragging and no object selected, deselects the current objects
			if (this.objectHitDetected && pickResult?.pickedMesh  && !this.isDragging) {
				this.gizmoManager.attachToMesh(pickResult.pickedMesh);
			}else if(!this.objectHitDetected && !this.isDragging) {
				this.gizmoManager.attachToMesh(null);
			}
		}

		this.showAxis();

		this.scene.registerBeforeRender(() => {
			// Orients cameras 2 and 3 to the scene camera
			camera3.alpha = camera2.alpha = this.camera.alpha;
			camera3.beta = camera2.beta = this.camera.beta;
		});

		this.engine.runRenderLoop(() => {
			this.scene.render();
		});
	}

	addObject(setObject: any) {
		const mesh = setObject.lightSphere
			?? setObject.setObject;
		
		this.setObjects.push(setObject);
		this.gizmoManager.attachToMesh(mesh);
		this.selectedObjectIndex.next(this.setObjects.length-1);
		this.objectListUpdated.next(this.selectedObjectIndex.value);
	}

	selectObjectByName(name: string) {
		this.selectedObjectIndex.next(this.setObjects.findIndex(i => i?.name === name));
		const object = this.setObjects[this.selectedObjectIndex.value];

		const mesh = (object as LightObject)?.lightSphere ?? object.setObject;
		this.gizmoManager.attachToMesh(mesh);
	}

	deleteSelectedObject() {
		this.setObjects[this.selectedObjectIndex.value].remove();
		this.setObjects.splice(this.selectedObjectIndex.value, 1);
		this.deselectObject();
	}

	deleteObjectByName(name: string) {
		const index = this.setObjects.findIndex(object => object.name === name);
		const selectedObjectName = this.setObjects[this.selectedObjectIndex.value]?.name;
		if(index === this.selectedObjectIndex.value) {
			this.deselectObject();
		}
		this.setObjects[index]?.remove();
		this.setObjects.splice(index, 1);
		this.selectedObjectIndex.next(this.setObjects.findIndex(i => i?.name === selectedObjectName))
		this.objectListUpdated.next(this.selectedObjectIndex.value);
	}

	updateObjectByName(name: string, path: any[], value: any): Observable<null> {
		this.setObjects.find(object => object.name === name)?.updateObject(path, value);
		this.objectListUpdated.next(this.selectedObjectIndex.value);
		return of(null);
	}

	updateObjectByIndex(path: any[], value: any, id: number = this.selectedObjectIndex.value): Observable<BaseObject | null> {
		if(id === -1) {
			return of(null);
		}
		const object = this.setObjects[id];
		object.updateObject(path, value);
		this.objectListUpdated.next(null);
		return of(object);
	}

	deselectObject() {
		this.selectedObjectIndex.next(-1);
		this.objectListUpdated.next(null);
		this.gizmoManager.attachToMesh(null);
	}

	private showAxis() {
		const size = 50;

		const xLine = CreateLines('_J3DCoordsIndicatorLineX', {
			points: [
				Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
				new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
			]
		}, this.scene);
		const yLine = CreateLines('_J3DCoordsIndicatorLineY', {
			points: [
				Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
				new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
			]
		}, this.scene);
		const zLine = CreateLines('_J3DCoordsIndicatorLineZ', {
			points: [
				Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
				new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
			]
		}, this.scene);
		const indicatorSphere = CreateSphere('_J3DCoordsIndicatorBall', { segments: 24, diameter: size * .2 }, this.scene);
		const indicatorMaterial = new StandardMaterial("_J3DCoordsIndicatorBallNaterial");
		indicatorMaterial.emissiveColor = Color3.White();
		indicatorSphere.material = indicatorMaterial;
		indicatorSphere.isPickable = false;

		const cx = this._textPlane('X');
		const cy = this._textPlane('Y');
		const cz = this._textPlane('Z');

		[xLine, yLine, zLine, indicatorSphere].forEach(mesh => mesh.layerMask = 0x10000000);

		xLine.color = new Color3(1, 0, 0);
		cx.position = new Vector3(0.9 * size, -0.05 * size, 0);
		yLine.color = new Color3(0, 1, 0);
		cy.position = new Vector3(0, 0.9 * size, -0.05 * size);
		zLine.color = new Color3(0, 0, 1);
		cz.position = new Vector3(0, 0.05 * size, 0.9 * size);
	}

	private _textPlane(text: string): Mesh {
		const dynamicTexture = new DynamicTexture('_J3DCoordsIndicatorTextTexture' + text, 128, this.scene, true);
		const indicatorText = CreatePlane('_J3DCoordsIndicatorText' + text, { size: 60 }, this.scene);//might need true here
		indicatorText.isPickable = false;
		dynamicTexture.hasAlpha = true;
		dynamicTexture.drawText(text, null, null, 'bold 20px Arial', "white", 'transparent', true);
		const material = new StandardMaterial('matXYZ', this.scene);
		material.emissiveColor = Color3.White();
		material.diffuseTexture = dynamicTexture;
		indicatorText.material = material;
		indicatorText.material.backFaceCulling = false;
		indicatorText.billboardMode = Mesh.BILLBOARDMODE_ALL;
		indicatorText.layerMask = 0x20000000;

		return indicatorText;
	}
}