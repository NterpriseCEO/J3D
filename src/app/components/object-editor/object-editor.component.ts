import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { SetService } from "src/app/services/set.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-object-editor",
	templateUrl: "./object-editor.component.html",
	styleUrl: "./object-editor.component.scss",
	standalone: false
})
export class ObjectEditorComponent implements OnInit, OnDestroy {

	@ViewChild('outlet', { read: ViewContainerRef }) outletRef!: ViewContainerRef;
	@ViewChild('object', { read: TemplateRef }) contentRef!: TemplateRef<any>;

	schema: any;
	model: any;
	path: any[] = [];
	selectedObjectListener!: Subscription;

	constructor(
		private setService: SetService,
		private changeDetector: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.selectedObjectListener = this.setService.currentSet.selectedObjectIndex.subscribe(i => {
			if(i === -1) {
				return;
			}
			const object = this.setService.currentSet.setObjects[i];
			this.schema = object.schema;
			this.model = object;

			this.path = [object.name];
		});
	}

	getProperty(value: any) {
		return value;
	}

	updateObject(currentPath: any[], value: any) {
		this.setService.currentSet.updateObjectByIndex(currentPath, value);
	}

	deselectObject() {
		this.setService.deselectObject();
	}

	deleteObject() {
		this.setService.deleteSelectedObject();
	}

	generatePath(currentPath: any[], property: string) {
		return [...currentPath, property];
	}

	ngOnDestroy() {
		this.selectedObjectListener.unsubscribe();
	}
}
