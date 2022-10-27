import * as THREE from "three";
import QuaternionSlerp from "./QuaternionSlerp";

class BezierQuaternionObj {
	bez: THREE.CubicBezierCurve3;
	qslerp: QuaternionSlerp;

	constructor(bez: THREE.CubicBezierCurve3, qslerp: QuaternionSlerp) {
		this.bez = bez;
		this.qslerp = qslerp;
	}
}

export default BezierQuaternionObj;
