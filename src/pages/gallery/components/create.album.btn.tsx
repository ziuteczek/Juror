import { useState } from "react";
import CreateAlbumModal from "./create.album.modal";
import Button from "../../../components/button";
import { PlusIcon } from "../../../components/icons";

/**
 * @returns Button and modal for creating new album.
 * @see CreateAlbumModal
 */
export default function CreateAlbumBtn() {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			<Button variant="primary" onClick={() => setModalOpen(true)}>
				<PlusIcon />
				New album
			</Button>

			{modalOpen && (
				<CreateAlbumModal onClose={() => setModalOpen(false)} />
			)}
		</>
	);
}
