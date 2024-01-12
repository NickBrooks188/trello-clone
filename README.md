# Trello Clone

This is a clone of the organization website Trello (named Jello). The site works as a kanban-style task management system, featuring Atlassian's drag and drop library.

[Live demo link](https://workspace-deployed.onrender.com/)

## Technologies used
* JavaScript
* CSS
* HTML5
* Python
* Flask
* PostgresSQL
* React
* Redux
* AWS S3
* Atlassian's react-beautiful-dnd package

## Getting started

1. Clone this repository.

2. Install dependencies.

   ```bash
   pipenv install -r requirements.txt
   ```

3. Create a __.env__ file based on the example with proper settings for your
   development environment.

4. Make sure the SQLite3 database connection URL is in the __.env__ file.

5. Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention.**

6. Get into your pipenv, migrate your database, seed your database, and run your
   Flask app (back in root folder):

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

   The backend will run on port 8000 by default.

7. To run the React frontend in development, open a new terminal instance and `cd` into the __react-vite__
   directory and run `npm i` to install dependencies. Next, run `npm run build`
   to create the `dist` folder. Finally, run `npm run dev` to launch the frontend in your local browser.

   ## Application screenshots

   ### Landing Page

   ### Dashboard

   ### Board Page

   ## Sample Endpoints