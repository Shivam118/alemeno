# Getting Started with the Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and [ExpressJS](https://expressjs.com/en/5x/api.html) powered by Node Runtime v18.0.0.

## Available Scripts

In the project directory, you have to first change the directory to the <b>UI folder</b> and then install the necessary packages using the following command:

You have to run npm install 3 times for different directories:

Complete Project - [_within root directory_]

```
npm install
```

Frontend

```
cd .\apps\ui
npm install
```

Backend

```
cd .\apps\server
npm install
```

To Initialize the project, you have to run the following command from root directory:

### `turbo run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

Backend will be automatically running on [http://localhost:5000](http://localhost:5000), So Keep your 5000 port free.\
You can also check the server using [http://localhost:5000/test](http://localhost:5000/test) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Project Structure

```bash
├───apps
│   ├───server
│   │   ├───controllers
│   │   ├───db
│   │   ├───routes
│   │   └───config
│   └───ui
│       ├───public
│       └───src
│           ├───components
│           ├───pages
│           ├───redux
│           └───styles
└───node_modules
```

## Project Description

This project is a simple CRUD application with a login system.\
The project is divided into two parts:\
Server - Backend \
UI - Frontend \
JSON File - Database (Local)

The server is built using ExpressJS and the UI is built using ReactJS and Redux.\
The server is connected to a local JSON File as a Database.\
The UI is connected to the server using Axios. \
The state in UI is managed by Redux. \
The UI is built using Material UI.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

To learn ExpressJS, check out the [ExpressJS documentation](https://expressjs.com/en/5x/api.html).
