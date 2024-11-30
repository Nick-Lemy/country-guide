# Country Guide Node.js Application

The Country Guide application provides detailed information about countries, including data on various cities. It is built with Node.js and utilizes several APIs for fetching city and country information. This project uses PM2 for process management and Nginx for reverse proxy to serve the app in a production environment.

## Setups
This README will show you 2 step of using this app
1. [Run it locally](#a-run-it-localy) 
2. [Deployment process on two servers and a load balancer](#b-servers-deployment-process)

## A. Run it Localy
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
```
And That's all

## B. Servers Deployment Process
For this part, I have created two bash scripts that automate this work, one of the servers that are handling the requests (web-01 and web-02 in our case). Plus every steps are very well explained. last but not least, I will explain in this README file how I deployed (The entire process).

Note: The files are within the directory `deployment_files` and their names are: s`setup_web-01_web-02`, and `setup_lb-01`

### 1. Web 01 and Web 02

