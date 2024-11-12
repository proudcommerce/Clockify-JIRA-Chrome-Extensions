const JIRA_BASE_URL = "YOUR_JIRA_URL/browse/";

function addJiraLinkIcon(element) {
    const jiraRegex = /([A-Z]+-\d+)/g;
    const textContent = element.textContent;
    const matches = [...textContent.matchAll(jiraRegex)];

    if (matches.length > 0) {
        const parentContainer = element.closest('.cl-col-responsive.cl-description-col');
        if (parentContainer && !parentContainer.previousSibling?.classList?.contains('jira-link-icon')) {
            const ticketId = matches[0][0];
            const jiraUrl = JIRA_BASE_URL + ticketId;
            const icon = document.createElement('a');
            icon.href = jiraUrl;
            icon.target = "_blank";
            icon.className = "jira-link-icon";
            icon.style.marginLeft = "10px";
            icon.style.cursor = "pointer";
            icon.style.fontSize = "14px";
            icon.title = `JIRA Ticket ${ticketId} öffnen`;
            icon.innerHTML = "🔗";
            parentContainer.parentNode.insertBefore(icon, parentContainer);
            console.log(`Icon für ${ticketId} vor das Description-Element hinzugefügt.`);
        }
    }
}

function observeNewTickets() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const ticketElements = node.querySelectorAll('[data-cy="time-entry-description"]');
                    ticketElements.forEach((el) => addJiraLinkIcon(el));
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

observeNewTickets();
