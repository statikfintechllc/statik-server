from _typeshed import Incomplete

from sympy.core.logic import FuzzyBool
from sympy.core.symbol import Symbol
from sympy.matrices.kind import MatrixKind
from sympy.printing.defaults import Printable
from sympy.utilities.iterables import NotIterable

__doctest_requires__: Incomplete

class MatrixBase(Printable):
    __array_priority__: int
    is_Matrix: bool
    zero: Incomplete
    one: Incomplete
    rows: int
    cols: int
    def __eq__(self, other): ...
    def __getitem__(self, key) -> None: ...
    @property
    def shape(self): ...
    def col_del(self, col): ...
    def col_insert(self, pos, other): ...
    def col_join(self, other): ...
    def col(self, j): ...
    def extract(self, rowsList, colsList): ...
    def get_diag_blocks(self): ...
    @classmethod
    def hstack(cls, *args): ...
    def reshape(self, rows, cols): ...
    def row_del(self, row): ...
    def row_insert(self, pos, other): ...
    def row_join(self, other): ...
    def diagonal(self, k: int = 0): ...
    def row(self, i): ...
    def todok(self): ...
    @classmethod
    def from_dok(cls, rows, cols, dok): ...
    def tolist(self): ...
    def todod(M): ...
    def vec(self): ...
    def vech(self, diagonal: bool = True, check_symmetry: bool = True): ...
    @classmethod
    def vstack(cls, *args): ...
    @classmethod
    def diag(
        cls,
        *args,
        strict: bool = False,
        unpack: bool = True,
        rows: Incomplete | None = None,
        cols: Incomplete | None = None,
        **kwargs,
    ): ...
    @classmethod
    def eye(cls, rows, cols: Incomplete | None = None, **kwargs): ...
    @classmethod
    def jordan_block(
        cls, size: Incomplete | None = None, eigenvalue: Incomplete | None = None, *, band: str = "upper", **kwargs
    ): ...
    @classmethod
    def ones(cls, rows, cols: Incomplete | None = None, **kwargs): ...
    @classmethod
    def zeros(cls, rows, cols: Incomplete | None = None, **kwargs): ...
    @classmethod
    def companion(cls, poly): ...
    @classmethod
    def wilkinson(cls, n, **kwargs): ...
    def atoms(self, *types): ...
    @property
    def free_symbols(self): ...
    def has(self, *patterns): ...
    def is_anti_symmetric(self, simplify: bool = True): ...
    def is_diagonal(self): ...
    @property
    def is_weakly_diagonally_dominant(self): ...
    @property
    def is_strongly_diagonally_dominant(self): ...
    @property
    def is_hermitian(self): ...
    @property
    def is_Identity(self) -> FuzzyBool: ...
    @property
    def is_lower_hessenberg(self): ...
    @property
    def is_lower(self): ...
    @property
    def is_square(self): ...
    def is_symbolic(self): ...
    def is_symmetric(self, simplify: bool = True): ...
    @property
    def is_upper_hessenberg(self): ...
    @property
    def is_upper(self): ...
    @property
    def is_zero_matrix(self): ...
    def values(self): ...
    def iter_values(self): ...
    def iter_items(self): ...
    def adjoint(self): ...
    def applyfunc(self, f): ...
    def as_real_imag(self, deep: bool = True, **hints): ...
    def conjugate(self): ...
    def doit(self, **hints): ...
    def evalf(
        self,
        n: int = 15,
        subs: Incomplete | None = None,
        maxn: int = 100,
        chop: bool = False,
        strict: bool = False,
        quad: Incomplete | None = None,
        verbose: bool = False,
    ): ...
    def expand(
        self,
        deep: bool = True,
        modulus: Incomplete | None = None,
        power_base: bool = True,
        power_exp: bool = True,
        mul: bool = True,
        log: bool = True,
        multinomial: bool = True,
        basic: bool = True,
        **hints,
    ): ...
    @property
    def H(self): ...
    def permute(self, perm, orientation: str = "rows", direction: str = "forward"): ...
    def permute_cols(self, swaps, direction: str = "forward"): ...
    def permute_rows(self, swaps, direction: str = "forward"): ...
    def refine(self, assumptions: bool = True): ...
    def replace(self, F, G, map: bool = False, simultaneous: bool = True, exact: Incomplete | None = None): ...
    def rot90(self, k: int = 1): ...
    def simplify(self, **kwargs): ...
    def subs(self, *args, **kwargs): ...
    def trace(self): ...
    def transpose(self): ...
    @property
    def T(self): ...
    @property
    def C(self): ...
    def n(self, *args, **kwargs): ...
    def xreplace(self, rule): ...
    def upper_triangular(self, k: int = 0): ...
    def lower_triangular(self, k: int = 0): ...
    def __abs__(self): ...
    def __add__(self, other): ...
    def __truediv__(self, other): ...
    def __matmul__(self, other): ...
    def __mod__(self, other): ...
    def __mul__(self, other): ...
    def multiply(self, other, dotprodsimp: Incomplete | None = None): ...
    def multiply_elementwise(self, other): ...
    def __neg__(self): ...
    def __pow__(self, exp): ...
    def pow(self, exp, method: Incomplete | None = None): ...
    def __radd__(self, other): ...
    def __rmatmul__(self, other): ...
    def __rmul__(self, other): ...
    def rmultiply(self, other, dotprodsimp: Incomplete | None = None): ...
    def __rsub__(self, a): ...
    def __sub__(self, a): ...
    def adjugate(self, method: str = "berkowitz"): ...
    def charpoly(self, x: str = "lambda", simplify=...): ...
    def cofactor(self, i, j, method: str = "berkowitz"): ...
    def cofactor_matrix(self, method: str = "berkowitz"): ...
    def det(self, method: str = "bareiss", iszerofunc: Incomplete | None = None): ...
    def per(self): ...
    def minor(self, i, j, method: str = "berkowitz"): ...
    def minor_submatrix(self, i, j): ...
    def echelon_form(self, iszerofunc=..., simplify: bool = False, with_pivots: bool = False): ...
    @property
    def is_echelon(self): ...
    def rank(self, iszerofunc=..., simplify: bool = False): ...
    def rref_rhs(self, rhs): ...
    def rref(self, iszerofunc=..., simplify: bool = False, pivots: bool = True, normalize_last: bool = True): ...
    def elementary_col_op(
        self,
        op: str = "n->kn",
        col: Incomplete | None = None,
        k: Incomplete | None = None,
        col1: Incomplete | None = None,
        col2: Incomplete | None = None,
    ): ...
    def elementary_row_op(
        self,
        op: str = "n->kn",
        row: Incomplete | None = None,
        k: Incomplete | None = None,
        row1: Incomplete | None = None,
        row2: Incomplete | None = None,
    ): ...
    def columnspace(self, simplify: bool = False): ...
    def nullspace(self, simplify: bool = False, iszerofunc=...): ...
    def rowspace(self, simplify: bool = False): ...
    @classmethod
    def orthogonalize(cls, *vecs, **kwargs): ...
    def eigenvals(self, error_when_incomplete: bool = True, **flags): ...
    def eigenvects(self, error_when_incomplete: bool = True, iszerofunc=..., **flags): ...
    def is_diagonalizable(self, reals_only: bool = False, **kwargs): ...
    def diagonalize(self, reals_only: bool = False, sort: bool = False, normalize: bool = False): ...
    def bidiagonalize(self, upper: bool = True): ...
    def bidiagonal_decomposition(self, upper: bool = True): ...
    @property
    def is_positive_definite(self): ...
    @property
    def is_positive_semidefinite(self): ...
    @property
    def is_negative_definite(self): ...
    @property
    def is_negative_semidefinite(self): ...
    @property
    def is_indefinite(self): ...
    def jordan_form(self, calc_transform: bool = True, **kwargs): ...
    def left_eigenvects(self, **flags): ...
    def singular_values(self): ...
    def diff(self, *args, evaluate: bool = True, **kwargs): ...
    def integrate(self, *args, **kwargs): ...
    def jacobian(self, X): ...
    def limit(self, *args): ...
    def berkowitz_charpoly(self, x=..., simplify=...): ...
    def berkowitz_det(self): ...
    def berkowitz_eigenvals(self, **flags): ...
    def berkowitz_minors(self): ...
    def berkowitz(self): ...
    def cofactorMatrix(self, method: str = "berkowitz"): ...
    def det_bareis(self): ...
    def det_LU_decomposition(self): ...
    def jordan_cell(self, eigenval, n): ...
    def jordan_cells(self, calc_transformation: bool = True): ...
    def minorEntry(self, i, j, method: str = "berkowitz"): ...
    def minorMatrix(self, i, j): ...
    def permuteBkwd(self, perm): ...
    def permuteFwd(self, perm): ...
    @property
    def kind(self) -> MatrixKind: ...
    def flat(self): ...
    def __array__(self, dtype=..., copy: Incomplete | None = None): ...
    def __len__(self) -> int: ...
    @classmethod
    def irregular(cls, ntop, *matrices, **kwargs): ...
    def add(self, b): ...
    def condition_number(self): ...
    def copy(self): ...
    def cross(self, b): ...
    def hat(self): ...
    def vee(self): ...
    @property
    def D(self): ...
    def dot(self, b, hermitian: Incomplete | None = None, conjugate_convention: Incomplete | None = None): ...
    def dual(self): ...
    def analytic_func(self, f, x): ...
    def exp(self): ...
    def log(self, simplify=...): ...
    def is_nilpotent(self): ...
    def key2bounds(self, keys): ...
    def key2ij(self, key): ...
    def normalized(self, iszerofunc=...): ...
    def norm(self, ord: Incomplete | None = None): ...
    def print_nonzero(self, symb: str = "X") -> None: ...
    def project(self, v): ...
    def table(
        self, printer, rowstart: str = "[", rowend: str = "]", rowsep: str = "\n", colsep: str = ", ", align: str = "right"
    ): ...
    def rank_decomposition(self, iszerofunc=..., simplify: bool = False): ...
    def cholesky(self, hermitian: bool = True) -> None: ...
    def LDLdecomposition(self, hermitian: bool = True) -> None: ...
    def LUdecomposition(self, iszerofunc=..., simpfunc: Incomplete | None = None, rankcheck: bool = False): ...
    def LUdecomposition_Simple(self, iszerofunc=..., simpfunc: Incomplete | None = None, rankcheck: bool = False): ...
    def LUdecompositionFF(self): ...
    def singular_value_decomposition(self): ...
    def QRdecomposition(self): ...
    def upper_hessenberg_decomposition(self): ...
    def diagonal_solve(self, rhs): ...
    def lower_triangular_solve(self, rhs) -> None: ...
    def upper_triangular_solve(self, rhs) -> None: ...
    def cholesky_solve(self, rhs): ...
    def LDLsolve(self, rhs): ...
    def LUsolve(self, rhs, iszerofunc=...): ...
    def QRsolve(self, b): ...
    def gauss_jordan_solve(self, B, freevar: bool = False): ...
    def pinv_solve(self, B, arbitrary_matrix: Incomplete | None = None): ...
    def cramer_solve(self, rhs, det_method: str = "laplace"): ...
    def solve(self, rhs, method: str = "GJ"): ...
    def solve_least_squares(self, rhs, method: str = "CH"): ...
    def pinv(self, method: str = "RD"): ...
    def inverse_ADJ(self, iszerofunc=...): ...
    def inverse_BLOCK(self, iszerofunc=...): ...
    def inverse_GE(self, iszerofunc=...): ...
    def inverse_LU(self, iszerofunc=...): ...
    def inverse_CH(self, iszerofunc=...): ...
    def inverse_LDL(self, iszerofunc=...): ...
    def inverse_QR(self, iszerofunc=...): ...
    def inv(self, method: Incomplete | None = None, iszerofunc=..., try_block_diag: bool = False): ...
    def connected_components(self): ...
    def connected_components_decomposition(self): ...
    def strongly_connected_components(self): ...
    def strongly_connected_components_decomposition(self, lower: bool = True): ...

def classof(A, B): ...
def a2idx(j, n: Incomplete | None = None): ...

class DeferredVector(Symbol, NotIterable):
    def __getitem__(self, i): ...
