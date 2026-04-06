INSERT INTO photos (file_path, album_id)
VALUES ($file_path, $album_id)
RETURNING *;