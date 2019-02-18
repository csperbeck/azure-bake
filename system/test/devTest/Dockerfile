FROM docker:stable
CMD apk install npm lerna git
COPY ../../../* .
COPY *.yaml /azure-bake/system/test/devTest
ENTRYPOINT [ "sh", "/azure-bake/system/test/devTest/devTest.sh" ]