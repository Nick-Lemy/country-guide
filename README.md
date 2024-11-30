# Country Guide Node.js Application

## Overview
The Country Guide application provides detailed information about countries, including data on various cities. It is built with Node.js and utilizes several APIs for fetching city and country information. This project uses PM2 for process management and Nginx for reverse proxy to serve the app in a production environment.

## Setups
This README will show you 2 step of using this app
1. Run it locally 
2. Deployement process on two servers and a load balancer server

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

# Servers Deployment Process
## Prerequisites
Before setting up the application, ensure that you have the following:
- A server running Ubuntu (or a compatible Linux distribution).
- SSH access to the server.
- Basic knowledge of using the command line.

or, you can just run the files that I

## Setup Instructions

### 1. Prepare the Server
These instructions will help you set up the server to run the Country Guide app.

#### Step 1: Update Your System
Run the following commands to update your server's packages:
```bash
cd ~
sudo apt update && sudo apt upgrade -y
```

#### Step 2: Install Node.js
This step sets up Node.js (version 16) on your server:
```bash
curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs
sudo apt-get install build-essential
```

#### Step 3: Clone the Repository
Clone the Country Guide repository to your server:
```bash
sudo git clone https://www.github.com/Nick-Lemy/country-guide
```

#### Step 4: Install NVM (Node Version Manager)
NVM is used to manage multiple Node.js versions. The following commands install NVM and set up Node.js version 18:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
source ~/.bashrc
sudo nvm install 18
sudo nvm use 18
```

#### Step 5: Install Dependencies
Change to the project directory and install the necessary Node.js packages:
```bash
cd country-guide
sudo npm install -g pm2
sudo npm install axios
```

#### Step 6: Start the Application with PM2
PM2 is used to manage the Node.js process in the background. Start your app with the following command:
```bash
pm2 start server.js --interpreter $(which node)
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
systemctl status pm2-ubuntu
```

#### Step 7: Install and Configure Nginx
Install Nginx and set it up to act as a reverse proxy for your Node.js app:
```bash
sudo apt install nginx
```
Create a new configuration for Nginx:
```bash
new_config="server {
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
}"
```
Update the Nginx configuration:
```bash
sudo chown -R ubuntu:ubuntu /etc/nginx/sites-available/default
echo "$new_config" > /etc/nginx/sites-available/default
sudo service nginx restart
```

## API Usage
This project utilizes various APIs for fetching country information(capitale, flag, population, languages spoken, currency, region and description). The main API used is the Countries & Cities API, which provides detailed data on cities around the world. You can find the official documentation here. Plus it uses the Gemini API to generate a Description of the Country

## Challenges and Solutions
- **Challenge:** Setting up Node.js on the server.
  - **Solution:** I followed the official documentation to install the latest stable version of Node.js and used NVM to manage versions.
- **Challenge:** Managing the app process in the background.
  - **Solution:** I used PM2 to ensure the app runs continuously and restarts automatically if the server is rebooted.
- **Challenge:** Setting up Nginx for reverse proxy.
  - **Solution:** I configured Nginx to forward requests from the public domain to the locally running Node.js application.

## Credits
- Node.js for providing the runtime environment.
- PM2 for process management.
- Nginx for reverse proxy.
- Axios for making HTTP requests.
- Countries & Cities API for providing city data.
- Gemini API for the Description

## Bash Script: setup_country_guide.sh
```bash
#!/bin/bash

# Update system
cd ~
sudo apt update && sudo apt upgrade -y

# Install Node.js (v16)
curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs
sudo apt-get install build-essential

# Clone the Country Guide repository
sudo git clone https://www.github.com/Nick-Lemy/country-guide

# Install NVM and Node.js v18
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
source ~/.bashrc
sudo nvm install 18
sudo nvm use 18

# Install project dependencies
cd country-guide
sudo npm install -g pm2
sudo npm install axios

# Start the app with PM2
pm2 start server.js --interpreter $(which node)
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
systemctl status pm2-ubuntu

# Install and configure Nginx
sudo apt install nginx

new_config="server {
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
}"

# Update Nginx config and restart
sudo chown -R ubuntu:ubuntu /etc/nginx/sites-available/default
echo "$new_config" > /etc/nginx/sites-available/default
sudo service nginx restart

echo "Setup complete!"
```
This script automates the entire process described above. To use it, simply save the content into a file (e.g., `setup_country_guide.sh`), make it executable, and run it on your server:
```bash
chmod +x setup_country_guide.sh
./setup_country_guide.sh
```
