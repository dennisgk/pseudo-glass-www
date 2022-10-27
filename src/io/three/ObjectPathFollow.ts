import * as THREE from "three";
import BezierQuaternionObj from "./BezierQuaternionObj";

class ObjectPathFollow {
	#sectors: BezierQuaternionObj[] = [];
	#arcLengthDivisions: number = 200;

	constructor(sectors: BezierQuaternionObj[]) {
		this.setSectors(sectors);
	}

	setSectors = (sectors: BezierQuaternionObj[]) => {
		this.#sectors = sectors;
		this.setArcLengthsOfAll(this.#arcLengthDivisions);
	};

	setArcLengthsOfAll = (newLeng: number) => {
		this.#arcLengthDivisions = newLeng;
		for (let i = 0; i < this.getSectorNumber(); i++) {
			this.#sectors[i].bez.arcLengthDivisions = this.#arcLengthDivisions;
			this.#sectors[i].bez.updateArcLengths();
		}
	};

	getArcLengthsOfAll = () => {
		return this.#arcLengthDivisions;
	};

	getSectorNumber = () => {
		return this.#sectors.length;
	};

	getPointAt = (u: number) => {
		if (u <= 0) {
			return this.#sectors[0].bez.getPoint(0);
		}
		if (u >= 1) {
			return this.#sectors[this.getSectorNumber() - 1].bez.getPoint(1);
		}

		let alongEntireStationNum = this.getSectorNumber() * u;
		let alongEntireStationNumFloored = Math.floor(alongEntireStationNum);

		return this.#sectors[alongEntireStationNumFloored].bez.getPointAt(
			alongEntireStationNum - alongEntireStationNumFloored
		);
	};

	getQuatAt = (u: number) => {
		if (u <= 0) {
			return this.#sectors[0].qslerp.slerp(0);
		}
		if (u >= 1) {
			return this.#sectors[this.getSectorNumber() - 1].qslerp.slerp(1);
		}

		let alongEntireStationNum = this.getSectorNumber() * u;
		let alongEntireStationNumFloored = Math.floor(alongEntireStationNum);

		return this.#sectors[alongEntireStationNumFloored].qslerp.slerp(
			alongEntireStationNum - alongEntireStationNumFloored
		);
	};

	getSpacedPoints = (numberPoints: number) => {
		if (numberPoints == 0 || numberPoints == 1) {
			return [];
		}

		let retPoints = new Array(numberPoints);

		for (let i = 0; i < numberPoints; i++) {
			if (i == 0) {
				retPoints[i] = this.getPointAt(0);
				continue;
			}
			if (i == numberPoints - 1) {
				retPoints[i] = this.getPointAt(1);
				continue;
			}

			let alongEntire = i / (numberPoints - 1);
			retPoints[i] = this.getPointAt(alongEntire);
		}

		return retPoints;
	};

	createDebugLine = (
		numberPoints?: number | undefined,
		lineColor?: THREE.ColorRepresentation | undefined
	) => {
		if (numberPoints == undefined) {
			numberPoints = 50;
		}
		if (lineColor == undefined) {
			lineColor = 0xff0000;
		}

		let points = this.getSpacedPoints(numberPoints);
		let geometry = new THREE.BufferGeometry().setFromPoints(points);
		let material = new THREE.LineBasicMaterial({ color: lineColor });

		return new THREE.Line(geometry, material);
	};

	applyToObject = (obj: THREE.Object3D, u: number) => {
		let curPos = this.getPointAt(u);
		let curQuat = this.getQuatAt(u);

		obj.position.copy(curPos);
		obj.quaternion.copy(curQuat);
	};
}

export default ObjectPathFollow;
