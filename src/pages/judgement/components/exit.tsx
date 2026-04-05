import { Link, useNavigate } from "react-router-dom";
import exitIcon from "../../../assets/exit.icon.svg";

export default function ExitJudgement({
	albumId,
	photos,
}: {
	albumId: string;
	photos: photo[];
}) {
	const navigate = useNavigate();

	const saveData = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();
		(async () => {
			await window.ipcRenderer.updatePhotosRating(albumId, photos);
			navigate(`/album?album=${albumId}`);
		})();
	};

	return (
		<Link to={"/"} onClick={saveData}>
			<img
				src={exitIcon}
				alt=""
				className="max-w-20 max-h-20 size-full"
			/>
		</Link>
	);
}
