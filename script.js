const repositoryList = document.querySelector("#repository-list");
const listStatus = document.querySelector("#list-status");

function renderRepositories(repositories) {
  repositoryList.replaceChildren();

  for (const repository of repositories) {
    const item = document.createElement("li");
    item.className = "repository-card";

    const heading = document.createElement("h3");
    const link = document.createElement("a");
    link.href = repository.url;
    link.textContent = `${repository.owner}/${repository.name}`;
    heading.append(link);

    const description = document.createElement("p");
    description.className = "repository-description";
    description.textContent = repository.description;

    const metadata = document.createElement("p");
    metadata.className = "repository-meta";

    if (repository.language) {
      const language = document.createElement("span");
      language.textContent = repository.language;
      metadata.append(language);
    }

    const starred = document.createElement("time");
    starred.dateTime = repository.starredAt;
    starred.textContent = `Starred ${new Date(repository.starredAt).toLocaleDateString()}`;
    metadata.append(starred);

    item.append(heading, description, metadata);
    repositoryList.append(item);
  }

  listStatus.textContent = repositories.length
    ? `${repositories.length} repositories`
    : "No starred repositories yet.";
}

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    renderRepositories(repositories);
  } catch (error) {
    console.error("Unable to load starred repositories:", error);
    listStatus.textContent = "Could not load repositories. Please try again later.";
  }
}

loadRepositories();
