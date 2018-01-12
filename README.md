# Example Cloudstack Plugin

## Development 

Modified instructions from [here](https://hub.docker.com/r/cloudstack/simulator/) 
for running a Cloudstack simulator locally.

Modify the Docker `run` command to overwrite the Cloudstack ui/plugins directory with this repo's
`plugins` directory:  
`docker run --name cloudstack -d -p 8080:8080 -v <project workspace>/plugins:/root/ui/plugins cloudstack/simulator`

For some reason, after running the above command for the first time, Cloudstack wasn't running properly.
A combination of connecting to the container and restarting it fixed this problem.  
`docker exec -ti cloudstack /bin/bash`  
`docker stop cloudstack; docker start cloudstack`

Now you have a running Cloudstack simulator with your custom plugin loaded. One downside, is that the
container needs restarted after every change to the plugin.  
`docker stop cloudstack; docker start cloudstack`