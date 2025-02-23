import { NgModule } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { BrowserModule } from '@angular/platform-browser';
import { TabsModule } from 'primeng/tabs';

import { ObjectImporterComponent } from './object-importer/object-importer.component';
import { SceneViewerComponent } from './scene-viewer/scene-viewer.component';
import { StandardObjectsSelectorComponent } from './standard-objects-selector/standard-objects-selector.component';

@NgModule({
	declarations: [
		ObjectImporterComponent,
		SceneViewerComponent,
		StandardObjectsSelectorComponent
	],
	imports: [
		BrowserModule,
		DataViewModule,
		AccordionModule,
		InputTextModule,
		TabsModule
	],
	exports: [
		ObjectImporterComponent,
		SceneViewerComponent,
		StandardObjectsSelectorComponent
	]
})
export class ComponentsModule { }
