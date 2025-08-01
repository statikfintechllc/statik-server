# This is a slight lie, the implementations aren't exactly identical
# However, in all likelihood, the differences are inconsequential
import sys
from _decimal import *

__all__ = [
    "Decimal",
    "Context",
    "DecimalTuple",
    "DefaultContext",
    "BasicContext",
    "ExtendedContext",
    "DecimalException",
    "Clamped",
    "InvalidOperation",
    "DivisionByZero",
    "Inexact",
    "Rounded",
    "Subnormal",
    "Overflow",
    "Underflow",
    "FloatOperation",
    "DivisionImpossible",
    "InvalidContext",
    "ConversionSyntax",
    "DivisionUndefined",
    "ROUND_DOWN",
    "ROUND_HALF_UP",
    "ROUND_HALF_EVEN",
    "ROUND_CEILING",
    "ROUND_FLOOR",
    "ROUND_UP",
    "ROUND_HALF_DOWN",
    "ROUND_05UP",
    "setcontext",
    "getcontext",
    "localcontext",
    "MAX_PREC",
    "MAX_EMAX",
    "MIN_EMIN",
    "MIN_ETINY",
    "HAVE_THREADS",
    "HAVE_CONTEXTVAR",
]

if sys.version_info >= (3, 14):
    __all__ += ["IEEEContext", "IEEE_CONTEXT_MAX_BITS"]
