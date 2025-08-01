from _typeshed import Incomplete
from typing import Final

from reportlab.graphics.charts.areas import PlotArea
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.widgetbase import PropHolder

__version__: Final[str]

class BarChartProperties(PropHolder):
    strokeColor: Incomplete
    fillColor: Incomplete
    strokeWidth: float
    symbol: Incomplete
    strokeDashArray: Incomplete
    def __init__(self) -> None: ...

class BarChart(PlotArea):
    def makeSwatchSample(self, rowNo, x, y, width, height): ...
    def getSeriesName(self, i, default=None): ...
    categoryAxis: Incomplete
    valueAxis: Incomplete
    barSpacing: int
    reversePlotOrder: int
    data: Incomplete
    useAbsolute: int
    barWidth: int
    groupSpacing: int
    barLabels: Incomplete
    barLabelFormat: Incomplete
    barLabelArray: Incomplete
    bars: Incomplete
    naLabel: Incomplete
    zIndexOverrides: Incomplete
    def __init__(self) -> None: ...
    def demo(self): ...
    def getSeriesOrder(self) -> None: ...
    def calcBarPositions(self) -> None: ...
    def makeBars(self): ...
    def draw(self): ...

class VerticalBarChart(BarChart): ...
class HorizontalBarChart(BarChart): ...

class _FakeGroup:
    def __init__(self, cmp=None) -> None: ...
    def add(self, what) -> None: ...
    def value(self): ...
    def sort(self) -> None: ...

class BarChart3D(BarChart):
    theta_x: float
    theta_y: float
    zDepth: Incomplete
    zSpace: Incomplete
    def calcBarPositions(self) -> None: ...
    def makeBars(self): ...

class VerticalBarChart3D(BarChart3D, VerticalBarChart): ...
class HorizontalBarChart3D(BarChart3D, HorizontalBarChart): ...

def sampleV0a(): ...
def sampleV0b(): ...
def sampleV0c(): ...
def sampleV1(): ...
def sampleV2a(): ...
def sampleV2b(): ...
def sampleV2c(): ...
def sampleV3(): ...
def sampleV4a(): ...
def sampleV4b(): ...
def sampleV4c(): ...
def sampleV4d(): ...

dataSample5: Incomplete

def sampleV5a(): ...
def sampleV5b(): ...
def sampleV5c1(): ...
def sampleV5c2(): ...
def sampleV5c3(): ...
def sampleV5c4(): ...
def sampleH0a(): ...
def sampleH0b(): ...
def sampleH0c(): ...
def sampleH1(): ...
def sampleH2a(): ...
def sampleH2b(): ...
def sampleH2c(): ...
def sampleH3(): ...
def sampleH4a(): ...
def sampleH4b(): ...
def sampleH4c(): ...
def sampleH4d(): ...
def sampleH5a(): ...
def sampleH5b(): ...
def sampleH5c1(): ...
def sampleH5c2(): ...
def sampleH5c3(): ...
def sampleH5c4(): ...
def sampleSymbol1(): ...
def sampleStacked1(): ...

class SampleH5c4(Drawing):
    def __init__(self, width: int = 400, height: int = 200, *args, **kw) -> None: ...
