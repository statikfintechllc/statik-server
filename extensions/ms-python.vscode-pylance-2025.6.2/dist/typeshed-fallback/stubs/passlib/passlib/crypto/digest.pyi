from typing import Any

from passlib.utils import SequenceMixin

def lookup_hash(digest, return_unknown: bool = False, required: bool = True): ...
def norm_hash_name(name, format: str = "hashlib"): ...

class HashInfo(SequenceMixin):
    name: Any
    iana_name: Any
    aliases: Any
    const: Any
    digest_size: Any
    block_size: Any
    error_text: Any
    unknown: bool
    def __init__(self, const, names, required: bool = True) -> None: ...
    @property
    def supported(self): ...
    @property
    def supported_by_fastpbkdf2(self): ...
    @property
    def supported_by_hashlib_pbkdf2(self): ...

def compile_hmac(digest, key, multipart: bool = False): ...
def pbkdf1(digest, secret, salt, rounds, keylen=None): ...
def pbkdf2_hmac(digest, secret, salt, rounds, keylen=None): ...

__all__ = [
    # hash utils
    "lookup_hash",
    "HashInfo",
    "norm_hash_name",
    # hmac utils
    "compile_hmac",
    # kdfs
    "pbkdf1",
    "pbkdf2_hmac",
]
