"""Configure an explicit development-IP vhost without changing domain vhosts."""
import ipaddress
from pathlib import Path
import re
import subprocess
import sys
import time
import urllib.request
from urllib.parse import urlsplit


def location(source, prefix):
    match = re.search(r"location\s+(?:\^~\s+)?" + re.escape(prefix) + r"\s*\{", source)
    if not match:
        raise RuntimeError(f"Existing routing for {prefix} missing")
    depth = 1
    end = match.end()
    while depth and end < len(source):
        depth += (source[end] == "{") - (source[end] == "}")
        end += 1
    if depth:
        raise RuntimeError("Unbalanced existing nginx location")
    return source[match.start():end]


def main():
    url, port = sys.argv[1:]
    host = urlsplit(url).hostname
    ipaddress.IPv4Address(host)  # This helper never configures production domain names.
    port = int(port)
    if port == 3002 or not 1 <= port <= 65535:
        raise RuntimeError("Invalid development portal port")
    def read(url, host_header=None):
        req = urllib.request.Request(url, headers={"Host": host_header} if host_header else {})
        with urllib.request.urlopen(req, timeout=30) as response:
            return response.read().decode()
    for attempt in range(30):
        try:
            if 'class="plaza-paper"' in read(f"http://127.0.0.1:{port}/teacher-ecosystem/") or 'plaza-resources' in read(f"http://127.0.0.1:{port}/teacher-ecosystem/"):
                break
        except (OSError, TimeoutError):
            pass
        time.sleep(2)
    else:
        raise RuntimeError("Development portal did not serve the new layout")
    # Read the existing domain route blocks, retaining rewrites and streaming headers.
    source = Path('/etc/nginx/sites-enabled/narrativeos').read_text()
    workbench = location(source, '/narrativeos/')
    playback = location(source, '/play/')
    target = Path('/etc/nginx/conf.d/narrativeos-development-ip.conf')
    content = f"""# Managed by linchangWeb development deployment; domain vhosts remain separate.
server {{
    listen 80;
    server_name {host};
    client_max_body_size 100m;
    {workbench}
    {playback}
    location / {{
        proxy_pass http://127.0.0.1:{port};
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }}
}}
"""
    previous = target.read_bytes() if target.exists() else None
    def restore():
        if previous is None:
            target.unlink(missing_ok=True)
        else:
            target.write_bytes(previous)
        subprocess.run(['nginx', '-t'], check=True)
        subprocess.run(['systemctl', 'reload', 'nginx'], check=True)
    try:
        target.write_text(content)
        checked = subprocess.run(['nginx', '-T'], check=True, capture_output=True, text=True)
        if f'configuration file {target}:' not in checked.stdout + checked.stderr:
            raise RuntimeError('Development vhost directory is not included by nginx')
        if 'conflicting server name' in checked.stderr:
            raise RuntimeError('Conflicting nginx server name; refusing to reload')
        subprocess.run(['systemctl', 'reload', 'nginx'], check=True)
        for attempt in range(10):
            page = read('http://127.0.0.1/teacher-ecosystem/', host)
            if 'plaza-resources' in page and 'ecosystem-hero' not in page:
                break
            time.sleep(1)
        else:
            raise RuntimeError('Public IP vhost still does not serve the new layout')
    except Exception:
        restore()
        raise
    print(f'Verified development IP {host}:80 -> portal {port}; existing workbench/play routes preserved')


if __name__ == '__main__':
    main()
