CnREATE TABLE accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  accountName varchar(100) not null,
  merchant varchar(100) not null,
  isActive boolean default true
);
