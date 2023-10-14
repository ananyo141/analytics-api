export default function syntaxHighlight(json: string | object) {
  if (typeof json !== "string") {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key text-gray-600";
        } else {
          cls = "string text-blue-500";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean text-red-500";
      } else if (/null/.test(match)) {
        cls = "null text-gray-500";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}
