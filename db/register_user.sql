INSERT INTO users
(is_admin, username, hash)
VALUES
($1, $2, $3)
returning *;
--what does this do^