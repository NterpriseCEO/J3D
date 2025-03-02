import { NgModule } from "@angular/core";
import { DataViewModule } from "primeng/dataview";
import { AccordionModule } from "primeng/accordion";
import { InputTextModule } from "primeng/inputtext";
import { BrowserModule } from "@angular/platform-browser";
import { TabsModule } from "primeng/tabs";
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';

import { ObjectImporterComponent } from "./object-importer/object-importer.component";
import { SceneViewerComponent } from "./scene-viewer/scene-viewer.component";
import { StandardObjectsSelectorComponent } from "./standard-objects-selector/standard-objects-selector.component";
import { ObjectEditorComponent } from "./object-editor/object-editor.component";
import { FormsModule } from "@angular/forms";

@NgModule({
	declarations: [
		ObjectImporterComponent,
		SceneViewerComponent,
		StandardObjectsSelectorComponent,
		ObjectEditorComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		DataViewModule,
		AccordionModule,
		InputTextModule,
		TabsModule,
		InputNumberModule,
		ButtonModule,
		FieldsetModule
	],
	exports: [
		ObjectImporterComponent,
		SceneViewerComponent,
		StandardObjectsSelectorComponent,
		ObjectEditorComponent
	]
})
export class ComponentsModule { }
