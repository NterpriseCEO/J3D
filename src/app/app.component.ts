import { AfterViewInit, Component, TemplateRef, ViewChild } from "@angular/core";
import { SetService } from "./services/set.service";
import { Splitter } from "primeng/splitter";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
	standalone: false
})
export class AppComponent implements AfterViewInit {
	title = "j3d";

	@ViewChild('splitter') splitter!: Splitter;
	
	splitterPanels: TemplateRef<any>[] = [];

	constructor(private setService: SetService) {}

	ngAfterViewInit() {
		this.splitterPanels = this.splitter.panels;
		// A workaround to hide/show the properties splitter panel
		this.setService.currentSet.selectedObjectIndex.subscribe(i => {
			if(i === -1) {
				this.splitter.panels = [this.splitter.panels[0], this.splitter.panels[1]];
			}else {
				this.splitter.panels = [...this.splitterPanels];
			}
			this.splitter.cd.markForCheck();
		});
	}

	hasSelectedObject() {
		return this.setService.currentSet.selectedObjectIndex.value !== -1;
	}
}
