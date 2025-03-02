import { ArcRotateCamera, Engine, GizmoManager, Scene, Vector3 } from "@babylonjs/core";
import { BehaviorSubject, Subject } from "rxjs";
import { SetObject } from "./objects/shapes/Object";

export class EnvironmentSet {

	engine!: Engine;
	scene!: Scene;
	camera!: ArcRotateCamera;
	canvas!: HTMLCanvasElement;
	selectedObjectIndex: BehaviorSubject<number> = new BehaviorSubject(-1);
	objectUpdated: Subject<any> = new Subject();

	private isDragging: boolean = false;
	private mouseX: number = 0;
	private mouseY: number = 0;
	private objectHitDetected: boolean = false;
	private gizmoManager!: GizmoManager;

	setObjects: any[] = [];

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.initSet();
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
		this.gizmoManager = new GizmoManager(this.scene);
		this.gizmoManager.positionGizmoEnabled = true;
		this.gizmoManager.rotationGizmoEnabled = true;
		this.gizmoManager.scaleGizmoEnabled = true;

		this.gizmoManager.onAttachedToMeshObservable.add(mesh => {
			this.selectedObjectIndex.next(this.setObjects.findIndex(object => {
				// Determines which object component name to compare with
				// name of the click mesh
				const name = object instanceof SetObject
					? object.name : object.lightSphere.name;
				return mesh?.name === name
			}));
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

		this.scene.onPointerUp = () => {
			// if no dragging and no object selected, deselects the current objects
			if(!this.objectHitDetected && !this.isDragging) {
				this.gizmoManager.attachToMesh(null);
				this.selectedObjectIndex.next(-1);
			}
		}

		this.engine.runRenderLoop(() => {
			this.scene.render();
		});
	}

	addObject(setObject: any) {
		const mesh = setObject.lightSphere
			?? setObject.setObject;
		
		this.gizmoManager.attachToMesh(mesh);
		this.setObjects.push(setObject);
		this.selectedObjectIndex.next(this.setObjects.length-1);
	}

	updateObjectByName(path: any[], value: any) {
		this.setObjects.find(object => object.name === path[0]).updateObject(path, value);
	}

	updateObjectByID(path: any[], value: any, id: number = this.selectedObjectIndex.value) {
		if(id === -1) {
			return;
		}
		console.log(this.setObjects[id]);
		this.setObjects[id].updateObject(path, value);
	}

	deselectObject() {
		this.gizmoManager.attachToMesh(null);
	}
}