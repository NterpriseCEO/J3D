import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { SetService } from "src/app/services/set.service";

@Component({
	selector: "app-scene-viewer",
	templateUrl: "./scene-viewer.component.html",
	styleUrl: "./scene-viewer.component.scss",
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
		}).observe(this.canvasWrapper.nativeElement);

		this.setService.createSet(canvas);
	}
}
