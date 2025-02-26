CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES teacher_auth(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES school_admins(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject TEXT,
    phone TEXT,
    created_at TIMESTAMP DEFAULT now()
);
