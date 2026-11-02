from playwright.sync_api import sync_playwright, expect
from pathlib import Path
import json,re,os,tempfile,sys
out=Path(os.environ.get("PLAZA_REPORT_DIR",tempfile.gettempdir()))/"narrativeos-plaza-layout"
out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(channel="msedge" if sys.platform=="win32" else None,headless=True)
 page=browser.new_page(viewport={"width":1440,"height":1000})
 errors=[]
 page.on("pageerror",lambda error: errors.append(str(error)))
 page.goto(os.environ.get("PLAZA_TEST_URL","http://127.0.0.1:3000/teacher-ecosystem/"),timeout=90000)
 page.wait_for_load_state("networkidle")
 expect(page.locator(".plaza-card").first).to_be_visible()
 assert not page.locator(".plaza-filters").evaluate("element => element.open")
 assert not page.locator(".plaza-filter-options").is_visible()
 assert page.locator(".plaza-grid").evaluate("element => getComputedStyle(element).gridTemplateColumns.split(' ').length") == 4
 assert page.locator(".plaza-card").first.locator(".plaza-card-caption a").count() == 1
 assert page.locator(".plaza-card").first.locator(".plaza-card-caption button").count() == 0
 assert page.locator(".plaza-paper-copy").count() == 0
 assert page.locator(".plaza-sidebar").bounding_box()["x"] < 25
 width=page.locator(".plaza-card-visual").first.bounding_box()["width"]
 cover=page.locator(".plaza-card-visual .plaza-cover").first.bounding_box()["width"]
 assert cover >= width - 2
 for visual in page.locator(".plaza-card-visual").all():
  box=visual.bounding_box()
  assert abs(box["height"] / box["width"] - 9/16) < .01
 heights=page.locator(".plaza-paper").evaluate_all("elements => elements.map(element => element.getBoundingClientRect().height)")
 assert max(heights)-min(heights) < 2
 assert page.locator(".plaza-card .plaza-author").count() == page.locator(".plaza-card").count()
 for card in page.locator(".plaza-card").all():
  image=card.locator(".plaza-card-visual").bounding_box()
  title=card.locator(".plaza-card-heading").bounding_box()
  assert 0 <= title["y"]-(image["y"]+image["height"]) <= 8
  assert image["width"] >= card.bounding_box()["width"]-3
  assert 1 <= card.locator(".plaza-cover-tags span").count() <= 5
 page.screenshot(path=str(out/"desktop.png"),full_page=True)
 page.locator(".plaza-filter-toggle").click()
 expect(page.locator(".plaza-filter-options")).to_be_visible()
 page.locator(".plaza-filter-toggle").click()
 subject=page.locator(".plaza-sidebar nav").get_by_role("link",name="语文",exact=True)
 subject.click()
 page.wait_for_load_state("networkidle")
 expect(page).to_have_url(re.compile("subject="))
 expect(page.locator(".plaza-sidebar nav a[aria-current=true]")).to_have_text("语文✓")
 page.locator(".plaza-cover-button").first.click()
 expect(page.get_by_role("dialog")).to_be_visible()
 page.keyboard.press("Escape")
 expect(page.get_by_role("dialog")).not_to_be_visible()
 for width,columns in [(1100,3),(820,2),(390,1)]:
  page.set_viewport_size({"width":width,"height":900})
  assert page.locator(".plaza-grid").evaluate("element => getComputedStyle(element).gridTemplateColumns.split(' ').length") == columns
  assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
  page.screenshot(path=str(out/f"width-{width}.png"),full_page=True)
 page.locator(".plaza-filter-toggle").click()
 expect(page.locator(".plaza-filter-options")).to_be_visible()
 page.locator(".plaza-advanced summary").click()
 assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
 assert not errors,errors
 print(json.dumps({"status":"passed","screenshots":str(out)}))
 browser.close()
