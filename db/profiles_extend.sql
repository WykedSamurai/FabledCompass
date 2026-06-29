-- Fabled Compass: extend profiles table with professional folio columns
-- Run this in the Supabase SQL Editor AFTER profiles.sql

alter table profiles
  add column if not exists headline          text,
  add column if not exists location         text,
  add column if not exists about            text,
  add column if not exists email_public     text,
  add column if not exists phone            text,
  add column if not exists website          text,
  add column if not exists linkedin_url     text,
  add column if not exists portfolio_url    text,
  add column if not exists skills           text,
  add column if not exists experience       text,
  add column if not exists education        text,
  add column if not exists resume_text      text,
  add column if not exists resume_file_path text,
  add column if not exists profile_visibility text not null default 'private',
  add column if not exists show_public_email  boolean not null default false,
  add column if not exists show_phone         boolean not null default false,
  add column if not exists show_location      boolean not null default true,
  add column if not exists show_resume        boolean not null default false;
