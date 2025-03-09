import { EnvironmentSet } from "../EnvironmentSet";
import schema from "../../classes/objects/BaseObjectSchema.json";
import { Observable, of } from "rxjs";

export class BaseObject {

	set: EnvironmentSet;
	schema: any = schema;

	setObject!: any;
	name: string = "";
	position: {
		x: number,
		y: number,
		z: number
	} = { x: 0, y: 0, z:0 };
	rotation: {
		x: number,
		y: number,
		z: number
	} = { x: 0, y: 0, z: 0 };
	scale: {
		x: number,
		y: number,
		z: number
	} = { x: 1, y: 1, z: 1 };

	constructor(set: EnvironmentSet) {
		this.set = set;
	}

	initObject() {}

	updateObject(path: any[], value: any): Observable<BaseObject> {
		path.splice(0, 1);
		this.setPropertyByPath(this, JSON.parse(JSON.stringify(path)), value);
		// The changed property
		switch (path[0]) {
			case "name":
				this.setName(value);
				break;
			default:
				break;
		}

		return of(this);
	}

	setPropertyByPath(object: any, path: any[], value: string): any {
		const property = path.splice(0, 1)[0];
		if(path.length > 0) {
			return this.setPropertyByPath(object[property], path, value)
		}else {
			object[property ] = value;
		}
	}

	setName(prefix: string): string {
		// checks if the last character is a number
		const lastCharacter = parseInt(prefix[prefix.length - 1]);
		let number = isNaN(lastCharacter) ? 0 : lastCharacter;
		let newName = prefix;
		// increments the number at the end until the object name is unique
		while(this.set.setObjects.find(object => object.name === newName && object !== this)) {
			number++;
			// replaces the number at the end if it exists
			if(!isNaN(lastCharacter)) {
				prefix = prefix.substring(0, prefix.length-1);
			}
			newName = prefix + number;
		}
		this.name = newName;
		this.setObject.name = newName;
		this.setObject.id = newName;

		return newName;
	}

	remove() {
		console.log('hello');
		this.setObject.dispose();
	}

	updateModelFromObject() {}

	mergeProps() {}
}