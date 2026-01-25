create database if not exists cricket_careers;
use cricket_careers;
create table players(
  id int auto_increment primary key,
  name varchar(150),
  matches int,
  runs int,
  centuries int,
  profile text
);
