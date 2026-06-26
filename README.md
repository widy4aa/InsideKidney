# InsideKidney

## Local server

Use the project server instead of plain `python -m http.server` so PDF, OBJ,
JavaScript modules, and other assets are served with the right MIME types.

```bash
python3 server.py --port 8000
```

On Windows, use:

```bat
python server.py --port 8000
```

Then open:

- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/viewer.html`

For testing from a phone on the same Wi-Fi, bind to all interfaces:

```bash
python3 server.py --host 0.0.0.0 --port 8000
```
