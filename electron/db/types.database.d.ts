//prettier-ignore
export type returnWrapper<T> ={
	success: true,
	data: T,
	error:null
} | { 
	success: false,
	data: null,
	error: unknown,
};

export interface photo {
	id: string;
	title: string;
	path: string;
	rating: number | null;
	lastTimeDisplayed: Date | null;
}

export interface albumData {
	albumId: string;
	albumName: string;
	createdAt: Date;
}

export interface album extends albumData {
	photos: photo[];
}
