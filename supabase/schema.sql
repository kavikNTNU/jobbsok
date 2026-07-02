create table job_postings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text,
  source_url text,
  raw_text text not null,
  created_at timestamptz not null default now()
);

create table extracted_skills (
  id uuid primary key default gen_random_uuid(),
  job_posting_id uuid not null references job_postings(id) on delete cascade,
  skill_name text not null,
  category text,
  created_at timestamptz not null default now()
);

create table user_skills (
  id uuid primary key default gen_random_uuid(),
  skill_name text not null,
  proficiency text,
  created_at timestamptz not null default now()
);