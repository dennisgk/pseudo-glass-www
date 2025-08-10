import * as THREE from "three";
import { SceneContextType } from "../../contexts/three/SceneContext";

const vertexShaderText = `
attribute vec3 center;
varying vec3 vCenter;

void main() {

	vCenter = center;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
`;

const fragmentShaderText = `
uniform float thickness;

varying vec3 vCenter;

void main() {

	vec3 afwidth = fwidth( vCenter.xyz );

	vec3 edge3 = smoothstep( ( thickness - 1.0 ) * afwidth, thickness * afwidth, vCenter.xyz );

	float edge = 1.0 - min( min( edge3.x, edge3.y ), edge3.z );

	gl_FragColor.rgb = gl_FrontFacing ? vec3( 0.9, 0.9, 1.0 ) : vec3( 0.4, 0.4, 0.5 );
	gl_FragColor.a = edge;

}
`;

const clamp = (num: number, min: number, max: number) =>
	Math.min(Math.max(num, min), max);

const setupAttributes = (geometry: THREE.BufferGeometry) => {
	geometry.deleteAttribute( 'normal' );
	geometry.deleteAttribute( 'uv' );

	const vectors = [
		new THREE.Vector3( 1, 0, 0 ),
		new THREE.Vector3( 0, 1, 0 ),
		new THREE.Vector3( 0, 0, 1 )
	];

	const position = geometry.attributes.position;
	const centers = new Float32Array( position.count * 3 );

	for ( let i = 0, l = position.count; i < l; i ++ ) {

		vectors[ i % 3 ].toArray( centers, i * 3 );

	}

	geometry.setAttribute( 'center', new THREE.BufferAttribute( centers, 3 ) );
}

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
	camera.position.setZ(5);

	const curve = new THREE.CubicBezierCurve3(
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 0, 2, 0 ),
		new THREE.Vector3( 2, 2, 0 ),
		new THREE.Vector3( 2, 0, 0 ),
	);
	curve.arcLengthDivisions = 200;
	curve.updateArcLengths();

	const geometry = new THREE.BoxGeometry(1, 1, 1);

	setupAttributes( geometry );

	const material = new THREE.ShaderMaterial({
		uniforms:{
			thickness: {
				value: 5,
			},
		},
		vertexShader: vertexShaderText,
		fragmentShader: fragmentShaderText,
		side: THREE.DoubleSide,
		alphaToCoverage: true,
	});
	material.extensions.derivatives = true;
	//const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);

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

		curve.getPointAt(curU, cube.position);
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
