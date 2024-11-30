# Country Guide Node.js Application

The Country Guide application provides detailed information about countries, including data on various cities. It is built with Node.js and utilizes several APIs for fetching city and country information. This project uses PM2 for process management and Nginx for reverse proxy to serve the app in a production environment.

## Setups
This README will show you 2 step of using this app and the last part is for the problem faced. and credential of the API used.
1. [Run it locally](#a-run-it-localy) 
2. [Deployment process on two servers and a load balancer](#b-servers-deployment-process)
3. [Problem during the process]()

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
#### a. Update everything and install nodejs and npm
First I had to ensure that I'm in the home directory and then update everything on my servers and also install nodejs, its essentials and of course nvm and set it to version 18 so that my npm also run in the lastest version to avoid some issues.
```
cd ~
sudo apt update && sudo apt ugrade
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
Then Clone the repository, cd into it and install all the needed libraries to make sure thta everything is gonna be alright.
```
sudo git clone https://www.github.com/Nick-Lemy/country-guide
cd country-guide
sudo npm install axios
sudo npm install express
sudo npm install dotenv
```

#### c. API KEY
Create the .env file and put my GEMINI API key their so that I can use it in my app. Otherwise, it won't be able to fetch the data, because we ignored the .env file when we pushed for security and privacy purpose.
```
echo 'GEMINI=my_api_key' > .env
```

#### d. Set PM2 
pm2 is a node library that helps you to kind of deplyed your express server in your localhost like in the background if I could say. And it's more secure. So I had to install pm2 and start my server.js file on it.
```
sudo npm install -g pm2
pm2 start server.js --interpreter $(which node)
```

#### e. Set NGINX

Now that our app was already running on a certain port, we had to use nginx as a proxu to forward the nginx serve to that app running on the pm2 server. So we had to modify the nginx `sites-available/default` file config by running the following script:
```
sudo apt install nginx
new_config=\
"server {
		listen 80 default_server;
		listen [::]:80 default_server;
		root /var/www/html;
		index index.html index.htm index.nginx-debian.html
		server_name_;
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

To better explain, this script first install nginx and then store the content that we want to put in the default site-available file inside a variable. And it has change the owner of the file so that we can remove that content that was before and put what we want to be in.

#### Restart nginx
After excecuting all these commands, you need to restart nginx so that it updates.
```
sudo service nginx restart
```