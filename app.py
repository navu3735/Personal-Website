import os
from flask import Flask, render_template, send_from_directory

app = Flask(__name__)


def _asset_version():
    """Return latest mtime of key static assets for cache busting."""
    paths = [
        os.path.join(app.static_folder, "css", "style.css"),
        os.path.join(app.static_folder, "js", "starfield.js"),
    ]
    mtimes = []
    for path in paths:
        try:
            mtimes.append(int(os.path.getmtime(path)))
        except OSError:
            pass
    return max(mtimes) if mtimes else 0


@app.context_processor
def inject_globals():
    return {"asset_v": _asset_version()}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/projects")
def projects():
    return render_template("projects.html")


@app.route("/achievements")
def achievements():
    return render_template("achievements.html")


@app.route("/certifications")
def certifications():
    return render_template("certifications.html")


@app.route("/resume")
def resume():
    return send_from_directory(app.static_folder, "resume.pdf")


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(app.static_folder, "favicon.svg", mimetype="image/svg+xml")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
