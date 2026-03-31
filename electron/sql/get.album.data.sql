SELECT *
FROM photos
JOIN albums ON albums.id = photos.album_id
WHERE photos.album_id = $album_id;