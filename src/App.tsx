import { Route } from "react-router-dom";
import { Router } from "./lib/electron-router-dom";

import Gallery from "./feature/gallery/page";
import Judgement from "./feature/judgement/page";
import HomePage from "./feature/index/page";

export default function App() {
	return (
		<Router
			main={
				<>
					<Route path="/" element={<HomePage />} index />
					<Route path="/offline-gallery" element={<Gallery />} />
					<Route path="/judgement" element={<Judgement />} />
				</>
			}
		/>
	);
}
