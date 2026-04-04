SELECT
  a.id AS album_id,
  a.name AS album_name,
  a.max_rating,
  a.created_at,
  COALESCE(
    (
      SELECT json_group_array(
        json_object(
          'id', p.id,
          'file_path', p.file_path,
          'rating', p.rating,
          'last_displayed', p.last_displayed
        )
      )
      FROM photos p
      WHERE p.album_id = a.id
    ),
    '[]'
  ) AS photos
FROM albums a
WHERE a.id = $album_id;