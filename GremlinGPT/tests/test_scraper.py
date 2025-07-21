# ─────────────────────────────────────────────────────────────
# ⚠️ GremlinGPT Fair Use Only | Commercial Use Requires License
# Built under the GremlinGPT Dual License v1.0
# © 2025 StatikFintechLLC / AscendAI Project
# Contact: ascend.gremlin@gmail.com
# ─────────────────────────────────────────────────────────────

# !/usr/bin/env python3

# GremlinGPT v5 :: Module Integrity Directive
# This script is a component of the GremlinGPT system, under Alpha expansion.
# It must test:
#   - That everything integrates seamlessly into the architecture defined in the full outline
#   - Operates autonomously and communicate cross-module via defined protocols
#   - Leverage appropriate dependencies, imports, and interlinks to other systems
#   - Return enhanced — fully wired logic, no placeholders, no guesswork
# Objective:
#   Receive, reinforce, and return each script as a living part of the Gremlin:

# tests/test_scraper.py

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from utils.logging_config import setup_module_logger

# Initialize module logging
logger = setup_module_logger('tests', 'test_scraper')

import asyncio
from scraper.playwright_handler import get_dom_html
from scraper.dom_navigator import extract_dom_structure
from scraper.page_simulator import store_scrape_to_memory

TEST_URL = "https://example.com"


def test_scraper_pipeline():
    logger.info("Starting scraper pipeline test.")
    html = asyncio.run(get_dom_html(TEST_URL))
    logger.debug(f"Fetched HTML: {html[:100]}...")  # Log the first 100 characters of the HTML
    assert "<html" in html.lower()

    parsed = extract_dom_structure(html)
    logger.debug(f"Parsed DOM structure: {parsed}")
    assert "text" in parsed and len(parsed["text"]) > 0

    store_scrape_to_memory(TEST_URL, html)
    logger.info("Scraper pipeline test completed successfully.")
