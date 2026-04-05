update photos
SET rating = NULL, last_displayed = NULL
WHERE album_id = $album_id;