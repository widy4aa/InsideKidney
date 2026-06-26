#!/usr/bin/env python3
"""Small static server for InsideKidney.

Python's default http.server is usually enough, but some systems return weak
MIME types for 3D/PDF assets. This handler pins the content types used by the
viewer so OBJ models, ES modules, JSON, images, and PDFs load consistently.
"""

from __future__ import annotations

import argparse
import functools
import mimetypes
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".obj": "text/plain; charset=utf-8",
    ".mtl": "text/plain; charset=utf-8",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".wasm": "application/wasm",
}


class InsideKidneyHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        **MIME_TYPES,
    }

    def guess_type(self, path: str) -> str:
        suffix = Path(path).suffix.lower()
        if suffix in MIME_TYPES:
            return MIME_TYPES[suffix]
        return super().guess_type(path)

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cross-Origin-Resource-Policy", "cross-origin")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the InsideKidney static server.")
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind. Use 0.0.0.0 for phone testing on LAN.")
    parser.add_argument("--port", type=int, default=8000, help="Port to serve on.")
    parser.add_argument("--dir", default=".", help="Directory to serve.")
    args = parser.parse_args()

    root = Path(args.dir).resolve()
    for ext, mime_type in MIME_TYPES.items():
        mimetypes.add_type(mime_type, ext)

    handler = functools.partial(InsideKidneyHandler, directory=str(root))
    server = ThreadingHTTPServer((args.host, args.port), handler)

    url_host = "127.0.0.1" if args.host in {"0.0.0.0", ""} else args.host
    print(f"Serving InsideKidney from: {root}")
    print(f"Open: http://{url_host}:{args.port}/")
    print(f"3D Explorer: http://{url_host}:{args.port}/viewer.html")
    print("Press Ctrl+C to stop.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
