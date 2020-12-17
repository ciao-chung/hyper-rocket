FROM ciaochung/ubuntu-fish-node10:stable
MAINTAINER Ciao Chung

COPY workspace/files /workspace/files
COPY workspace/shell /workspace/shell
COPY workspace/site /site
COPY workspace/entrypoint.sh /docker/entrypoint.sh

RUN chmod 755 /docker/entrypoint.sh \
  && mkdir -p /workspace \
  && mkdir -p /hyper-rocket/app \
  && echo "rm -f /hyper-rocket/.notifier; yarn global add /hyper-rocket" > /workspace/install-hyper-rocket.sh \
  && apt-get update \
  && apt-get install -y ssh openssh-server -y \
  && mkdir -p ~/.ssh \
  && touch ~/.ssh/authorized_keys \
  && sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config \
  && chown -R www-data:www-data /site \
  && chmod 755 /workspace/install-hyper-rocket.sh \
  && chmod 755 /workspace/shell/*.sh \
  && cd /workspace

CMD ["/docker/entrypoint.sh"]
