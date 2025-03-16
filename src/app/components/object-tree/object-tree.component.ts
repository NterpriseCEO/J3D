import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SetService } from 'src/app/services/set.service';

@Component({
	selector: 'app-object-tree',
	templateUrl: './object-tree.component.html',
	styleUrl: './object-tree.component.scss',
	standalone: false,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectTreeComponent implements OnInit {

	objectListSubscription!: Subscription;
	objectIndexSubscription!: Subscription;
	objects: TreeNode[] = [];
	selectedObject!: TreeNode;

	constructor(
		private setService: SetService,
		private changeDetector: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.setService.currentSetChange.subscribe(() => {
			this.objectListSubscription?.unsubscribe();
			this.objectListSubscription = this.setService.currentSet
				.objectListUpdated.subscribe(selectedObject => {
				this.objects = this.getObjects();
				console.log('the list', this.objects);
				this.selectedObject = this.objects[selectedObject];
				this.changeDetector.markForCheck();
			});

			this.objectIndexSubscription?.unsubscribe();
			this.objectIndexSubscription = this.setService.currentSet
				.selectedObjectIndex.subscribe(i => {
					this.selectedObject = this.objects[i];
					this.changeDetector.markForCheck();
				});
		});
	}

	selectObject(event: any) {
		this.changeDetector.markForCheck();
		this.setService.selectObjectByName(event.node.label);
	}

	getObjects(): TreeNode[] {
		return (this.setService.getSetObjects() ?? [])
			.map(obj => ({
				label: obj.name
			}));
	}

	deleteObject(name: string, event: MouseEvent) {
		event.stopPropagation();
		this.setService.deleteObjectByName(name);
	}
}
