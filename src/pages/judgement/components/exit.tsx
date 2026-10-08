import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import { ArrowLeftIcon } from "../../../components/icons";

/**
 * Saves ratings and goes back to the album page.
 */
export default function ExitJudgement({
	albumId,
	photos,
}: {
	albumId: string;
	photos: photo[];
}) {
	const navigate = useNavigate();

	const saveAndExit = async () => {
		await window.ipcRenderer.updatePhotosRating(albumId, photos);
		navigate(`/album?album=${albumId}`);
	};

	return (
		<Button variant="ghost" size="sm" className="-ml-3" onClick={saveAndExit}>
			<ArrowLeftIcon />
			Save &amp; exit
		</Button>
	);
}
