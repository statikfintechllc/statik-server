from collections.abc import (
    Callable,
    Sequence,
)
from typing import (
    Any,
    Literal,
    Protocol,
    overload,
)

from matplotlib.colors import Colormap
import numpy as np
from pandas.core.frame import DataFrame
from pandas.core.series import Series

from pandas._typing import (
    Axis,
    ExcelWriterMergeCells,
    FilePath,
    HashableT,
    HashableT1,
    HashableT2,
    IndexLabel,
    IntervalClosedType,
    Level,
    QuantileInterpolation,
    Scalar,
    StorageOptions,
    T,
    WriteBuffer,
    WriteExcelBuffer,
    npt,
)

from pandas.io.excel import ExcelWriter
from pandas.io.formats.style_render import (
    CSSProperties,
    CSSStyles,
    ExtFormatter,
    StyleExportDict,
    StylerRenderer,
    Subset,
)

class _SeriesFunc(Protocol):
    def __call__(
        self, series: Series, /, *args: Any, **kwargs: Any
    ) -> list | Series: ...

class _DataFrameFunc(Protocol):
    def __call__(
        self, series: DataFrame, /, *args: Any, **kwargs: Any
    ) -> npt.NDArray | DataFrame: ...

class _MapCallable(Protocol):
    def __call__(
        self, first_arg: Scalar, /, *args: Any, **kwargs: Any
    ) -> str | None: ...

