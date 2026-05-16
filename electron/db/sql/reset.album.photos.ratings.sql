update photos
SET rating = NULL, last_rated = NULL
WHERE album_id = $album_id;