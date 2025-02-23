import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AxesViewer, Color3, CreateBox, CreateSphere, Engine, GizmoManager, HemisphericLight, Material, PointLight, Scene, StandardMaterial, UniversalCamera, Vector3 } from '@babylonjs/core';
import { AdvancedDynamicTexture, Rectangle, TextBlock } from "@babylonjs/gui";
import { SetService } from 'src/app/services/set.service';

@Component({
	selector: 'app-scene-viewer',
	templateUrl: './scene-viewer.component.html',
	styleUrl: './scene-viewer.component.scss',
	standalone: false
})
export class SceneViewerComponent implements AfterViewInit {

	@ViewChild("canvas") canvas!: ElementRef<HTMLCanvasElement>;
	@ViewChild("canvasWrapper") canvasWrapper!: ElementRef<HTMLElement>;

	constructor(private setService: SetService) {}

	ngAfterViewInit() {
		const canvas = this.canvas.nativeElement;
		new ResizeObserver(() => {
			const componentDimensions = this.canvasWrapper.nativeElement.getBoundingClientRect();
			canvas.width = componentDimensions.width;
			canvas.height = componentDimensions.height;
			console.log(componentDimensions)
		}).observe(this.canvasWrapper.nativeElement);

		this.setService.createSet(canvas);
	}
}
