from _typeshed import Incomplete
from collections.abc import Iterable

from networkx.classes.graph import Graph, _Node
from networkx.utils.backends import _dispatchable

__all__ = ["average_degree_connectivity"]

@_dispatchable
def average_degree_connectivity(
    G: Graph[_Node], source="in+out", target="in+out", nodes: Iterable[Incomplete] | None = None, weight: str | None = None
): ...
