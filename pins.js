DELETE from pin WHERE user_id = 30;
DELETE from prestarter_tree WHERE user = 30;
DELETE from incentives WHERE user = 30;
UPDATE prestarter_tree set a = NULL WHERE a = 30;


UPDATE prestarter set rgt = 5 WHERE user = 29;
UPDATE prestarter set rgt = 6 WHERE user = 24;
UPDATE prestarter set rgt = 7 WHERE user = 23;
UPDATE prestarter set rgt = 8 WHERE user = 1;

DELIMITER //
CREATE PROCEDURE leafadd (mother INT(11), child INT(11))
BEGIN

SELECT @myLeft := lft FROM prestarter WHERE user = mother;
UPDATE prestarter SET rgt = rgt + 2 WHERE rgt > @myLeft;
UPDATE prestarter SET lft = lft + 2 WHERE lft > @myLeft;

INSERT INTO prestarter(user,lft,rgt) VALUES(child, @myLeft + 1, @myLeft + 2);

END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE nonleafadd (mother INT(11), child INT(11))
BEGIN

SELECT @myRight := rgt FROM prestarter WHERE user = mother;
UPDATE prestarter SET rgt = rgt + 2 WHERE rgt >= @myRight;
UPDATE prestarter SET lft = lft + 2 WHERE lft > @myRight;

INSERT INTO prestarter(user,lft,rgt) VALUES(child, @myRight + 1, @myRight + 2);

END //
DELIMITER ;