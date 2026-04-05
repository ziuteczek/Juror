import { Link, useNavigate } from "react-router-dom";
import exitIcon from "../../../assets/exit.icon.svg";


export default function ExitJudgement({
	albumPath,
	// albumData,
}: {
	albumPath: string;
	// albumData: photo[];
}) {
	const navigate = useNavigate();

	const saveData = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();
		(async () => {
			// await saveAlbumData(albumPath, albumData);
			navigate(`/album?album=${albumPath}`);
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
