FROM docker:stable-dind
COPY entrypoint.sh ./
RUN apk update 
RUN apk add npm
RUN apk add git
RUN npm install -g lerna
RUN mkdir -m 777 /usr/local/azure-bake
RUN git clone --single-branch --branch "$git_branch" "$git_repo" /usr/local/azure-bake
ENV BAKE_ENV_NAME=Testing
ENV BAKE_ENV_CODE=TEST1
ENV BAKE_ENV_REGIONS={"name":"East US","code":"eus","shortName":"eastus"}
ENTRYPOINT [ "/entrypoint.sh" ]