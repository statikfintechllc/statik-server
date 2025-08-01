from _typeshed import Incomplete

from authlib.integrations.base_client import FrameworkIntegration

__all__ = ["BaseOAuth"]

class BaseOAuth:
    oauth1_client_cls: Incomplete
    oauth2_client_cls: Incomplete
    framework_integration_cls: type[FrameworkIntegration] = ...
    cache: Incomplete
    fetch_token: Incomplete
    update_token: Incomplete
    def __init__(self, cache=None, fetch_token=None, update_token=None) -> None: ...
    def create_client(self, name): ...
    def register(self, name, overwrite: bool = False, **kwargs): ...
    def generate_client_kwargs(self, name, overwrite, **kwargs): ...
    def load_config(self, name, params): ...
    def __getattr__(self, key): ...
