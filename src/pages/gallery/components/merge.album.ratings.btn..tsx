import mergeIcon from "../../../assets/merge.icon.svg";

export default function MergeAlbumratings() {
	return (
		<button
			className="max-h-50 max-w-50 font-bold text-xl cursor-pointer text-left"
			onClick={() => window.ipcRenderer.mergeAlbumRatings()}
		>
			Merge album ratings
			<img
				src={mergeIcon}
				alt="plus svg"
				className="bg-cyan-400 size-full p-3"
			/>
		</button>
	);
}
