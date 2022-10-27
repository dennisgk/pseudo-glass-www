import React, { Fragment, useContext, useEffect } from "react";

import ThreeController from "./components/three/ThreeController";
import SceneContext from "./contexts/three/SceneContext";

const App = () => {
	const SceneContextData = useContext(SceneContext);

	return (
		<Fragment>
			<SceneContext.Provider value={SceneContextData}>
				<ThreeController />
			</SceneContext.Provider>
		</Fragment>
	);
};

export default App;
