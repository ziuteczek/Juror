PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS albums (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    -- max rating that the photo from given album can get
    max_rating INTEGER NOT NULL CHECK(max_rating >= 2 AND max_rating <= 10),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_path TEXT NOT NULL,
    rating REAL,
    last_displayed INTEGER,
    album_id TEXT FOREIGN KEY NOT NULL,
    FOREIGN KEY (album_id) REFERENCES album(id) ON DELETE CASCADE
);