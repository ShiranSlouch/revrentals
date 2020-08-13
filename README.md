


### Production Server

By default the servers use the UTC time, but if we want to use a different timezone we have to run the following command to set the timezone:

```sh
dpkg-reconfigure tzdata
```

(this will open the interactive shell to choose the timezone from the list)

Note that it may take a while to update it across the processes (e.g. we set the new timezone and it took about 20 min to update it in the Node.js process).

