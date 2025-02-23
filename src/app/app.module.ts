import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SplitterModule } from "primeng/splitter";
import Aura from "@primeng/themes/aura";
import { providePrimeNG } from "primeng/config";
import { DataViewModule } from "primeng/dataview";
import { FormsModule } from "@angular/forms";
import { AccordionModule } from "primeng/accordion";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ComponentsModule } from "./components/components.module";

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		SplitterModule,
		DataViewModule,
		AccordionModule,
		BrowserAnimationsModule,
		ComponentsModule
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
