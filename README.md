# score-builder-web-app
Frontend web app for the Score Builder project.

# Use
First off - clone all repositories to separate directories (see `docker-compose.yml` for naming convention),
then copy `docker-compose.yml` to the root directory. The file structure should look like this:
```
- root/
--- front/
----- ...
--- users/
----- ...
--- scores/
----- ...
--- tokens/
----- ...
--- name_gen/
----- ...
--- docker-compose.yml
```
Then head in the terminal to the root directory and run `docker-compose up --build`. After that the app should be available on `localhost:3000`.
