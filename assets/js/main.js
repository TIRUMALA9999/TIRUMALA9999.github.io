/**
 * Dynamic GitHub repo loader (public repos). No token required.
 * Note: unauthenticated rate limits apply.
 */
const GH_USER = "TIRUMALA9999";

function el(tag, cls, html){
  const x = document.createElement(tag);
  if(cls) x.className = cls;
  if(html !== undefined) x.innerHTML = html;
  return x;
}

function formatDate(iso){
  if(!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {year:"numeric", month:"short", day:"2-digit"});
}

async function loadRepos(){
  const status = document.getElementById("repoStatus");
  const grid = document.getElementById("repoGrid");
  status.textContent = "Loading repositories from GitHub…";
  try{
    const url = `https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`;
    const res = await fetch(url, {headers:{'Accept':'application/vnd.github+json'}});
    if(!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const repos = await res.json();

    // Filter out forks, sort by (stars desc, recent push)
    const filtered = repos
      .filter(r => !r.fork)
      .sort((a,b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)))
      .slice(0, 12);

    grid.innerHTML = "";
    if(filtered.length === 0){
      status.textContent = "No public repositories found.";
      return;
    }
    status.textContent = `Showing top ${filtered.length} repositories (stars + recent activity).`;

    for(const r of filtered){
      const col = el("div","col-md-6 col-lg-4");
      const card = el("div","card glass h-100");
      const body = el("div","card-body");
      const top = el("div","d-flex justify-content-between align-items-start gap-2");
      const title = el("div","", `<h5 class="card-title mb-1"><a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a></h5>
        <div class="small-muted">${r.language ? r.language : "—"} • Updated ${formatDate(r.pushed_at)}</div>`);
      const meta = el("div","text-end small-muted", `★ ${r.stargazers_count}<br/>⑂ ${r.forks_count}`);
      top.appendChild(title); top.appendChild(meta);

      const desc = el("p","card-text mt-3 mb-3 small-muted", (r.description ? r.description : "No description provided."));
      const chips = el("div","d-flex flex-wrap gap-2");
      if(r.topics && r.topics.length){
        for(const t of r.topics.slice(0,5)){
          chips.appendChild(el("span","badge soft", t));
        }
      }

      const footer = el("div","d-flex gap-2 mt-3");
      footer.appendChild(el("a","btn btn-sm btn-primary", "View Repo"));
      footer.lastChild.href = r.html_url;
      footer.lastChild.target = "_blank";
      footer.lastChild.rel = "noopener";

      if(r.homepage){
        footer.appendChild(el("a","btn btn-sm btn-outline-light", "Live Demo"));
        footer.lastChild.href = r.homepage;
        footer.lastChild.target = "_blank";
        footer.lastChild.rel = "noopener";
      }

      body.appendChild(top);
      body.appendChild(desc);
      if(chips.childElementCount) body.appendChild(chips);
      body.appendChild(footer);

      card.appendChild(body);
      col.appendChild(card);
      grid.appendChild(col);
    }
  }catch(err){
    status.textContent = "Couldn't load repos from GitHub right now (rate limit or network). You can still open the GitHub profile link below.";
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", loadRepos);
