CREATE TABLE members(
  memberid integer not null primary key autoincrement,
  firstname varchar(50) not null,
  lastname varchar(50) not null,
  emailaddress varchar(200) not null,
  mailingaddress varchar(200) not null,
  city varchar(100) not null,
  state varchar(100) not null,
  zipcode varchar(10),
  country varchar(100),
  handle varchar(100),
  phonenumber varchar(15),
  joindate date,
  dob date,
  accessStartTime time default '00:00:00',
  accessEndTime time default '23:59:59',
  isActive boolean default true,
  isEmployee boolean default false,
  pin integer''
);
