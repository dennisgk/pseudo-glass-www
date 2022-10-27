import React, { Context, createContext, Provider } from "react";
import * as THREE from "three";

type SceneContextType = {
	test: string | undefined;
	renderer: THREE.WebGLRenderer | undefined;
};

const SceneContext: Context<SceneContextType> = createContext<SceneContextType>(
	{
		test: undefined,
		renderer: undefined,
	}
);

export type { SceneContextType };
export default SceneContext;
