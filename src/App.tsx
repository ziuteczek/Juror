import { Route } from "react-router-dom";
import { Router } from "./lib/electron-router-dom";
import Login from "./feature/auth/page-login";
import Gallery from "./feature/gallery/page";
import Judgement from "./feature/judgement/page";

export default function App() {
	return (
		<Router
			main={
				<>
					<Route path="/" element={<Login />} index />
					<Route path="/gallery" element={<p>Online gallery</p>} />
					<Route path="/offline-gallery" element={<Gallery />} />
					<Route path="/judgement" element={<Judgement />} />
				</>
			}
		/>
	);
}
