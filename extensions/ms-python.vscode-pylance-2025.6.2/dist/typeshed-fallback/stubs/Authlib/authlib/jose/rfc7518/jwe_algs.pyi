from _typeshed import Incomplete

from authlib.jose.rfc7516 import JWEAlgorithm

class DirectAlgorithm(JWEAlgorithm):
    name: str
    description: str
    def prepare_key(self, raw_data): ...
    def generate_preset(self, enc_alg, key): ...
    def wrap(self, enc_alg, headers, key, preset=None): ...
    def unwrap(self, enc_alg, ek, headers, key): ...

class RSAAlgorithm(JWEAlgorithm):
    key_size: int
    name: Incomplete
    description: Incomplete
    padding: Incomplete
    def __init__(self, name, description, pad_fn) -> None: ...
    def prepare_key(self, raw_data): ...
    def generate_preset(self, enc_alg, key): ...
    def wrap(self, enc_alg, headers, key, preset=None): ...
    def unwrap(self, enc_alg, ek, headers, key): ...

class AESAlgorithm(JWEAlgorithm):
    name: Incomplete
    description: Incomplete
    key_size: Incomplete
    def __init__(self, key_size) -> None: ...
    def prepare_key(self, raw_data): ...
    def generate_preset(self, enc_alg, key): ...
    def wrap_cek(self, cek, key): ...
    def wrap(self, enc_alg, headers, key, preset=None): ...
    def unwrap(self, enc_alg, ek, headers, key): ...

class AESGCMAlgorithm(JWEAlgorithm):
    EXTRA_HEADERS: Incomplete
    name: Incomplete
    description: Incomplete
    key_size: Incomplete
    def __init__(self, key_size) -> None: ...
    def prepare_key(self, raw_data): ...
    def generate_preset(self, enc_alg, key): ...
    def wrap(self, enc_alg, headers, key, preset=None): ...
    def unwrap(self, enc_alg, ek, headers, key): ...

class ECDHESAlgorithm(JWEAlgorithm):
    EXTRA_HEADERS: Incomplete
    ALLOWED_KEY_CLS = Incomplete
    name: str
    description: str
    key_size: Incomplete
    aeskw: Incomplete
    def __init__(self, key_size=None) -> None: ...
    def prepare_key(self, raw_data): ...
    def generate_preset(self, enc_alg, key): ...
    def compute_fixed_info(self, headers, bit_size): ...
    def compute_derived_key(self, shared_key, fixed_info, bit_size): ...
    def deliver(self, key, pubkey, headers, bit_size): ...
    def wrap(self, enc_alg, headers, key, preset=None): ...
    def unwrap(self, enc_alg, ek, headers, key): ...

def u32be_len_input(s, base64: bool = False): ...

JWE_ALG_ALGORITHMS: Incomplete
