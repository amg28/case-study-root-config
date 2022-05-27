# Master thesis case study - case-study-root-config

## Micro frontend application structure

+ **case-study-root-config (current repository)**
    + [case-study-navbar](https://github.com/amg28/case-study-navbar)
    + [case-study-weather-app](https://github.com/amg28/case-study-weather-app)
    + [case-study-pollution-app](https://github.com/amg28/case-study-pollution-app)

## Local development

### Prerequisites
Please also make sure you have installed [Node.js](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) versions already in your operating system.

Supported Node.js version is v16+.

### Installation 

1. Clone the project using a command:
```sh
git clone https://github.com/amg28/case-study-root-config.git

or using SSH

git clone git@github.com:amg28/case-study-root-config.git
```

2. Install required dependencies
```
npm install
```

3. Start the project using a command - it will start client and node servers simultaneously:
```
npm develop
```

### Usage

Client-server representing Micro frontend application becomes accessible on port: http://localhost:9000/
Node.JS server starts on port: http://localhost:9876/

For local development usage, it is enough with the start of only this project, as micro frontend applications for the navbar, weather-app, and pollution-app deployed version are imported into a project via Import maps.

If you wish to develop or change a particular micro frontend application, you can install them locally. Micro frontend applications will be picked up by the root application instead of the application's deployed version.

### Error handling

In case of an error: 
> Error: error:0308010C:digital envelope routines::unsupported==

Please use a command in your terminal to set an environment variable before starting a project:
```
export NODE_OPTIONS=--openssl-legacy-provider
```

In case command in not recognized, try to use a [Git Bash command line terminal](https://git-scm.com/downloads).