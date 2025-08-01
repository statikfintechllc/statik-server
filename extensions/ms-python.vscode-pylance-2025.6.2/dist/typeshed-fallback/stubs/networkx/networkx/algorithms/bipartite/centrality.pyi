from networkx.classes.graph import Graph, _Node
from networkx.utils.backends import _dispatchable

__all__ = ["degree_centrality", "betweenness_centrality", "closeness_centrality"]

@_dispatchable
def degree_centrality(G: Graph[_Node], nodes): ...
@_dispatchable
def betweenness_centrality(G: Graph[_Node], nodes): ...
@_dispatchable
def closeness_centrality(G: Graph[_Node], nodes, normalized: bool | None = True): ...
