import { Link } from "react-router-dom";
export default function Login() {
	return (
		<>
			<label htmlFor="email">Login</label>
			<input type="email" name="email" id="email" />
			<label htmlFor="">Password</label>
			<input type="password" name="email" id="email" />
			<Link to={"/galery"}>log in</Link>
			<Link to={"/offline-galery"}>offline mode</Link>
		</>
	);
}
