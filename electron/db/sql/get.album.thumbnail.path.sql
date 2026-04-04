SELECT photos.file_path as 'filePath' 
FROM photos
WHERE photos.album_id = $album_id
LIMIT 1;