from _typeshed import Incomplete
from typing import Final

class ClientConfigurationEndpoint:
    ENDPOINT_NAME: Final = "client_configuration"
    server: Incomplete
    claims_classes: list[type[Incomplete]]
    def __init__(self, server=None, claims_classes: list[type[Incomplete]] | None = None) -> None: ...
    def __call__(self, request): ...
    def create_configuration_response(self, request): ...
    def create_endpoint_request(self, request): ...
    def create_read_client_response(self, client, request): ...
    def create_delete_client_response(self, client, request): ...
    def create_update_client_response(self, client, request): ...
    def extract_client_metadata(self, request): ...
    def introspect_client(self, client): ...
    def generate_client_registration_info(self, client, request) -> None: ...
    def authenticate_token(self, request) -> None: ...
    def authenticate_client(self, request) -> None: ...
    def revoke_access_token(self, token, request) -> None: ...
    def check_permission(self, client, request) -> None: ...
    def delete_client(self, client, request) -> None: ...
    def update_client(self, client, client_metadata, request) -> None: ...
    def get_server_metadata(self) -> None: ...
