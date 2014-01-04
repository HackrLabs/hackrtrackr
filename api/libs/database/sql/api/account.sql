CREATE TABLE accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  accountName varchar(100) not null,
  subdomin varchar(100) not null,
  isActive boolean default true
);
