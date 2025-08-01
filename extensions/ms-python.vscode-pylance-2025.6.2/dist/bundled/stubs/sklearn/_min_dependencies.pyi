SCIPY_MIN_VERSION: str = ...
JOBLIB_MIN_VERSION: str = ...
THREADPOOLCTL_MIN_VERSION: str = ...
PYTEST_MIN_VERSION: str = ...
CYTHON_MIN_VERSION: str = ...

# 'build' and 'install' is included to have structured metadata for CI.
# It will NOT be included in setup's extras_require
# The values are (version_spec, comma separated tags)
dependent_packages: dict = ...

# create inverse mapping for setuptools
tag_to_packages: dict = ...
