// Temporary, local-only diagnostic build for issue #43. No telemetry.
const lines = [];
const counts = { started: 0, loaded: 0, failed: 0, timeout: 0 };
let output;
let scheduled = false;

const safeUrl = (value) => {
  try {
    const url = new URL(value, window.location.href);
    return url.origin + url.pathname; // Never include tokens, query strings or fragments.
  } catch (_) { return "(invalid URL)"; }
};
const render = () => {
  scheduled = false;
  if (output) output.value = [
    "JF-AVATARS issue #43 — diagnostic v1",
    navigator.userAgent,
    "replaceChildren: " + typeof Element.prototype.replaceChildren +
      " | IntersectionObserver: " + typeof window.IntersectionObserver +
      " | Promise.finally: " + typeof Promise.prototype.finally,
    "Grid image requests (this page session): " + JSON.stringify(counts),
    "Only visible/queued images are counted. Screenshot or select/copy this report.",
    ...lines,
  ].join("\n");
};
export const diagnostic = (message) => {
  lines.push(String(message).slice(0, 500));
  if (lines.length > 45) lines.shift();
  if (!scheduled) { scheduled = true; setTimeout(render, 100); }
};
export const diagnosticError = (stage, error) => {
  // Do not expose arbitrary error messages containing credential-bearing URLs.
  const message = String(error && error.message || error || "Unknown error")
    .replace(/https?:[^\s"'<>]+/g, (url) => safeUrl(url));
  diagnostic(stage + ": " + message);
};
export const diagnosticUrl = safeUrl;
export const diagnosticImage = (result, url) => {
  counts[result]++;
  if (result === "failed" || result === "timeout") {
    diagnostic("Image " + result + ": " + safeUrl(url));
  } else if (!scheduled) { scheduled = true; setTimeout(render, 100); }
};
export const initDiagnostics = () => {
  const panel = document.createElement("div");
  panel.id = "jf-avatars-diagnostics";
  panel.style.cssText = "position:fixed;bottom:8px;right:8px;z-index:2147483647;width: min(560px, 94vw);max-width:94vw;background:#151515;color:white;padding:8px;border:2px solid #ffb300;font:13px monospace;";
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Issue #43 diagnostics — hide/show";
  output = document.createElement("textarea");
  output.readOnly = true;
  output.setAttribute("aria-label", "JF Avatars diagnostic report");
  output.style.cssText = "display:block;box-sizing:border-box;width:100%;height:180px;background:#151515;color:white;font:12px monospace;";
  button.onclick = () => { output.style.display = output.style.display === "none" ? "block" : "none"; };
  panel.appendChild(button);
  panel.appendChild(output);
  document.body.appendChild(panel);
  // Capture script failures only; unrelated Jellyfin errors are not collected.
  window.addEventListener("error", (event) => {
    if (/jf-avatars|replaceChildren|IntersectionObserver/.test(event.filename + " " + event.message)) {
      diagnosticError("JavaScript error", event.error || event.message);
    }
  });
  window.addEventListener("unhandledrejection", (event) => {
    const stack = String(event.reason && event.reason.stack || "");
    if (/jf-avatars|replaceChildren/.test(stack)) diagnosticError("Unhandled rejection", event.reason);
  });
  window.addEventListener("securitypolicyviolation", (event) => {
    if (/img-src|connect-src/.test(event.effectiveDirective)) {
      diagnostic("CSP " + event.effectiveDirective + ": " + safeUrl(event.blockedURI));
    }
  });
  diagnostic("Diagnostic build initialized. Open the avatar picker.");
  render();
};
