create database if not exists cricket_careers;
use cricket_careers;

create table players(
  id int auto_increment primary key,
  name varchar(100),
  country varchar(50),
  matches int,
  runs int,
  centuries int
);

insert into players(name,country,matches,runs,centuries) values
('Virat Kohli','India',275,12898,46),
('Rohit Sharma','India',258,10709,31),
('Joe Root','England',161,6207,16),
('Steve Smith','Australia',151,5544,12),
('Kane Williamson','New Zealand',161,6554,13);
