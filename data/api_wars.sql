DROP TABLE IF EXISTS public.users;
CREATE TABLE users (
    id serial NOT NULL PRIMARY KEY,
    username text,
    password text,
    registration_date timestamp without time zone
);