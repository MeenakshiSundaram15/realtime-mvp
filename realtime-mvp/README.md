# Websocket Realtime API

## Steps to build and run docker container locally
```
Build: 
$ docker buildx build --platform=linux/x86_64 -t dl-websocket-app .
```

Run: 
```
$ docker run -d --name dl-websocket-app -p 7071:7071 dl-websocket-app-docker
$ docker run --name dl-websocket-app -p 7071:7071 dl-websocket-app-docker
```

## Steps to build and push image to docker container registory
Prod Login:
```
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 425914709221.dkr.ecr.ap-southeast-1.amazonaws.com
```

Build:
```
$ docker buildx build --platform=linux/x86_64 -t dl-websocket-app .
```

Tag:
```
$ docker tag dl-websocket-app:latest 425914709221.dkr.ecr.ap-southeast-1.amazonaws.com/dl-websocket-app:latest
```

Push:
```
$ docker push 425914709221.dkr.ecr.ap-southeast-1.amazonaws.com/dl-websocket-app:latest
```

Login Dev:
```
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 425914709221.dkr.ecr.ap-southeast-1.amazonaws.com
```

Build:
```
$ docker buildx build --platform=linux/x86_64 -t dl-websocket-app .
```

Tag:
```
$ docker tag dl-websocket-app:latest 425914709221.dkr.ecr.ap-southeast-1.amazonaws.com/dl-websocket-app:latest-dev
```

Push:
```
$ docker push 425914709221.dkr.ecr.ap-southeast-1.amazonaws.com/dl-websocket-app:latest-dev
```

Login SIT:
```
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 425914709221.dkr.ecr.ap-southeast-1.amazonaws.com
```

Build:
```
$ docker buildx build --platform=linux/x86_64 -t dl-websocket-app .
```

Tag:
```
$ docker tag dl-websocket-app:latest 425914709221.dkr.ecr.ap-southeast-1.amazonaws.com/dl-websocket-app:latest-sit
```

Push:
```
$ docker push 425914709221.dkr.ecr.ap-southeast-1.amazonaws.com/dl-websocket-app:latest-sit
```