import { useCallback, useContext, useEffect, useState } from "react";

import * as THREE from "three";
import SceneContext from "../../contexts/three/SceneContext";
import SetupMainScene from "../../io/scenes/MainScene";

const ThreeController = () => {
	const SceneContextData = useContext(SceneContext);

	const initializeThree = useCallback(() => {
		return SetupMainScene(SceneContextData);
	}, []);

	useEffect(() => {
		return initializeThree();
	}, []);

	return <canvas id="threecanvas"></canvas>;
};

export default ThreeController;
