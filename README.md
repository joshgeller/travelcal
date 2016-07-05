# Setting up the dev environment

## Basic Process

    sudo apt-get install npm
    sudo apt-get install python3
    sudo apt-get install python3-pip
    # ensure backwards-compatibility with nodejs
    sudo ln -s /usr/bin/nodejs /usr/bin/node
    sudo npm -g install grunt
    sudo npm -g install bower
    # clone repo
    # git@github.com:joshgeller/travelcal.git
    # https://github.com/joshgeller/travelcal.git
    # cd into root dir of repo
    cp config.json.example config.json
    # update config with your server settings
    sudo pip3 install -r server/requirements.txt
    npm install
    bower update
    grunt
    

## Assumptions

Base Ubuntu 14.04 installation (or other installation compatible with below packages)

[ubuntu\_14.04\_mini.iso](http://archive.ubuntu.com/ubuntu/dists/trusty/main/installer-amd64/current/images/netboot/mini.iso)

* Base Server Installation
* OpenSSH server




-- 

1.  Install Python 3.5

    https://www.python.org/downloads/

2.  Install pip (this is package manager for Python). I believe this is
    installed automatically w/ Python.

3.  (Optional but recommended) Set up a virtualenv for the project. This is
    basically a self-contained Python installation for this project only. Allows
    you to install packages without polluting your global Python installation.
    Similar to the package.json/node_modules concept used by npm, if you are
    familiar with that.

    https://virtualenv.pypa.io/en/stable/installation/

4.  Clone the git repo

5.  Activate the virtualenv if you set one up in #3.

6.  Navigate to the `server` directory and run `pip install -r requirements.txt`
    to install all of the packages listed in requirements.txt. If you add any
    packages to this project (e.g. libraries for generating PDFs, etc), make
    sure to add the package to requirements.txt so that it's easy for everyone
    else to install the same version.

7.  Run `python manage.py runserver` to run the development server.

8.  Navigate to `http://127.0.0.1:8000` - you should see the basic project.
