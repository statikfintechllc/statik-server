from _typeshed import Incomplete

from authlib.oauth1 import ClientAuth

class OAuth1Client:
    auth_class: type[ClientAuth] = ...
    session: Incomplete
    auth: Incomplete
    def __init__(
        self,
        session,
        client_id,
        client_secret=None,
        token=None,
        token_secret=None,
        redirect_uri=None,
        rsa_key=None,
        verifier=None,
        signature_method="HMAC-SHA1",
        signature_type="HEADER",
        force_include_body: bool = False,
        realm=None,
        **kwargs,
    ) -> None: ...
    @property
    def redirect_uri(self): ...
    @redirect_uri.setter
    def redirect_uri(self, uri) -> None: ...
    @property
    def token(self): ...
    @token.setter
    def token(self, token) -> None: ...
    def create_authorization_url(self, url, request_token=None, **kwargs): ...
    def fetch_request_token(self, url, **kwargs): ...
    def fetch_access_token(self, url, verifier=None, **kwargs): ...
    def parse_authorization_response(self, url): ...
    def parse_response_token(self, status_code, text): ...
    @staticmethod
    def handle_error(error_type, error_description) -> None: ...
