FROM debian:latest
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && apt-get -y install xvfb dbus dbus-x11 ffmpeg tcpdump uuid-runtime wget gtk2-engines-pixbuf xfonts-cyrillic xfonts-100dpi xfonts-75dpi xfonts-base xfonts-scalable imagemagick x11-apps python3 python3-pip python3-setuptools jq tshark
RUN dbus-uuidgen --ensure
RUN apt-get update && apt-get -y install chromium
RUN mkdir -p /usr/local/nvm
ENV NVM_DIR /usr/local/nvm
SHELL ["/bin/bash", "-c"]
RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install node && nvm use --delete-prefix node && nvm alias default node"
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && npm install puppeteer-core axios"
COPY python /usr/local/python
RUN cd /usr/local/python/urlutil && python3 setup.py test && python3 setup.py install
COPY doit /
COPY run.js /
ENTRYPOINT ["/doit"]
