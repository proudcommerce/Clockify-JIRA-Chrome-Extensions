const JIRA_BASE_URL = "YOUR_JIRA_URL/browse/";

function createJiraLink(ticketId) {
    const link = document.createElement("a");
    link.href = JIRA_BASE_URL + ticketId;
    link.target = "_blank";
    link.className = "jira-link-icon";
    link.style.marginRight = "6px";
    link.style.cursor = "pointer";
    link.style.fontSize = "14px";
    link.title = `JIRA Ticket ${ticketId} öffnen`;
    link.innerHTML = "🔗";
    return link;
}

function findJiraIdInElement(element) {
    const jiraRegex = /([A-Z]+-\d+)/g;
    const matches = [...element.textContent.matchAll(jiraRegex)];
    return matches.length > 0 ? matches[0][0] : null;
}

function addUnifiedJiraLink(entryNode) {
    const existingIcon = entryNode.querySelector(".jira-link-icon");
    if (existingIcon) return; // Bereits vorhanden

    const description = entryNode.querySelector('[data-cy="time-entry-description"]');
    if (!description) return;

    const project = entryNode.querySelector('.cl-project-name-colored');

    const descriptionId = findJiraIdInElement(description);
    const projectId = findJiraIdInElement(project || { textContent: "" });

    const ticketId = descriptionId || projectId;
    if (!ticketId) return;

    const wrapper = description.closest(".cl-fake-input-wrapper");
    if (!wrapper) return;

    const icon = createJiraLink(ticketId);
    wrapper.parentNode.insertBefore(icon, wrapper);
    console.log(`Jira-Link für ${ticketId} hinzugefügt.`);
}

function observeNewTickets() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches("time-tracker-entry")) {
                    addUnifiedJiraLink(node);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

document.querySelectorAll("time-tracker-entry").forEach(addUnifiedJiraLink);

observeNewTickets();