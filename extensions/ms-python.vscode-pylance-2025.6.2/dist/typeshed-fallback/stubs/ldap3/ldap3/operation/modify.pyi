from typing import Any

change_table: Any

def modify_operation(dn, changes, auto_encode, schema=None, validator=None, check_names: bool = False): ...
def modify_request_to_dict(request): ...
def modify_response_to_dict(response): ...
