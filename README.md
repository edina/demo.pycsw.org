###INSPIRE compliant JavaScript front end for CSW (Catalog Service for the Web).

Install and setup pycsw.

```
# Setup a virtual environment:
$ virtualenv pycsw && cd pycsw && . bin/activate

# Grab the pycsw source code:
$ git clone https://github.com/geopython/pycsw.git && cd pycsw
$ pip install -e . && pip install -r requirements-standalone.txt

# Create and adjust a configuration file:
$ cp default-sample.cfg default.cfg
$ vi default.cfg
# adjust paths in
# - server.home
# - repository.database
# set server.url to http://localhost:8000/

# Setup the database:
$ pycsw-admin.py -c setup_db -f default.cfg

# Load records by indicating a directory of XML files, use -r for recursive:
$ pycsw-admin.py -c load_records -f default.cfg -p /path/to/xml/

# Run the server:
$ python ./pycsw/wsgi.py

# See that it works!
$ curl http://localhost:8000/?service=CSW&version=2.0.2&request=GetCapabilities
```
optional - start the node proxy server to point to the csw url

```
cd www
node index.js -p 8070 -c 'http://localhost:8000/csw'
```
-p : the port to serve the www directory
-c : the url for the pycsw server.

open a browser point to

http://localhost:8070/viewer/index.html


