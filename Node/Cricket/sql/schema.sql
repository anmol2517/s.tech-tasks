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

create table live_score(
id int auto_increment primary key,
team1 varchar(50),
team2 varchar(50),
score1 varchar(20),
score2 varchar(20),
overs varchar(20)
);

insert into live_score(team1,team2,score1,score2,overs)
values('IND','AUS','120/2','118/3','15.2');
insert into live_score(team1,team2,score1,score2,overs)
