# Country Guide

The Country Guide application provides detailed information about countries.

loom video of the presentation(DO NOT FORGET TO PUT THE SPEED AT 1x For a better watching experience): https://www.loom.com/share/e18b7ac113c440f4a0a0c0833f27b50e

## Setup
This README will show you the steps to use this app and the challenges faced. It also includes the credentials of the APIs used.
1. [Run it locally](#a-run-it-locally)
2. [Deployment process on two servers and a load balancer](#b-servers-deployment-process)
3. [Challenges encountered during development](#c-challenges)

## A. Run it Locally
### 1. Cloning
Clone the repository using the following command:

```
git clone https://www.github.com/Nick-Lemy/country-guide.git
```

### 2. Change directory
`cd` into the project directory:
```
cd country-guide/
```

### 3. Add the API KEY of Gemini API
Go to https://ai.google.dev/api?lang=node and follow the steps to get an API key. Then run the following command to add it to the .env file in the project:

```
echo 'GEMINI_APIKEY=your_api_key' > .env
```

### 4. Run the App
To run the app, execute the following command in your project's main directory:
```
node server.js
```
And that's all.

## B. Servers Deployment Process
For this part, I have created two bash scripts that automate this work for the servers handling the requests (web-01 and web-02 in our case). Every step is well explained. Lastly, I will explain in this README file how I deployed the entire process.

Note: The files are within the directory `deployment_files` and their names are: `setup_web-01_web-02`, and `setup_lb-01`.

### 1. Web 01 and Web 02
#### a. Update everything and install Node.js and npm
First, ensure that you are in the home directory, then update everything on your servers and install Node.js, its essentials, and of course nvm. Set it to version 18 so that npm also runs the latest version to avoid some issues.
```
cd ~
sudo apt update && sudo apt upgrade
curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs
sudo apt-get install build-essential
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
source ~/.bashrc
sudo nvm install 18
sudo nvm use 18
```

#### b. Set the repository
Clone the repository, cd into it, and install all the needed libraries to ensure everything is going to be alright.
```
sudo git clone https://www.github.com/Nick-Lemy/country-guide
cd country-guide
sudo npm install axios
sudo npm install express
sudo npm install dotenv
```

#### c. API KEY
Create the .env file and put your GEMINI API key there so that you can use it in your app. Otherwise, it won't be able to fetch the data because we ignored the .env file when we pushed for security and privacy purposes.
```
echo 'GEMINI=my_api_key' > .env
```

#### d. Set PM2
PM2 is a Node.js library that helps you deploy your Express server on your localhost in the background. It's more secure. So, install PM2 and start your server.js file on it.
```
sudo npm install -g pm2
pm2 start server.js --interpreter $(which node)
```

#### e. Set NGINX
Now that our app is already running on a certain port, we need to use NGINX as a proxy to forward the NGINX server to that app running on the PM2 server. Modify the NGINX `sites-available/default` file config by running the following script:
```
sudo apt install nginx
new_config=\
"server {
        listen 80 default_server;
        listen [::]:80 default_server;
        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;
        server_name _;
        add_header X-Served-By \$hostname;
        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_cache_bypass \$http_upgrade;
        }
        if (\$request_filename ~ redirect_me){
            rewrite ^ https://th3-gr00t.tk/ permanent;
        }
        error_page 404 /error_404.html;
        location = /error_404.html {
            internal;
        }
}
"
sudo chown -R ubuntu:ubuntu /etc/nginx/sites-available/default
echo "$new_config" > /etc/nginx/sites-available/default
```

This script first installs NGINX, then stores the content we want to put in the default site-available file inside a variable. It changes the owner of the file so that we can remove the previous content and put what we want. The new_config forwards port 80 of NGINX to port 3000 of our app running in the background thanks to the PM2 library.

#### Restart NGINX
After executing all these commands, restart NGINX to update it.
```
sudo service nginx restart
```

### 2. Load Balancer (lb-01)
For the load balancer, ensure that it's balancing the requests sent to the site between web-01 and web-02. Set up HAProxy.
- Install it:
```
sudo apt install haproxy
```
- Create a new config content for the HAProxy config file

Explanation: The new config file sets up round-robin balancing. The last two lines contain the names and IPs of web-01 and web-02. Replace them with your own if you are using your servers.

```
new_config=\
"
defaults
  mode http
  timeout client 15s
  timeout connect 10s
  timeout server 15s
  timeout http-request 10s

frontend clickviral-tech-frontend
    bind *:80
    default_backend clickviral-tech-backend

backend clickviral-tech-backend
    balance roundrobin
    server 6329-web-01 54.167.52.204:80 check
    server 6329-web-02 34.228.244.169:80 check
"
```
- Replace the haproxy.conf file with the new one created and restart HAProxy:
```
sudo chown -R ubuntu:ubuntu /etc/nginx/sites-available/default
echo "$new_config" > /etc/nginx/sites-available/default

sudo service haproxy restart
```

Well, this is it. Now let's talk about the problems I faced doing this.

## C. Challenges
I encountered many challenges when trying to build and deploy my app. The main reason was that it has a backend, which was new to me. I used Express. These challenges are the following:
### 1. Securing my API key
I didn't know about .gitignore and environment variables stored in a file (.env). I researched, understood it, but still had to find the Node.js library that could extract data from an .env file. It was challenging, but I found a library called dotenv and used it.
### 2. Deploying an app with a backend
I knew that choosing to use a backend would make it difficult to deploy. I first deleted my Express and tried to use only the front end and the fetch function of Node to get data from APIs. But I still couldn't get my API key from the .env file. I spent hours struggling and finally decided to go back to the backend app. I found a library called PM2 that does it perfectly. It was amazing!
### 3. Forwarding my NGINX to my PM2
I had already built and deployed my app on my server, but it was just running on the server without any server handler like NGINX or Apache2. I wondered if my application was secure. I found a way to make NGINX do the job for me and found a piece of script on StackOverflow that does it when it is inside the default site available of NGINX (precisely in the location /{} component).

## D. Credits
This amazing Country Guide application uses two APIs: Gemini AI Text Generator API for the description, and Country Info API. Here are the links to access them:
- Gemini Developer API: https://ai.google.dev/api?lang=node
- Country Info API: https://countryinfoapi.com/

Notes: Unlike Gemini, Country Info API does not need an API key.

##
This was a very instructive project. It helped me understand how APIs and backends work. I even tried to add a user authentication feature but didn't have enough time. Still, I went through the process of building it thanks to this project. I hope next year will be as interesting as this project was! Thanks, sir, for everything and see you next year!
