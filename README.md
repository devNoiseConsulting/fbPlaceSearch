# fbPlaceSearch
Script to pull places from Facebook's Graph API and convert to geoJSON

## Setup
(Note: Assuming a bash environment.)

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

Run `npm install` to get the dependencies.

An Facebook application will need to be created for this script work. Save the `APP_ID` and `APP_SECRET` into a file named `.env`.

Run `source .env` to initialize the environment variables.

Run `npm start` to fire off the script.
