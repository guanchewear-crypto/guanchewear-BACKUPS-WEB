import json, urllib.request, ssl, http.cookiejar, re, base64, os, sys

KEY = 'QNsQTWxiQjdjZyQsQp5LKbIAdt6n9jD8tKdSdyQgcd550531'
USER = 'u242541158'
SW = '29846570'
DOMAIN = 'guanchewear.es'
APP_PWD = 'Yh8U 5Lgi lIrG Qk08 uYeB 5q34'
WP_USER = 'nauzet'
auth = base64.b64encode(f'{WP_USER}:{APP_PWD}'.encode()).decode()

ctx = ssl.create_default_context()

def api_call(method, path, data=None, host=None):
    url = f'https://{host or "developers.hostinger.com"}{path}'
    headers = {'Authorization': f'Bearer {KEY}', 'Content-Type': 'application/json'}
    body = json.dumps(data).encode() if data else b'{}' if method in ('POST', 'PATCH') else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(req, context=ctx)
        return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return {'error': e.code, 'body': e.read().decode()[:500]}

def wp_api(method, path, data=None):
    url = f'https://{DOMAIN}/wp-json/wp/v2{path}'
    headers = {'Authorization': f'Basic {auth}', 'Content-Type': 'application/json'}
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(req, context=ctx)
        return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return {'error': e.code, 'body': e.read().decode()[:500]}

# 1. List pages
print(f'=== CURRENT PAGES ===')
pages = wp_api('GET', '/pages?per_page=50')
if isinstance(pages, list):
    for p in pages:
        print(f'  ID:{p["id"]} | {p["title"]["rendered"]} | slug:{p["slug"]} | status:{p["status"]}')
else:
    print(f'  ERROR: pages auth: {pages}')

# 2. List posts
print(f'\n=== CURRENT POSTS ===')
posts = wp_api('GET', '/posts?per_page=50')
if isinstance(posts, list):
    for p in posts:
        print(f'  ID:{p["id"]} | {p["title"]["rendered"]} | status:{p["status"]}')

# 3. Check if React page template can be created
print(f'\n=== CHECK TEMPLATES ===')
themes = wp_api('GET', '/themes?status=active')
if isinstance(themes, list):
    for t in themes:
        print(f'  Theme: {t.get("name")} | textdomain: {t.get("textdomain")} | status: {t.get("status")}')

# 4. Get front page setting
settings = wp_api('GET', '/settings')
print(f'\n=== SETTINGS ===')
if 'error' not in settings:
    print(f'  page_on_front: {settings.get("page_on_front")}')
    print(f'  show_on_front: {settings.get("show_on_front")}')
else:
    print(f'  ERROR: {settings}')

# 5. Check current theme directory
print(f'\n=== CHILD THEME PATH ===')
for t in themes:
    if t.get('status') == 'active' or t.get('stylesheet') == 'kadence-child':
        print(f'  Theme: {t.get("name")} | stylesheet: {t.get("stylesheet")} | textdomain: {t.get("textdomain")}')

print('\n=== PLAN ===')
print('1. Backup DB (via Hostinger API if available)')
print('2. Create page template in child theme for React app')
print('3. Build React app and upload static files')
print('4. Set homepage to use new template')