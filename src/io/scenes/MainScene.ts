import * as THREE from "three";
import { SceneContextType } from "../../contexts/three/SceneContext";
import BezierQuaternionObj from "../three/BezierQuaternionObj";
import ObjectPathFollow from "../three/ObjectPathFollow";
import QuaternionSlerp from "../three/QuaternionSlerp";

const clamp = (num: number, min: number, max: number) =>
	Math.min(Math.max(num, min), max);

const SetupMainScene = (SceneContextData: SceneContextType) => {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	const renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector("#threecanvas") as HTMLCanvasElement,
	});

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.position.setZ(20);

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);

	let objPathFollow = new ObjectPathFollow([
		new BezierQuaternionObj(
			new THREE.CubicBezierCurve3(
				new THREE.Vector3(0, 0, 0),
				new THREE.Vector3(2, 0, 0),
				new THREE.Vector3(2, 2, 0),
				new THREE.Vector3(0, 2, 0)
			),
			new QuaternionSlerp(
				cube.quaternion.clone(),
				cube.quaternion.clone()
			)
		),
	]);

	scene.add(cube);

	const onWindowResize = () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	};

	let curU = 0;
	const onScroll = (ev: WheelEvent) => {
		let scr = Math.sign(ev.deltaY) * 0.05;
		curU = clamp(curU + scr, 0, 1);

		objPathFollow.applyToObject(cube, curU);
	};

	window.addEventListener("resize", onWindowResize);
	window.addEventListener("wheel", onScroll);

	const animate = () => {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	};

	animate();

	return () => {
		window.removeEventListener("resize", onWindowResize);
		window.removeEventListener("wheel", onScroll);
	};
};

export default SetupMainScene;
