from configparser import ConfigParser


_config = ConfigParser()
_config.read("config.ini")
_host = "{}:{}".format(_config.get("SERVER","host"),_config.get("SERVER","port"))


wsgi_app = "main:app"
worker_class = "uvicorn.workers.UvicornWorker"
bind = _host