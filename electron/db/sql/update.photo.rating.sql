UPDATE photos
SET rating = $rating, last_rated = $last_rated
WHERE album_id = $album_id AND file_path = $file_path;