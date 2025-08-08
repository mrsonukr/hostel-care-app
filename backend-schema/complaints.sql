CREATE TABLE complaints (
  id  PRIMARY KEY,

  student_roll VARCHAR NOT NULL,
  student_name VARCHAR NOT NULL, -- ✅ added student name

  category VARCHAR NOT NULL,
  subcategory VARCHAR,
  description TEXT,
  photos JSON, -- ✅ JSON array of photo URLs

  room_number VARCHAR NOT NULL,
  hostel_name VARCHAR NOT NULL,

  status ENUM('pending', 'in_progress', 'resolved', 'rejected') DEFAULT 'pending' NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  in_progress_at TIMESTAMP,
  resolved_at TIMESTAMP,
  rejected_at TIMESTAMP,

  warden_id  NOT NULL, -- ✅ last status updater
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
                      ON UPDATE CURRENT_TIMESTAMP
);
