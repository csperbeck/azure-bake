FROM docker:latest
COPY entrypoint.sh ./
RUN apk update 
RUN apk add npm
RUN apk add git
RUN npm install -g lerna
ENV BAKE_ENV_NAME=Testing
ENV BAKE_ENV_CODE=TEST1
ENV BAKE_ENV_REGIONS={"name":"East US","code":"eus","shortName":"eastus"}
ENTRYPOINT [ "sh", "/entrypoint.sh" ]