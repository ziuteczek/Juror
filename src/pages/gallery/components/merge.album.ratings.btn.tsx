import Button from "../../../components/button";
import { MergeIcon } from "../../../components/icons";

/**
 * Lets user pick exported ratings files (.json) and merge them into one spreadsheet.
 */
export default function MergeAlbumRatingsBtn() {
	return (
		<Button
			onClick={() => window.ipcRenderer.mergeAlbumRatings()}
			title="Combine exported rating files (.json) into one spreadsheet"
		>
			<MergeIcon />
			Merge ratings
		</Button>
	);
}
