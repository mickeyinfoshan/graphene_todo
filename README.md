# RRGD TodoMVC
TodoMVC with React, Relay, Graphene and Django

## Note
You may need to change the permission of the scripts to run them.
```
chmod +x ./*.sh
``` 

## Installation

```
./preinstall.sh
```

## Running

Start a local server:

```
./start.sh
```

Now you can open your browser and visit `localhost:3000`.

## Developing

If at any time you make changes to the schema, stop the server,
regenerate `relayTodo/data/schema.json`, and restart the server:

```
./updateSchema.sh
```
