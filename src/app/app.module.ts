import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SplitterModule } from 'primeng/splitter';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { DataViewModule } from 'primeng/dataview';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ObjectImporterComponent } from './components/object-importer/object-importer.component';
import { FormsModule } from '@angular/forms';
import { SceneViewerComponent } from './components/scene-viewer/scene-viewer.component';

@NgModule({
	declarations: [
		AppComponent,
		ObjectImporterComponent,
		SceneViewerComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		SplitterModule,
		DataViewModule
	],
	providers: [
		providePrimeNG({
			theme: {
				preset: Aura
			}
		})
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
