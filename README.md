# Country Guide Node.js Application

## Overview
The Country Guide application provides detailed information about countries, including data on various cities. It is built with Node.js and utilizes several APIs for fetching city and country information. This project uses PM2 for process management and Nginx for reverse proxy to serve the app in a production environment.

## Setups
This README will show you 2 step of using this app
1. [Run it locally](#run-it-localy) 
2. Deployement process on two servers and a load balancer

# Run it Localy
### 1. Cloning
Clone the repository using the following command

```
git clone https://www.github.com/Nick-Lemy/country-guide.git
```

### 2. Change directory
`cd` into the project directory.
```
cd country-guide/
```

### 3. Add the API KEY of gemini api
Go into https://www.gemini.com/ and do all the asked steps to get an api key
and run the following command to add it into the .env file on the project.

```
echo 'GEMINI_APIKEY=your_api_key' > .env
```

### 4. Run the App
To run the app, all you have to do is to run this commande on your project's main directory:
 ```
node server.js
```` 
And That's all.