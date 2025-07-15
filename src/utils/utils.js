export function html2dom(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template;
}