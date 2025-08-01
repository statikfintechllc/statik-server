import datetime
import http.client
import ssl
import sys
from _typeshed import ReadableBuffer, StrPath
from collections.abc import Callable
from logging import FileHandler, Handler, LogRecord
from re import Pattern
from socket import SocketKind, socket
from threading import Thread
from types import TracebackType
from typing import Any, ClassVar, Final, Protocol, TypeVar
from typing_extensions import Self

_T = TypeVar("_T")

DEFAULT_TCP_LOGGING_PORT: Final[int]
DEFAULT_UDP_LOGGING_PORT: Final[int]
DEFAULT_HTTP_LOGGING_PORT: Final[int]
DEFAULT_SOAP_LOGGING_PORT: Final[int]
SYSLOG_UDP_PORT: Final[int]
SYSLOG_TCP_PORT: Final[int]

class WatchedFileHandler(FileHandler):
    dev: int  # undocumented
    ino: int  # undocumented
    def __init__(
        self, filename: StrPath, mode: str = "a", encoding: str | None = None, delay: bool = False, errors: str | None = None
    ) -> None: ...
    def _statstream(self) -> None: ...  # undocumented
    def reopenIfNeeded(self) -> None: ...

class BaseRotatingHandler(FileHandler):
    namer: Callable[[str], str] | None
    rotator: Callable[[str, str], None] | None
    def __init__(
        self, filename: StrPath, mode: str, encoding: str | None = None, delay: bool = False, errors: str | None = None
    ) -> None: ...
    def rotation_filename(self, default_name: str) -> str: ...
    def rotate(self, source: str, dest: str) -> None: ...

class RotatingFileHandler(BaseRotatingHandler):
    maxBytes: int  # undocumented
    backupCount: int  # undocumented
    def __init__(
        self,
        filename: StrPath,
        mode: str = "a",
        maxBytes: int = 0,
        backupCount: int = 0,
        encoding: str | None = None,
        delay: bool = False,
        errors: str | None = None,
    ) -> None: ...
    def doRollover(self) -> None: ...
    def shouldRollover(self, record: LogRecord) -> int: ...  # undocumented

class TimedRotatingFileHandler(BaseRotatingHandler):
    when: str  # undocumented
    backupCount: int  # undocumented
    utc: bool  # undocumented
    atTime: datetime.time | None  # undocumented
    interval: int  # undocumented
    suffix: str  # undocumented
    dayOfWeek: int  # undocumented
    rolloverAt: int  # undocumented
    extMatch: Pattern[str]  # undocumented
    def __init__(
        self,
        filename: StrPath,
        when: str = "h",
        interval: int = 1,
        backupCount: int = 0,
        encoding: str | None = None,
        delay: bool = False,
        utc: bool = False,
        atTime: datetime.time | None = None,
        errors: str | None = None,
    ) -> None: ...
    def doRollover(self) -> None: ...
    def shouldRollover(self, record: LogRecord) -> int: ...  # undocumented
    def computeRollover(self, currentTime: int) -> int: ...  # undocumented
    def getFilesToDelete(self) -> list[str]: ...  # undocumented

class SocketHandler(Handler):
    host: str  # undocumented
    port: int | None  # undocumented
    address: tuple[str, int] | str  # undocumented
    sock: socket | None  # undocumented
    closeOnError: bool  # undocumented
    retryTime: float | None  # undocumented
    retryStart: float  # undocumented
    retryFactor: float  # undocumented
    retryMax: float  # undocumented
    def __init__(self, host: str, port: int | None) -> None: ...
    def makeSocket(self, timeout: float = 1) -> socket: ...  # timeout is undocumented
    def makePickle(self, record: LogRecord) -> bytes: ...
    def send(self, s: ReadableBuffer) -> None: ...
    def createSocket(self) -> None: ...

class DatagramHandler(SocketHandler):
    def makeSocket(self) -> socket: ...  # type: ignore[override]

