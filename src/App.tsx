import { Route } from "react-router-dom";
import { Router } from "./lib/electron-router-dom";
import Login from "./feature/auth/login";

export default function App() {
	return (
		<Router
			main={
				<>
					<Route path="/" element={<Login />} index />
					<Route path="/galery" element={<p>Online galery</p>} />
					<Route
						path="/offline-galery"
						element={<p>galery offline</p>}
					/>
				</>
			}
		/>
	);
}
