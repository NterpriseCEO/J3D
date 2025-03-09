import { ArcRotateCamera, Engine, GizmoManager, PointLight, Scene, Vector3 } from "@babylonjs/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { SetObject } from "./objects/shapes/Object";
import { BaseObject } from "./objects/BaseObject";
import { LightObject } from "./objects/lights/Lights";

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

	setObjects: BaseObject[] = [];

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
			let isPointLight = false;
			this.selectedObjectIndex.next(this.setObjects.findIndex(object => {
				// Determines which object component name to compare with
				// name of the clicked mesh
				const name = (object as LightObject)?.lightSphere
					? (object as LightObject).lightSphere.name : object.name;
				isPointLight = !!(object as LightObject)?.lightSphere;
				console.log(isPointLight, typeof object);
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
		
		this.setObjects.push(setObject);
		this.gizmoManager.attachToMesh(mesh);
		this.selectedObjectIndex.next(this.setObjects.length-1);
	}

	deleteSelectedObject() {
		this.setObjects[this.selectedObjectIndex.value].remove();
		this.deselectObject();
	}

	updateObjectByName(name: string, path: any[], value: any): Observable<null> {
		this.setObjects.find(object => object.name === name)?.updateObject(path, value);
		return of(null);
	}

	updateObjectByIndex(path: any[], value: any, id: number = this.selectedObjectIndex.value): Observable<BaseObject | null> {
		if(id === -1) {
			return of(null);
		}
		const object = this.setObjects[id];
		object.updateObject(path, value);

		return of(object);
	}

	deselectObject() {
		this.selectedObjectIndex.next(-1);
		this.gizmoManager.attachToMesh(null);
	}
}