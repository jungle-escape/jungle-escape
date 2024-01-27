# PlayNetwork

This is a solution to run [PlayCanvas engine](https://github.com/playcanvas/engine) on the back-end for authoritative multiplayer games and applications. Which takes care of network synchronization, mesh-communication, and allows you to focus on gameplay logic.

This mainly focuses on a session/match-based type of application and is not a solution for MMOs.

# [API Documentation](./docs/) 📄

# Functionality

-   **Rooms** - each server process can run multiple rooms, each with its own Application context, own levels, users, and logic.
-   **Levels** (hierarchy) - is authored in PlayCanvas Editor, and can be easily sent to the back-end to be saved and used for rooms. When a client joins a room, the server will send a current hierarchy (parsed) and the client will instantiate it.
-   **Networked entities** - ensures that entities are synchronized between server and clients. Using the `properties` list, you can specify (by path) what data is synchronized and what properties are interpolated.
-   **Custom events** - allows to send custom events from client/server to: server, user, room or network entity.
-   **Code hot-reloading** - provides faster development times, without a need to restart a server.
-   **Interpolation** - the client can interpolate numbers, vectors, colors, and quaternions, this is done by checking `interpolate` on networked entity paths.
-   **Physics** - server can run Ammo.js physics within the Application context. It is also possible to run physics only on the server-side and keep the client only interpolating.
-   **Horizontal Scalability** - clients can be connected to a specific server, and be proxied to another server with actual application logic (room). By hosting multiple servers in different regions behind a load balancers, this provides seamless horizontal scalability.

### PlayNetwork

Multiple server processes can be started. Each server process can run multiple rooms.

### Rooms 🌍

Each room has its Application instance and a lifecycle. So it can have its scene hierarchy and scripts logic. It will run an update with a set `tickrate`

### Levels 🏠

To start PlayCanvas Application, you need a scene hierarchy. Which you can create manually by code, or use scene loader to load it from JSON file.
Server and client run their logic, and the code of scripts will differ between client and server but will share attributes.

### Networked entities 🏀

Each networked entity gets a unique ID that is persistent between a server and clients. Any server-side change to an entity, components, or script attributes, if specified by a property in networked entity attributes, will automatically synchronize to the client. Additionally properties can be interpolated automatically.

### Custom events 📨

Server and client can send to each other any variety of messages. The client can send messages to a Server, Room, User, and NetworkEntity, which then will be triggered on appropriate instances on the server-side, providing `sender` - as an author of a message. The server can also send messages to the client, to different scopes: User, Room (all Users), NetworkEntity (all Users, but specific Entity).
Client sent messages also have a callback, which allows getting a response from a server, which is similar to RPC.

### Code hot-reloading 🔥

For faster development times, it is possible to hot-reload script types, without restarting a server (what a blast!). Simply ensure you have a `swap` method defined, and the internal watcher will try to reload your script on every change/save. This will reload script types from an updated file, and trigger a `swap` method on all entities with such script type. If there was a parsing error, it will report that in the console and prevent hot-swap.

For more details on how to inherit the old instance state read here: [User Manual](https://developer.playcanvas.com/en/user-manual/scripting/hot-reloading/).

# Installation

This project is made of two parts.

### Server

Server-side code, that implements gameplay, rooms logic, serve level data, session, and APIs.

### Client

And a client-side code, that communicates to a server, gets level data and instantiates it. It is recommended to use PlayCanvas Editor for ease of development, but an engine-only approach is a viable option too.

# Example Project 🚀

https://github.com/meta-space-org/playnetwork-example-3d-physics-topdown

This project implements a simple top-down 3D game with physics. It uses client authority for the player controller entity and interpolates the game state. This example allows for the creation and to join rooms by the client.

# Dependencies

In order to implement multi-server architecture, PlayNetwork uses Redis for handling routing, unique IDs generation, cross-server communication and more.

# Hosting and Configuration

In order to handle high concurrent connections, we recommend running multiple servers and instances across various regions, and having a load balancers in front of them. This provides users with a fast connection to the closest instance while allowing spreading users between servers and rooms without constraining them to initially connected server. So any user can join any room in any region, without a need of new connections.

Too much load in a region, just launch more instances and servers, and let load balancers to spread the load.

Our recommended setup would be:

```
[domain]
    [load-balancer (latency/region)]

        [region-us]
            [load-balancer (cpu-load)]
                [instance-1]
                    [server-1]
                    [server-2]
                    ... (as many as CPU Threads)

                [instance-2]
                    [server-1]
                    [server-2]
                    ...

                ...

        [region-eu]

        ...
```

For optimal usage of instance resources and taking in account single-threaded nature of Node.js it is recommended to run multiple PlayNetwork processes on each instance, as many as there are CPU Threads on that instance.

Each server should be bound to own port and be accessible individually either by public subdomains or inter-network addresses.

# Debugging ❓

You can run a server with a debugger: `npm run debug`, then open Chrome and navigate to `chrome://inspect`, then click on `Open dedicated DevTools for Node`.

You can use breakpoints and debug the same way as client-side.

# Level Data 🏠

Level (hierarchy) is stored on the server and is sent to the client when it connects to the room. It is up to you to implement a saving and method of storing level data. For an easier start, we provide a basic FileLevelProvider, which will save/load level JSON to a file.

# Templates 📦

It is convenient to use Templates on the server, to create complex entities. Templates are parsed and loaded from provided option `templatesPath` to `pn.initialize`. You can then access them as normal by ID: `this.app.assets.get(61886320)` in your Applications.

In order to get Template JSON file, unfortunately it is not implemented in Editor yet: https://github.com/playcanvas/editor/issues/551
So we can use Editor API in order to get JSON:

1. Open Editor
2. Select single Template asset
3. Open Dev Tools > Console
4. Execute in console: `JSON.stringify(editor.call('selector:items')[0].json(), null, 4)`;
5. Right-click on logged string > Copy string contents
6. Paste copied JSON into your template file.

Then use its ID to get it from the registry.
