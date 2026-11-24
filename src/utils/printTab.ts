/** `pageCss` adds print rules such as `@page { size: A4; margin: 0 }`. */
export function openPrintTab(title: string, contentEl: HTMLElement, pageCss = ""): void {
  const win = window.open("", "_blank", "width=900,height=900");
  if (!win) return;

  win.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>body { margin: 0; } ${pageCss}</style>
  </head>
  <body>
    ${contentEl.outerHTML}
    <script>window.onload = function () { window.focus(); window.print(); };</script>
  </body>
</html>`);
  win.document.close();
}
