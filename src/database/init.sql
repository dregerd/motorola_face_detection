DROP TABLE IF EXISTS face_detection;
CREATE TABLE face_detection (
    id INTEGER PRIMARY KEY,
    status VARCHAR DEFAULT "pending" NOT NULL,
    face_count INT,
    image_location VARCHAR NOT NULL
)