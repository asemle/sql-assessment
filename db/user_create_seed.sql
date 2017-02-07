-- It may be helpful to drop and reinstantilize the table when doing
-- the tests in case you delete users/cars the tests are expecting to see
DROP TABLE IF EXISTS USERS;

CREATE TABLE USERS (
  id serial,
  firstname text,
  lastname text,
  email text
);
INSERT INTO USERS
(firstname, lastname, email)
VALUES
( 'John', 'Smith', 'John@Smith.com'),
( 'Dave', 'Davis', 'Dave@Davis.com'),
( 'Jane', 'Janis', 'Jane@Janis.com');
