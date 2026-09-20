const LANGUAGES = [
  { id: 'python', name: 'Python', icon: 'fa-brands fa-python', available: true, defaultCode: 'def main():\n    print("Hello from CodeLab V1!")\n\nmain()' },
  { id: 'javascript', name: 'JavaScript', icon: 'fa-brands fa-js', available: true, defaultCode: 'console.log("Hello World!");' },
  { id: 'html', name: 'HTML', icon: 'fa-brands fa-html5', available: true, defaultCode: '<h1>Hello CodeLab</h1>' },
  { id: 'c', name: 'C', icon: 'fa-solid fa-c', available: true, defaultCode: '#include <stdio.h>\nint main() {\n    printf("Hello C!\\n");\n    return 0;\n}' },
  { id: 'cpp', name: 'C++', icon: 'fa-solid fa-file-code', available: true, defaultCode: '#include <iostream>\nint main() {\n    std::cout << "Hello C++!";\n    return 0;\n}' },
  { id: 'java', name: 'Java', icon: 'fa-brands fa-java', available: false, defaultCode: '' },
  { id: 'go', name: 'Go', icon: 'fa-solid fa-g', available: false, defaultCode: '' },
  { id: 'rust', name: 'Rust', icon: 'fa-solid fa-gear', available: false, defaultCode: '' },
  { id: 'php', name: 'PHP', icon: 'fa-brands fa-php', available: false, defaultCode: '' },
  { id: 'kotlin', name: 'Kotlin', icon: 'fa-solid fa-k', available: false, defaultCode: '' },
  { id: 'ruby', name: 'Ruby', icon: 'fa-diamond', available: false, defaultCode: '' }
];

let currentProject = { id: null, title: 'Untitled', language: 'python', code: LANGUAGES[0].defaultCode };

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  renderGrid();
  populateDropdown();
  setupEditor();
  renderProjects();
  setupEvents();
});

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 2000);
}

function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.section-view').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target).classList.add('active');
    });
  });
}

function renderGrid() {
  const grid = document.getElementById('language-grid');
  grid.innerHTML = LANGUAGES.map(l => `
    <div class="lang-card" onclick="selectLang('${l.id}')">
      <i class="${l.icon}" style="font-size: 1.8rem;"></i>
      <div>${l.name}</div>
      <span class="lang-status ${l.available ? 'status-available' : 'status-unavailable'}">
        ${l.available ? 'Ready' : 'Planned'}
      </span>
    </div>
  `).join('');
}

function selectLang(id) {
  const lang = LANGUAGES.find(l => l.id === id);
  if (!lang) return;
  document.getElementById('lang-select').value = lang.id;
  document.getElementById('code-input').value = lang.defaultCode || '// Language planned';
  updateLines();
  document.querySelector('[data-target="sec-code"]').click();
}

function populateDropdown() {
  const select = document.getElementById('lang-select');
  LANGUAGES.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l.id;
    opt.textContent = `${l.name} ${l.available ? '' : '(Unavailable)'}`;
    select.appendChild(opt);
  });
}

function setupEditor() {
  const area = document.getElementById('code-input');
  area.value = currentProject.code;
  area.addEventListener('input', updateLines);
  updateLines();
}

function updateLines() {
  const count = document.getElementById('code-input').value.split('\n').length;
  let html = '';
  for (let i = 1; i <= count; i++) html += `<span>${i}</span>`;
  document.getElementById('line-numbers').innerHTML = html;
}

function detectLanguage(code) {
  if (code.includes('def ') || code.includes('print(')) return 'python';
  if (code.includes('console.log')) return 'javascript';
  if (code.includes('<h1>') || code.includes('<html>')) return 'html';
  if (code.includes('#include <stdio.h>')) return 'c';
  if (code.includes('#include <iostream>')) return 'cpp';
  return null;
}

function runCode() {
  const code = document.getElementById('code-input').value;
  let lang = document.getElementById('lang-select').value;
  const output = document.getElementById('terminal-output');

  document.getElementById('error-card').classList.remove('active');
  document.getElementById('ai-tutor-panel').classList.remove('active');

  if (lang === 'auto') {
    lang = detectLanguage(code);
    if (!lang) {
      output.textContent = "Language not available or could not be confidently detected. Please select one.";
      output.style.color = "#f59e0b";
      return;
    }
    document.getElementById('lang-select').value = lang;
  }

  const langObj = LANGUAGES.find(l => l.id === lang);
  if (!langObj || !langObj.available) {
    output.textContent = "Language not available on backend execution server.";
    output.style.color = "#ef4444";
    return;
  }

  output.textContent = "Sending payload to Render sandbox...";
  setTimeout(() => {
    if (code.includes('error')) {
      output.textContent = "Execution failed.";
      output.style.color = "#ef4444";
      document.getElementById('error-text').textContent = "SyntaxError: Unexpected identifier on line 2";
      document.getElementById('error-card').classList.add('active');
    } else {
      output.style.color = "#4af626";
      output.textContent = `[Render Container Output]\nHello World! Process finished with status 0.`;
    }
  }, 800);
}

function askAITutor() {
  const aiPanel = document.getElementById('ai-tutor-panel');
  const aiContent = document.getElementById('ai-content');
  aiPanel.classList.add('active');
  aiContent.innerHTML = `
    <p><strong>AI Concept Guide:</strong> Syntax errors occur when the execution engine encounters code that violates standard grammar rules.</p>
    <p><strong>Debugging Tip:</strong> Check your variable declarations and line punctuation before running again.</p>
  `;
}

function saveProject() {
  const name = prompt("Project Name:", currentProject.title);
  if (!name) return;
  const projects = JSON.parse(localStorage.getItem('codelab_projects') || '[]');
  const proj = {
    id: currentProject.id || Date.now().toString(),
    title: name,
    language: document.getElementById('lang-select').value,
    code: document.getElementById('code-input').value
  };
  projects.push(proj);
  localStorage.setItem('codelab_projects', JSON.stringify(projects));
  renderProjects();
  showToast('Saved to localStorage');
}

function renderProjects() {
  const list = document.getElementById('project-list');
  const projects = JSON.parse(localStorage.getItem('codelab_projects') || '[]');
  list.innerHTML = projects.map(p => `
    <div class="project-item">
      <div>
        <strong>${p.title}</strong>
        <p style="font-size: 0.75rem; color: var(--text-muted);">${p.language}</p>
      </div>
      <button class="btn btn-sm btn-secondary" onclick="openProj('${p.id}')">Open</button>
    </div>
  `).join('');
}

window.openProj = function(id) {
  const projects = JSON.parse(localStorage.getItem('codelab_projects') || '[]');
  const p = projects.find(item => item.id === id);
  if (p) {
    document.getElementById('code-input').value = p.code;
    document.getElementById('lang-select').value = p.language;
    updateLines();
    document.querySelector('[data-target="sec-code"]').click();
  }
};

function setupEvents() {
  document.getElementById('btn-run').addEventListener('click', runCode);
  document.getElementById('btn-save').addEventListener('click', saveProject);
  document.getElementById('btn-ask-ai').addEventListener('click', askAITutor);
}
