CREATE TABLE school_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES school_admin_auth(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    school_name TEXT NOT NULL UNIQUE,
    phone TEXT,
    created_at TIMESTAMP DEFAULT now()
);
