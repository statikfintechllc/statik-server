from typing import Any, ClassVar, Literal
from typing_extensions import Self

from numpy import ndarray
from numpy.random import RandomState

from .._typing import ArrayLike, Float, Int, MatrixLike
from ..base import BaseEstimator, ClassNamePrefixFeaturesOutMixin, TransformerMixin

__all__ = ["TruncatedSVD"]

class TruncatedSVD(ClassNamePrefixFeaturesOutMixin, TransformerMixin, BaseEstimator):
    feature_names_in_: ndarray = ...
    n_features_in_: int = ...
    singular_values_: ndarray = ...
    explained_variance_ratio_: ndarray = ...
    explained_variance_: ndarray = ...
    components_: ndarray = ...

    _parameter_constraints: ClassVar[dict] = ...

    def __init__(
        self,
        n_components: Int = 2,
        *,
        algorithm: Literal["arpack", "randomized"] = "randomized",
        n_iter: Int = 5,
        n_oversamples: Int = 10,
        power_iteration_normalizer: Literal["auto", "QR", "LU", "none"] = "auto",
        random_state: RandomState | None | Int = None,
        tol: Float = 0.0,
    ) -> None: ...
    def fit(self, X: MatrixLike | ArrayLike, y: Any = None) -> Self: ...
    def fit_transform(self, X: MatrixLike | ArrayLike, y: Any = None) -> ndarray: ...
    def transform(self, X: MatrixLike | ArrayLike) -> ndarray: ...
    def inverse_transform(self, X: MatrixLike) -> ndarray: ...
