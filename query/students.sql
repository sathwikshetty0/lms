CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    age INTEGER NOT NULL,
    class TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE students
ADD COLUMN school_admin_id UUID REFERENCES school_admins(id) ON DELETE CASCADE;
