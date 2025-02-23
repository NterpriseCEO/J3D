import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { PointLight } from 'src/app/classes/objects/lights/PointLight/PointLight';
import { Capsule } from 'src/app/classes/objects/shapes/capsule/Capsule';
import { Cube } from 'src/app/classes/objects/shapes/cube/Cube';
import { Cylinder } from 'src/app/classes/objects/shapes/cylinder/Cylinder';
import { Disc } from 'src/app/classes/objects/shapes/disc/Disc';
import { Plane } from 'src/app/classes/objects/shapes/plane/Plane';
import { Sphere } from 'src/app/classes/objects/shapes/sphere/Sphere';
import { Torus } from 'src/app/classes/objects/shapes/torus/Torus';
import { SetService } from 'src/app/services/set.service';

@Component({
	selector: 'app-standard-objects-selector',
	templateUrl: './standard-objects-selector.component.html',
	styleUrl: './standard-objects-selector.component.scss',
	standalone: false,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandardObjectsSelectorComponent {

	objectTypes: Record<string, any> = {
		Capsule,
		Cube,
		Cylinder,
		Disc,
		Plane,
		Sphere,
		Torus
	};
	lightTypes: Record<string, any> = {
		PointLight
	}

	constructor(private setService: SetService) {}

	addObject(objectName: string, records: Record<string, any>) {
		// Picks the object or light from the appropriate record list and adds it to the screen
		const setObject = new records[objectName](this.setService.currentSet);
		this.setService.addObjectToCurrentSet(setObject);
	}

	getNames(recordsToFilter: Record<string, any>): {type: string }[] {
		// Converts from record to keys
		return Object.keys(recordsToFilter).map(type => ({ type: type }));
	}

	filter(dv: DataView, event: Event) {
		dv.filter((event.target as HTMLInputElement).value);
	}
}
