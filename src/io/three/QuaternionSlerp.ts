import * as THREE from "three";

class QuaternionSlerp {
	#fQuat: THREE.Quaternion | undefined = undefined;
	#eQuat: THREE.Quaternion | undefined = undefined;

	constructor(
		fQuat?: THREE.Quaternion | undefined,
		eQuat?: THREE.Quaternion | undefined
	) {
		this.#fQuat = fQuat;
		this.#eQuat = eQuat;
	}

	slerp = (t: number) => {
		let ret = new THREE.Quaternion(1, 0, 0, 0);
		if (this.#fQuat == undefined || this.#eQuat == undefined) {
			return ret;
		}

		if (t <= 0) {
			ret.copy(this.#fQuat);
			return ret;
		}
		if (t >= 1) {
			ret.copy(this.#eQuat);
			return ret;
		}

		ret.slerpQuaternions(this.#fQuat, this.#eQuat, t);
		return ret;
	};
}

export default QuaternionSlerp;
