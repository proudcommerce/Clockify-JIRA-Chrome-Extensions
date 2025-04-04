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
    if (!element || !element.textContent) return null;
    const jiraRegex = /([A-Z]+-\d+)/g;
    const matches = [...element.textContent.matchAll(jiraRegex)];
    return matches.length > 0 ? matches[0][0] : null;
}

function addUnifiedJiraLink(entryNode) {
    const existingIcon = entryNode.querySelector(".jira-link-icon");
    if (existingIcon) return;

    // Für reguläre Einträge und Report-Zeilen
    const description = entryNode.querySelector('[data-cy="time-entry-description"], .cl-reports-desc .cl-fake-input');
    const project = entryNode.querySelector('.cl-project-name-colored');
    const summaryTitle = entryNode.querySelector('[data-cy="title"]');

    const descriptionId = findJiraIdInElement(description);
    const projectId = findJiraIdInElement(project);
    const summaryId = findJiraIdInElement(summaryTitle);

    const ticketId = descriptionId || projectId || summaryId;
    if (!ticketId) return;

    let insertBeforeEl = null;

    if (description) {
        const wrapper = description.closest(".cl-fake-input-wrapper");
        if (wrapper && wrapper.parentNode) {
            insertBeforeEl = wrapper;
        }
    } else if (summaryTitle) {
        insertBeforeEl = summaryTitle;
    }

    if (insertBeforeEl && !insertBeforeEl.parentNode.querySelector(".jira-link-icon")) {
        const icon = createJiraLink(ticketId);
        insertBeforeEl.parentNode.insertBefore(icon, insertBeforeEl);
        console.log(`Jira-Link für ${ticketId} hinzugefügt.`);
    }
}

function observeNewTickets() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;

                if (
                    node.matches("time-tracker-entry") ||
                    node.querySelector('[data-cy="time-entry"]') ||
                    node.querySelector('[data-cy="title"]')
                ) {
                    addUnifiedJiraLink(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Initial durchgehen
document.querySelectorAll("time-tracker-entry, [data-cy='time-entry'], [data-cy='title']").forEach(el => {
    const container = el.closest("time-tracker-entry, [data-cy='time-entry'], .cl-component-row");
    if (container) addUnifiedJiraLink(container);
});

observeNewTickets();