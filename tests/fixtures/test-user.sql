-- Disposable account for the isolated CI database.
INSERT INTO Users (FirstName, LastName, Login, Password)
VALUES ('CI', 'Student', 'ci_student', 'fixture-only');
