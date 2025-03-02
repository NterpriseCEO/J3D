import { Component, OnDestroy, OnInit } from "@angular/core";
import schema from "../../classes/objects/ObjectSchema.json";
import { SetService } from "src/app/services/set.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-object-editor",
	templateUrl: "./object-editor.component.html",
	styleUrl: "./object-editor.component.scss",
	standalone: false
})
export class ObjectEditorComponent implements OnInit, OnDestroy {

	schema: any = schema;
	model: any;
	path: any[] = [];
	selectedObjectListener!: Subscription;

	constructor(private setService: SetService) {}

	ngOnInit(): void {
		this.selectedObjectListener = this.setService.currentSet.selectedObjectIndex.subscribe(i => {
			if(i === -1) {
				return;
			}
			this.model = this.setService.currentSet.setObjects[i];

			this.path = [this.setService.currentSet.setObjects[i].name];
		});
	}

	getProperty(value: any) {
		return value;
	}

	updateObject(currentPath: any[], value: any) {
		this.setService.currentSet.updateObjectByID(currentPath, value)
	}

	deselectObject() {
		this.setService.deselectObject();
	}

	generatePath(currentPath: any[], property: string) {
		return [...currentPath, property];
	}

	ngOnDestroy(): void {
		this.selectedObjectListener.unsubscribe();
	}
}
