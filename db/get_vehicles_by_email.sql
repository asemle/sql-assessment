SELECT * FROM VEHICLES
JOIN USERS on OWNERID = USERS.ID
WHERE USERS.EMAIL = $1;