FROM ubuntu:latest
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && apt-get -y install xvfb dbus dbus-x11 ffmpeg tcpdump uuid-runtime wget gtk2-engines-pixbuf xfonts-cyrillic xfonts-100dpi xfonts-75dpi xfonts-base xfonts-scalable imagemagick x11-apps python3 python3-pip python3-setuptools jq
RUN dbus-uuidgen --ensure
RUN apt-get update && apt-get -y install chromium-browser
RUN mkdir -p /usr/local/nvm
ENV NVM_DIR /usr/local/nvm
RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
ENV NODE_VERSION v12.10.0
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"
ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH
RUN npm install puppeteer-core axios
COPY python /usr/local/python
RUN cd /usr/local/python/urlutil && python3 setup.py test && python3 setup.py install
COPY doit /
COPY run.js /
ENTRYPOINT ["/doit"]
