# score-builder-web-app
Frontend web app for the Score Builder project.
Here are the URLs for the other services used in this project:
- https://github.com/DavidGildour/score-builder-scores-service
- https://github.com/DavidGildour/score-builder-users-service
- https://github.com/DavidGildour/score-builder-tokens-service
- https://github.com/DavidGildour/score-builder-name-gen

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
