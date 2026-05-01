"""Vercel Python serverless entry point.

Vercel's @vercel/python runtime discovers a WSGI app named ``app`` in this
module and dispatches incoming HTTP requests to it. We just re-export the
Flask app defined at the project root.
"""

import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from app import app  # noqa: E402, F401