class Styler(StylerRenderer):
    def __init__(
        self,
        data: DataFrame | Series,
        precision: int | None = ...,
        table_styles: CSSStyles | None = ...,
        uuid: str | None = ...,
        caption: str | tuple[str, str] | None = ...,
        table_attributes: str | None = ...,
        cell_ids: bool = ...,
        na_rep: str | None = ...,
        uuid_len: int = ...,
        decimal: str | None = ...,
        thousands: str | None = ...,
        escape: str | None = ...,
        formatter: ExtFormatter | None = ...,
    ) -> None: ...
    def concat(self, other: Styler) -> Styler: ...
    @overload
    def map(
        self,
        func: Callable[[Scalar], str | None],
        subset: Subset | None = ...,
    ) -> Styler: ...
    @overload
    def map(
        self,
        func: _MapCallable,
        subset: Subset | None = ...,
        **kwargs: Any,
    ) -> Styler: ...
    def set_tooltips(
        self,
        ttips: DataFrame,
        props: CSSProperties | None = ...,
        css_class: str | None = ...,
        as_title_attribute: bool = ...,
    ) -> Styler: ...
    def to_excel(
        self,
        excel_writer: FilePath | WriteExcelBuffer | ExcelWriter,
        sheet_name: str = ...,
        na_rep: str = ...,
        float_format: str | None = ...,
        columns: list[HashableT1] | None = ...,
        header: list[HashableT2] | bool = ...,
        index: bool = ...,
        index_label: IndexLabel | None = ...,
        startrow: int = ...,
        startcol: int = ...,
        engine: Literal["openpyxl", "xlsxwriter"] | None = ...,
        merge_cells: ExcelWriterMergeCells = ...,
        encoding: str | None = ...,
        inf_rep: str = ...,
        verbose: bool = ...,
        freeze_panes: tuple[int, int] | None = ...,
        storage_options: StorageOptions | None = ...,
    ) -> None: ...
    @overload
    def to_latex(
        self,
        buf: FilePath | WriteBuffer[str],
        *,
        column_format: str | None = ...,
        position: str | None = ...,
        position_float: Literal["centering", "raggedleft", "raggedright"] | None = ...,
        hrules: bool | None = ...,
        clines: (
            Literal["all;data", "all;index", "skip-last;data", "skip-last;index"] | None
        ) = ...,
        label: str | None = ...,
        caption: str | tuple[str, str] | None = ...,
        sparse_index: bool | None = ...,
        sparse_columns: bool | None = ...,
        multirow_align: Literal["c", "t", "b", "naive"] | None = ...,
        multicol_align: Literal["r", "c", "l", "naive-l", "naive-r"] | None = ...,
        siunitx: bool = ...,
        environment: str | None = ...,
        encoding: str | None = ...,
        convert_css: bool = ...,
    ) -> None: ...
    @overload
    def to_latex(
        self,
        buf: None = ...,
        *,
        column_format: str | None = ...,
        position: str | None = ...,
        position_float: Literal["centering", "raggedleft", "raggedright"] | None = ...,
        hrules: bool | None = ...,
        clines: (
            Literal["all;data", "all;index", "skip-last;data", "skip-last;index"] | None
        ) = ...,
        label: str | None = ...,
        caption: str | tuple[str, str] | None = ...,
        sparse_index: bool | None = ...,
        sparse_columns: bool | None = ...,
        multirow_align: Literal["c", "t", "b", "naive"] | None = ...,
        multicol_align: Literal["r", "c", "l", "naive-l", "naive-r"] | None = ...,
        siunitx: bool = ...,
        environment: str | None = ...,
        encoding: str | None = ...,
        convert_css: bool = ...,
    ) -> str: ...
    @overload
    def to_html(
        self,
        buf: FilePath | WriteBuffer[str],
        *,
        table_uuid: str | None = ...,
        table_attributes: str | None = ...,
        sparse_index: bool | None = ...,
        sparse_columns: bool | None = ...,
        bold_headers: bool = ...,
        caption: str | None = ...,
        max_rows: int | None = ...,
        max_columns: int | None = ...,
        encoding: str | None = ...,
        doctype_html: bool = ...,
        exclude_styles: bool = ...,
        **kwargs: Any,
    ) -> None: ...
    @overload
    def to_html(
        self,
        buf: None = ...,
        *,
        table_uuid: str | None = ...,
        table_attributes: str | None = ...,
        sparse_index: bool | None = ...,
        sparse_columns: bool | None = ...,
        bold_headers: bool = ...,
        caption: str | None = ...,
        max_rows: int | None = ...,
        max_columns: int | None = ...,
        encoding: str | None = ...,
        doctype_html: bool = ...,
        exclude_styles: bool = ...,
        **kwargs: Any,
    ) -> str: ...
    @overload
    def to_string(
        self,
        buf: FilePath | WriteBuffer[str],
        *,
        encoding: str | None = ...,
        sparse_index: bool | None = ...,
        sparse_columns: bool | None = ...,
        max_rows: int | None = ...,
        max_columns: int | None = ...,
        delimiter: str = ...,
    ) -> None: ...
    @overload
    def to_string(
        self,
        buf: None = ...,
        *,
        encoding: str | None = ...,
        sparse_index: bool | None = ...,
        sparse_columns: bool | None = ...,
        max_rows: int | None = ...,
        max_columns: int | None = ...,
        delimiter: str = ...,
    ) -> str: ...
    def set_td_classes(self, classes: DataFrame) -> Styler: ...
    def __copy__(self) -> Styler: ...
    def __deepcopy__(self, memo) -> Styler: ...
    def clear(self) -> None: ...
    @overload
    def apply(
        self,
        func: _SeriesFunc | Callable[[Series], list | Series],
        axis: Axis = ...,
        subset: Subset | None = ...,
        **kwargs: Any,
    ) -> Styler: ...
    @overload
    def apply(
        self,
        func: _DataFrameFunc | Callable[[DataFrame], npt.NDArray | DataFrame],
        axis: None,
        subset: Subset | None = ...,
        **kwargs: Any,
    ) -> Styler: ...
    def apply_index(
        self,
        func: Callable[[Series], npt.NDArray[np.str_] | list[str] | Series[str]],
        axis: Axis = ...,
        level: Level | list[Level] | None = ...,
        **kwargs: Any,
    ) -> Styler: ...
    def map_index(
        self,
        func: Callable[[Scalar], str | None],
        axis: Axis = ...,
        level: Level | list[Level] | None = ...,
        **kwargs,
    ) -> Styler: ...
    def set_table_attributes(self, attributes: str) -> Styler: ...
    def export(self) -> StyleExportDict: ...
    def use(self, styles: StyleExportDict) -> Styler: ...
    def set_uuid(self, uuid: str) -> Styler: ...
    def set_caption(self, caption: str | tuple[str, str]) -> Styler: ...
    def set_sticky(
        self,
        axis: Axis = ...,
        pixel_size: int | None = ...,
        levels: Level | list[Level] | None = ...,
    ) -> Styler: ...
    def set_table_styles(
        self,
        table_styles: dict[HashableT, CSSStyles] | CSSStyles | None = ...,
        axis: Axis = ...,
        overwrite: bool = ...,
        css_class_names: dict[str, str] | None = ...,
    ) -> Styler: ...
    def hide(
        self,
        subset: Subset | None = ...,
        axis: Axis = ...,
        level: Level | list[Level] | None = ...,
        names: bool = ...,
    ) -> Styler: ...
    def background_gradient(
        self,
        cmap: str | Colormap = ...,
        low: float = ...,
        high: float = ...,
        axis: Axis | None = ...,
        subset: Subset | None = ...,
        text_color_threshold: float = ...,
        vmin: float | None = ...,
        vmax: float | None = ...,
        gmap: (
            Sequence[float]
            | Sequence[Sequence[float]]
            | npt.NDArray
            | DataFrame
            | Series
            | None
        ) = ...,
    ) -> Styler: ...
    def text_gradient(
        self,
        cmap: str | Colormap = ...,
        low: float = ...,
        high: float = ...,
        axis: Axis | None = ...,
        subset: Subset | None = ...,
        # In docs but not in function declaration
        # text_color_threshold: float
        vmin: float | None = ...,
        vmax: float | None = ...,
        gmap: (
            Sequence[float]
            | Sequence[Sequence[float]]
            | npt.NDArray
            | DataFrame
            | Series
            | None
        ) = ...,
    ) -> Styler: ...
    def set_properties(
        self, subset: Subset | None = ..., **kwargs: str | int
    ) -> Styler: ...
    def bar(
        self,
        subset: Subset | None = ...,
        axis: Axis | None = ...,
        *,
        color: str | list[str] | tuple[str, str] | None = ...,
        cmap: str | Colormap | None = ...,
        width: float = ...,
        height: float = ...,
        align: (
            Literal["left", "right", "zero", "mid", "mean"]
            | float
            | Callable[[Series | npt.NDArray | DataFrame], float]
        ) = ...,
        vmin: float | None = ...,
        vmax: float | None = ...,
        props: str = ...,
    ) -> Styler: ...
    def highlight_null(
        self,
        color: str | None = ...,
        subset: Subset | None = ...,
        props: str | None = ...,
    ) -> Styler: ...
    def highlight_max(
        self,
        subset: Subset | None = ...,
        color: str = ...,
        axis: Axis | None = ...,
        props: str | None = ...,
    ) -> Styler: ...
    def highlight_min(
        self,
        subset: Subset | None = ...,
        color: str = ...,
        axis: Axis | None = ...,
        props: str | None = ...,
    ) -> Styler: ...
    def highlight_between(
        self,
        subset: Subset | None = ...,
        color: str = ...,
        axis: Axis | None = ...,
        left: Scalar | list[Scalar] | None = ...,
        right: Scalar | list[Scalar] | None = ...,
        inclusive: IntervalClosedType = ...,
        props: str | None = ...,
    ) -> Styler: ...
    def highlight_quantile(
        self,
        subset: Subset | None = ...,
        color: str = ...,
        axis: Axis | None = ...,
        q_left: float = ...,
        q_right: float = ...,
        interpolation: QuantileInterpolation = ...,
        inclusive: IntervalClosedType = ...,
        props: str | None = ...,
    ) -> Styler: ...
    @classmethod
    def from_custom_template(
        cls,
        searchpath: str | list[str],
        html_table: str | None = ...,
        html_style: str | None = ...,
    ) -> type[Styler]: ...
    def pipe(
        self,
        func: Callable[..., T] | tuple[Callable[..., T], str],
        *args: Any,
        **kwargs: Any,
    ) -> T: ...
