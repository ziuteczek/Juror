SELECT photos.file_path 
FROM photos
WHERE photos.album_id = $album_id
ORDER BY photos.id
LIMIT 1;