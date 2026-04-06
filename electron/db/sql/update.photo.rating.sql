UPDATE photos
SET rating = $rating, last_displayed = $last_displayed
WHERE album_id = $album_id AND file_path = $file_path;