SELECT
  a.id AS albumId,
  a.name AS albumName,
  a.max_rating AS maxRating,
  a.created_at AS createdAt,
  COALESCE(
    (
      SELECT json_group_array(
        json_object(
          'filePath', p.file_path,
          'rating', p.rating,
          'lastDisplay', p.last_displayed
        )
      )
      FROM photos p
      WHERE p.album_id = a.id
    ),
    '[]'
  ) AS photos
FROM albums a
WHERE a.id = $album_id;