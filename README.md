# Pilot prototype 

## Installation

This project works with *nodejs* and requires the *npm* packet manager.

The project then builds the javascript in a single minimised file using *webpack*.

``
sudo npm install webpack -g
``

To build the project you should run

``
npm install
``

Then to run it

``
npm start
``

To re-package the scripts after applying changes, run directly 
``
npm run webpack
``


## Project structure 

```
|-- client           // Client-side code before compiling 
|   |-- css
|   |-- js
|-- server           // Server side code
|   |-- main.js      // Server main app file 
|-- public
|   |-- img
|   `-- css          // Created automatically after install
|   `-- js           // Created automatically after install
|-- config           // webpack config files
`-- node_modules
|-- build.sh         // Build support script
|-- package.json     // npm config file
```

## Heroku deployment
