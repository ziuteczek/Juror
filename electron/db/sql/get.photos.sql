SELECT file_path as 'filePath', rating, last_displayed as 'lastDisplay'
FROM photos
WHERE album_id = $album_id;