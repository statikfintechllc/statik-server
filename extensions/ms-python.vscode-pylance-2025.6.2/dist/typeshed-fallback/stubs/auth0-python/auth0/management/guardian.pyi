from _typeshed import Incomplete

from ..rest import RestClientOptions
from ..types import TimeoutType

class Guardian:
    domain: Incomplete
    protocol: Incomplete
    client: Incomplete
    def __init__(
        self,
        domain: str,
        token: str,
        telemetry: bool = True,
        timeout: TimeoutType = 5.0,
        protocol: str = "https",
        rest_options: RestClientOptions | None = None,
    ) -> None: ...
    def all_factors(self) -> list[dict[str, Incomplete]]: ...
    async def all_factors_async(self) -> list[dict[str, Incomplete]]: ...
    def update_factor(self, name: str, body: dict[str, Incomplete]) -> dict[str, Incomplete]: ...
    async def update_factor_async(self, name: str, body: dict[str, Incomplete]) -> dict[str, Incomplete]: ...
    def update_templates(self, body: dict[str, Incomplete]) -> dict[str, Incomplete]: ...
    async def update_templates_async(self, body: dict[str, Incomplete]) -> dict[str, Incomplete]: ...
    def get_templates(self) -> dict[str, Incomplete]: ...
    async def get_templates_async(self) -> dict[str, Incomplete]: ...
    def get_enrollment(self, id: str) -> dict[str, Incomplete]: ...
    async def get_enrollment_async(self, id: str) -> dict[str, Incomplete]: ...
    def delete_enrollment(self, id: str): ...
    async def delete_enrollment_async(self, id: str): ...
    def create_enrollment_ticket(self, body: dict[str, Incomplete]) -> dict[str, Incomplete]: ...
    async def create_enrollment_ticket_async(self, body: dict[str, Incomplete]) -> dict[str, Incomplete]: ...
    def get_factor_providers(self, factor_name: str, name: str) -> dict[str, Incomplete]: ...
    async def get_factor_providers_async(self, factor_name: str, name: str) -> dict[str, Incomplete]: ...
    def update_factor_providers(self, factor_name: str, name: str, body: dict[str, Incomplete]) -> dict[str, Incomplete]: ...
    async def update_factor_providers_async(
        self, factor_name: str, name: str, body: dict[str, Incomplete]
    ) -> dict[str, Incomplete]: ...
