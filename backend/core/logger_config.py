import logging
from logging.handlers import RotatingFileHandler
from typing import Optional

DEFAULT_FMT = "[%(asctime)s] %(levelname)s | %(name)s | %(message)s"
DATE_FMT = "%Y-%m-%d %H:%M:%S"


def setup_logger(
    name: str,
    level: int = logging.INFO,
    *,
    stream: bool = True,
    log_file: Optional[str] = None,
    max_bytes: int = 1_048_576,  # 1 MB
    backup_count: int = 3,
) -> logging.Logger:
    """
    Create (or return) a configured logger.

    Args:
        name:          logger name
        level:         logging level (DEBUG, INFO, …)
        stream:        include StreamHandler to stdout
        log_file:      optional file path for RotatingFileHandler
        max_bytes:     rollover size for file handler
        backup_count:  number of rotated files to keep

    Returns:
        logging.Logger instance
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Avoid duplicate handlers on re-initialisation
    if logger.handlers:
        return logger

    formatter = logging.Formatter(DEFAULT_FMT, datefmt=DATE_FMT)

    if stream:
        sh = logging.StreamHandler()
        sh.setFormatter(formatter)
        logger.addHandler(sh)

    if log_file:
        fh = RotatingFileHandler(log_file, maxBytes=max_bytes, backupCount=backup_count)
        fh.setFormatter(formatter)
        logger.addHandler(fh)

    logger.debug("Logger '%s' initialised (level=%s)", name, logging.getLevelName(level))
    return logger


# Example usage
logger = setup_logger("Stillbit", level=logging.DEBUG, log_file="stillbit.log")
logger.info("Logger ready")
