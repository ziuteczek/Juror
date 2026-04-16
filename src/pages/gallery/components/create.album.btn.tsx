import { useState } from "react";
import plusIcon from "../../../assets/plus.icon.svg";
import CreateAlbumModal from "./create.album.modal";

/**
 * @returns Button and modal for creating new album.
 * @see CreateAlbumModal
 */
export default function CreateAlbumBtn() {
	const [createAlbumVisible, setCreateAlbumVisible] = useState(false);

	return (
		<>
			<button
				onClick={() => setCreateAlbumVisible(true)}
				className="max-h-50 max-w-50 font-bold text-xl cursor-pointer text-left"
			>
				New album
				<img src={plusIcon} alt="plus svg" className="bg-green-400 size-full" />
			</button>

			<CreateAlbumModal
				isVisible={createAlbumVisible}
				setIsVisible={setCreateAlbumVisible}
			/>
		</>
	);
}