class SysLogHandler(Handler):
    LOG_EMERG: int
    LOG_ALERT: int
    LOG_CRIT: int
    LOG_ERR: int
    LOG_WARNING: int
    LOG_NOTICE: int
    LOG_INFO: int
    LOG_DEBUG: int

    LOG_KERN: int
    LOG_USER: int
    LOG_MAIL: int
    LOG_DAEMON: int
    LOG_AUTH: int
    LOG_SYSLOG: int
    LOG_LPR: int
    LOG_NEWS: int
    LOG_UUCP: int
    LOG_CRON: int
    LOG_AUTHPRIV: int
    LOG_FTP: int
    LOG_NTP: int
    LOG_SECURITY: int
    LOG_CONSOLE: int
    LOG_SOLCRON: int
    LOG_LOCAL0: int
    LOG_LOCAL1: int
    LOG_LOCAL2: int
    LOG_LOCAL3: int
    LOG_LOCAL4: int
    LOG_LOCAL5: int
    LOG_LOCAL6: int
    LOG_LOCAL7: int
    address: tuple[str, int] | str  # undocumented
    unixsocket: bool  # undocumented
    socktype: SocketKind  # undocumented
    ident: str  # undocumented
    append_nul: bool  # undocumented
    facility: int  # undocumented
    priority_names: ClassVar[dict[str, int]]  # undocumented
    facility_names: ClassVar[dict[str, int]]  # undocumented
    priority_map: ClassVar[dict[str, str]]  # undocumented
    if sys.version_info >= (3, 14):
        timeout: float | None
        def __init__(
            self,
            address: tuple[str, int] | str = ("localhost", 514),
            facility: str | int = 1,
            socktype: SocketKind | None = None,
            timeout: float | None = None,
        ) -> None: ...
    else:
        def __init__(
            self, address: tuple[str, int] | str = ("localhost", 514), facility: str | int = 1, socktype: SocketKind | None = None
        ) -> None: ...
    if sys.version_info >= (3, 11):
        def createSocket(self) -> None: ...

    def encodePriority(self, facility: int | str, priority: int | str) -> int: ...
    def mapPriority(self, levelName: str) -> str: ...

class NTEventLogHandler(Handler):
    def __init__(self, appname: str, dllname: str | None = None, logtype: str = "Application") -> None: ...
    def getEventCategory(self, record: LogRecord) -> int: ...
    # TODO: correct return value?
    def getEventType(self, record: LogRecord) -> int: ...
    def getMessageID(self, record: LogRecord) -> int: ...

class SMTPHandler(Handler):
    mailhost: str  # undocumented
    mailport: int | None  # undocumented
    username: str | None  # undocumented
    # password only exists as an attribute if passed credentials is a tuple or list
    password: str  # undocumented
    fromaddr: str  # undocumented
    toaddrs: list[str]  # undocumented
    subject: str  # undocumented
    secure: tuple[()] | tuple[str] | tuple[str, str] | None  # undocumented
    timeout: float  # undocumented
    def __init__(
        self,
        mailhost: str | tuple[str, int],
        fromaddr: str,
        toaddrs: str | list[str],
        subject: str,
        credentials: tuple[str, str] | None = None,
        secure: tuple[()] | tuple[str] | tuple[str, str] | None = None,
        timeout: float = 5.0,
    ) -> None: ...
    def getSubject(self, record: LogRecord) -> str: ...

class BufferingHandler(Handler):
    capacity: int  # undocumented
    buffer: list[LogRecord]  # undocumented
    def __init__(self, capacity: int) -> None: ...
    def shouldFlush(self, record: LogRecord) -> bool: ...

class MemoryHandler(BufferingHandler):
    flushLevel: int  # undocumented
    target: Handler | None  # undocumented
    flushOnClose: bool  # undocumented
    def __init__(self, capacity: int, flushLevel: int = 40, target: Handler | None = None, flushOnClose: bool = True) -> None: ...
    def setTarget(self, target: Handler | None) -> None: ...

class HTTPHandler(Handler):
    host: str  # undocumented
    url: str  # undocumented
    method: str  # undocumented
    secure: bool  # undocumented
    credentials: tuple[str, str] | None  # undocumented
    context: ssl.SSLContext | None  # undocumented
    def __init__(
        self,
        host: str,
        url: str,
        method: str = "GET",
        secure: bool = False,
        credentials: tuple[str, str] | None = None,
        context: ssl.SSLContext | None = None,
    ) -> None: ...
    def mapLogRecord(self, record: LogRecord) -> dict[str, Any]: ...
    def getConnection(self, host: str, secure: bool) -> http.client.HTTPConnection: ...  # undocumented

class _QueueLike(Protocol[_T]):
    def get(self) -> _T: ...
    def put_nowait(self, item: _T, /) -> None: ...

class QueueHandler(Handler):
    queue: _QueueLike[Any]
    def __init__(self, queue: _QueueLike[Any]) -> None: ...
    def prepare(self, record: LogRecord) -> Any: ...
    def enqueue(self, record: LogRecord) -> None: ...
    if sys.version_info >= (3, 12):
        listener: QueueListener | None

class QueueListener:
    handlers: tuple[Handler, ...]  # undocumented
    respect_handler_level: bool  # undocumented
    queue: _QueueLike[Any]  # undocumented
    _thread: Thread | None  # undocumented
    def __init__(self, queue: _QueueLike[Any], *handlers: Handler, respect_handler_level: bool = False) -> None: ...
    def dequeue(self, block: bool) -> LogRecord: ...
    def prepare(self, record: LogRecord) -> Any: ...
    def start(self) -> None: ...
    def stop(self) -> None: ...
    def enqueue_sentinel(self) -> None: ...
    def handle(self, record: LogRecord) -> None: ...

    if sys.version_info >= (3, 14):
        def __enter__(self) -> Self: ...
        def __exit__(
            self, exc_type: type[BaseException] | None, exc_value: BaseException | None, traceback: TracebackType | None
        ) -> None: ...
