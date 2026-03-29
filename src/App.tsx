import { Route } from "react-router-dom";
import { Router } from "./lib/electron-router-dom";

import Gallery from "./feature/gallery/page";
import Judgement from "./feature/judgement/page";
// import HomePage from "./feature/index/page";
import Album from "./feature/album/page";

export default function App() {
	return (
		<Router
			main={
				<>
					<Route path="/" element={<Gallery />}  index/>
					<Route path="/judgement" element={<Judgement />} />
					<Route path="/album" element={<Album />} />
				</>
			}
		/>
	);
}
