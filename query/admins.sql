create table admins (
  id serial primary key,
  email text unique not null,
  password text not null,
  role text check(role in ('admin', 'school-admin', 'teacher', 'student')) not null default 'student',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);