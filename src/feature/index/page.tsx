import { Link } from "react-router-dom";

export default function HomePage() {
	return (
		<div className="flex justify-center items-center h-svh flex-col">
			<Link
				to={"offline-gallery"}
				className="uppercase bg-green-700 hover:bg-green-900 text-white py-5 px-10 text-2xl"
			>
				Your gallery
			</Link>
            <Link to={"/"} className="text-stone-700 text-xl">settings</Link>
		</div>
	);
}
