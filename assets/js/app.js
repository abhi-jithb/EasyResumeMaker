// ===== THEME TOGGLE LOGIC =====
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const sunSvg = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
    const moonSvg = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';

    // Initialize Theme
    if (localStorage.getItem('theme') === 'light') {
      document.body.classList.add('light-mode');
      themeIcon.innerHTML = moonSvg;
      themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }

    // Toggle Theme
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      
      if (document.body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        themeIcon.innerHTML = moonSvg;
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
      } else {
        localStorage.setItem('theme', 'dark');
        themeIcon.innerHTML = sunSvg;
        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
      }
    });

    // ===== STATE =====
    let resumeData = null;
    let selectedTemplate = 'minimal';

    // ===== TEMPLATE SELECTION =====
    function selectTemplate(el) {
      document.querySelectorAll('.tpl').forEach(t => {
        t.classList.remove('selected');
        t.setAttribute('aria-checked', 'false');
      });
      el.classList.add('selected');
      el.setAttribute('aria-checked', 'true');
      selectedTemplate = el.dataset.tpl;
    }

    // ===== HINTS =====
    function fillHint(val) {
      document.getElementById('url-input').value = val;
      document.getElementById('url-input').focus();
    }

    // ===== TABS =====
    function switchTab(tab) {
      document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.preview-pane').forEach(p => p.classList.remove('active'));
      const tabEl = tab === 'formatted'
        ? document.querySelector('.ptab:first-child')
        : document.querySelector('.ptab:last-child');
      tabEl.classList.add('active');
      document.getElementById('pane-' + tab).classList.add('active');
    }

    // ===== STAGE HELPERS =====
    function setStage(id, state, statusText) {
      const s = document.getElementById(id);
      s.className = 'stage ' + state;
      s.querySelector('.stage-status').textContent = statusText;
    }

    function setGenerateButtonState(state) {
      const btn = document.getElementById('go-btn');
      btn.disabled = state !== 'idle';
      btn.textContent = window.EasyResumeLoading.getGenerateButtonLabel(state);
    }

    function showError(msg) {
      const el = document.getElementById('error-box');
      el.textContent = '⚠  ' + msg;
      el.style.display = 'block';
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideError() {
      document.getElementById('error-box').style.display = 'none';
    }

    function getFriendlyApiError(error) {
      return window.EasyResumeErrors.apiErrorMessage(error);
    }

    // ===== MAIN GENERATOR =====
    async function generateResume() {
      const url = document.getElementById('url-input').value.trim();

      const normalizedUrl = window.EasyResumeUrl.normalizePublicUrl(url);
      if (!normalizedUrl.ok) { showError(normalizedUrl.message); return; }
      hideError();

      const fullUrl = normalizedUrl.url;

      setGenerateButtonState('fetch');
      document.getElementById('stages').style.display = 'block';
      document.getElementById('result-section').style.display = 'none';
      ['stage-fetch', 'stage-parse', 'stage-build', 'stage-pdf'].forEach(id => setStage(id, 'waiting', 'waiting'));

      // ── STAGE 1: FETCH ──
      setStage('stage-fetch', 'active', 'reading...');
      let rawText = '';
      try {
        const jinaUrl = 'https://r.jina.ai/' + fullUrl;
        const res = await fetch(jinaUrl, {
          headers: { 'Accept': 'text/plain', 'X-Return-Format': 'text', 'X-Timeout': '20' }
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        rawText = await res.text();
        rawText = rawText.slice(0, 30000); // Increased limit for better details
      } catch (e) {
        setStage('stage-fetch', 'waiting', 'failed ✗');
        showError(window.EasyResumeErrors.fetchErrorMessage(e));
        setGenerateButtonState('idle');
        return;
      }
      if (rawText.length < 300) {
        setStage('stage-fetch', 'waiting', 'failed ✗');
        showError(window.EasyResumeErrors.lowContentMessage(rawText.length));
        setGenerateButtonState('idle');
        return;
      }
      setStage('stage-fetch', 'done', 'done ✓');

      // ── STAGE 2: AI PARSE ──
      setStage('stage-parse', 'active', 'extracting...');
      setGenerateButtonState('parse');
      let parsed = null;

      try {
        parsed = await window.EasyResumeAI.generateResume(rawText);
        resumeData = parsed;
        setStage('stage-parse', 'done', 'done ✓');

      } catch (e) {
        setStage('stage-parse', 'waiting', 'failed ✗');
        showError('AI parsing failed. ' + getFriendlyApiError(e));
        setGenerateButtonState('idle');
        return;
      }

      // ── STAGE 3: BUILD COPY ──
      setStage('stage-build', 'active', 'writing...');
      setGenerateButtonState('build');
      await delay(900);
      setStage('stage-build', 'done', 'done ✓');

      // ── STAGE 4: TYPESET ──
      setStage('stage-pdf', 'active', 'typesetting...');
      setGenerateButtonState('pdf');
      await delay(600);
      renderPreview(parsed);
      setStage('stage-pdf', 'done', 'done ✓');

      await delay(300);
      document.getElementById('result-section').style.display = 'block';
      document.getElementById('result-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
      setGenerateButtonState('idle');
    }

    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    // ===== RENDER PREVIEW =====
    function renderPreview(d) {
      // Experience markup
      const exp = (d.experience || []).filter(e => e.role || e.organization).map(e => `
        <div class="rf-item-title">${esc(e.role)}${e.organization ? ' · ' + esc(e.organization) : ''}</div>
        ${e.duration || e.location ? `<div class="rf-item-sub">${esc(e.duration)}${e.duration && e.location ? ' — ' : ''}${esc(e.location)}</div>` : ''}
        <ul class="rf-item-desc" style="padding-left: 1.2rem; margin-top: 4px;">
          ${(e.points || []).map(p => `<li>${esc(p)}</li>`).join('')}
        </ul>
      `).join('');

      // Skills markup
      const sk = d.skills || {};
      const skillsMarkup = `
        ${sk.languages?.length ? `<div style="margin-bottom:8px"><strong>Languages:</strong> ${sk.languages.map(esc).join(', ')}</div>` : ''}
        ${sk.tools?.length ? `<div style="margin-bottom:8px"><strong>Tools:</strong> ${sk.tools.map(esc).join(', ')}</div>` : ''}
        ${sk.soft_skills?.length ? `<div><strong>Soft Skills:</strong> ${sk.soft_skills.map(esc).join(', ')}</div>` : ''}
      `;

      // Contact markup
      const c = d.contact || {};
      const contactParts = [c.phone, c.email, c.location, ...(c.links || [])].filter(Boolean);
      const contactMarkup = contactParts.map(cp => `<span>${esc(cp)}</span>`).join(' &nbsp;·&nbsp; ');

      document.getElementById('resume-formatted-view').innerHTML = `
        <div class="resume-formatted">
          <div class="rf-name">${esc(d.name || 'Your Name')}</div>
          <div class="rf-contact">${contactMarkup}</div>
          ${d.about ? `<div class="rf-section">About Me</div><div class="rf-item-desc">${esc(d.about)}</div>` : ''}
          ${exp ? `<div class="rf-section">Experience</div>${exp}` : ''}
          ${d.achievements?.length ? `
            <div class="rf-section">Achievements</div>
            <ul class="rf-item-desc" style="padding-left: 1.2rem;">
              ${d.achievements.map(a => `<li>${esc(a)}</li>`).join('')}
            </ul>
          ` : ''}
          ${(sk.languages?.length || sk.tools?.length || sk.soft_skills?.length) ? `<div class="rf-section">Technical Skills</div><div class="rf-item-desc">${skillsMarkup}</div>` : ''}
          ${d.languages_spoken?.length ? `
            <div class="rf-section">Languages</div>
            <div class="rf-item-desc">${d.languages_spoken.map(esc).join('  —  ')}</div>
          ` : ''}
          ${(d.education || []).length ? `
            <div class="rf-section">Education</div>
            ${d.education.map(ed => `
              <div class="rf-item-title">${esc(ed.degree)}</div>
              <div class="rf-item-sub">${esc(ed.institution)} ${ed.duration ? ' — ' + esc(ed.duration) : ''}</div>
            `).join('')}
          ` : ''}
        </div>`;

      // JSON preview
      document.getElementById('resume-json-view').textContent = JSON.stringify(d, null, 2);
    }

    // ===== COPY RESUME =====
    function buildResumePlainText(d) {
      const lines = [];
      const add = value => {
        if (value) lines.push(String(value).trim());
      };
      const addBlank = () => {
        if (lines.length && lines[lines.length - 1] !== '') lines.push('');
      };
      const addSection = (title, writer) => {
        const start = lines.length;
        addBlank();
        lines.push(title.toUpperCase());
        writer();
        if (lines.length === start + 1) lines.splice(start, 1);
      };

      const c = d.contact || {};
      const contact = [c.phone || d.phone, c.email || d.email, c.location || d.location, ...(c.links || [])].filter(Boolean);
      const links = d.links && !Array.isArray(d.links)
        ? Object.entries(d.links).filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`)
        : [];

      add(d.name || 'Your Name');
      add(d.title);
      if (contact.length) add(contact.join(' | '));
      if (links.length) add(links.join(' | '));

      if (d.about || d.summary) {
        addSection('Profile', () => add(d.about || d.summary));
      }

      const experience = (d.experience || []).filter(e => e.role || e.organization || e.company || e.description || e.points?.length);
      if (experience.length) {
        addSection('Experience', () => {
          experience.forEach(e => {
            addBlank();
            add([e.role, e.organization || e.company].filter(Boolean).join(' - '));
            add([e.duration, e.location].filter(Boolean).join(' | '));
            (e.points || []).forEach(point => add(`- ${point}`));
            if (e.description) add(`- ${e.description}`);
          });
        });
      }

      const projects = (d.projects || []).filter(p => p.name || p.description);
      if (projects.length) {
        addSection('Projects', () => {
          projects.forEach(p => {
            addBlank();
            add(p.name);
            add(p.tech);
            if (p.description) add(`- ${p.description}`);
          });
        });
      }

      if (d.achievements?.length) {
        addSection('Achievements', () => d.achievements.forEach(item => add(`- ${item}`)));
      }

      const sk = d.skills || {};
      const skillLines = Array.isArray(sk)
        ? sk
        : [
          sk.languages?.length ? `Languages: ${sk.languages.join(', ')}` : '',
          sk.tools?.length ? `Tools: ${sk.tools.join(', ')}` : '',
          sk.soft_skills?.length ? `Soft Skills: ${sk.soft_skills.join(', ')}` : ''
        ].filter(Boolean);
      if (skillLines.length) {
        addSection('Skills', () => skillLines.forEach(add));
      }

      if (d.languages_spoken?.length) {
        addSection('Languages', () => add(d.languages_spoken.join(', ')));
      }

      const education = (d.education || []).filter(ed => ed.degree || ed.institution);
      if (education.length) {
        addSection('Education', () => {
          education.forEach(ed => {
            addBlank();
            add([ed.degree, ed.institution].filter(Boolean).join(' - '));
            add(ed.duration || ed.year);
          });
        });
      }

      return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    }

    async function copyTextToClipboard(text) {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }

      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '-999px';
      textarea.style.left = '-999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const copied = document.execCommand('copy');
      textarea.remove();
      if (!copied) throw new Error('Clipboard fallback failed');
    }

    function showToast(message, type = 'success') {
      const region = document.getElementById('toast-region');
      if (!region) return;

      const toast = document.createElement('div');
      toast.className = `toast ${type === 'error' ? 'error' : ''}`;
      toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
      toast.textContent = message;
      region.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('leaving');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
      }, 2600);
    }

    function setCopyButtonState(state) {
      const btn = document.getElementById('copy-resume-btn');
      if (!btn) return;

      btn.classList.toggle('is-copying', state === 'copying');
      btn.classList.toggle('is-copied', state === 'copied');
      btn.disabled = state === 'copying';
      btn.textContent = state === 'copying' ? 'Copying...' : state === 'copied' ? 'Copied' : 'Copy Resume';
    }

    async function copyResume() {
      if (!resumeData) {
        showToast('Generate a resume before copying.', 'error');
        return;
      }

      const resumeText = buildResumePlainText(resumeData);
      if (!resumeText) {
        showToast('No resume content found to copy.', 'error');
        return;
      }

      setCopyButtonState('copying');
      try {
        await copyTextToClipboard(resumeText);
        setCopyButtonState('copied');
        showToast('Resume copied successfully!');
      } catch (error) {
        setCopyButtonState('idle');
        showToast('Failed to copy resume. Please try again.', 'error');
      } finally {
        setTimeout(() => setCopyButtonState('idle'), 2200);
      }
    }

    // ===== PDF DOWNLOAD =====
    function downloadPDF() {
      if (!resumeData) return;
      const d = resumeData;
      const tpl = selectedTemplate;
      const { jsPDF } = window.jspdf;

      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const lm = 20, rm = 190, pw = rm - lm;
      let y = 20;

      // ── Template: MINIMAL (Matches Reference Image) ──
      if (tpl === 'minimal') {
        // Header
        doc.setFont('times', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(20, 20, 20);
        const nameLines = doc.splitTextToSize(d.name || 'Your Name', pw);
        doc.text(nameLines, lm + (pw / 2), y, { align: 'center' });
        y += 8;

        const c = d.contact || {};
        const contact = [c.phone, c.email, c.location, ...(c.links || [])].filter(Boolean).join(' — ');
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        const cLines = doc.splitTextToSize(contact, pw);
        doc.text(cLines, lm + (pw / 2), y, { align: 'center' });
        y += 12;

        const sections = [
          { id: 'about', title: 'About Me', content: d.about ? [{ type: 'text', val: d.about }] : [] },
          { id: 'exp', title: 'Experience', content: (d.experience || []).map(e => ({ type: 'entry', val: e })) },
          { id: 'ach', title: 'Achievements', content: d.achievements?.length ? [{ type: 'list', val: d.achievements }] : [] },
          { id: 'skills', title: 'Technical Skills', content: (d.skills && (d.skills.languages?.length || d.skills.tools?.length || d.skills.soft_skills?.length)) ? [{ type: 'skills', val: d.skills }] : [] },
          { id: 'langs', title: 'Languages', content: d.languages_spoken?.length ? [{ type: 'spoken', val: d.languages_spoken }] : [] },
          { id: 'edu', title: 'Education', content: (d.education || []).map(e => ({ type: 'edu', val: e })) }
        ];

        sections.forEach(sec => {
          if (!sec.content.length) return;
          if (y > 265) { doc.addPage(); y = 20; }

          // Section Title
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(30, 30, 30);
          doc.text(sec.title.toUpperCase(), lm, y);
          y += 2;
          doc.setDrawColor(30,30,30); doc.setLineWidth(0.4); doc.line(lm, y, rm, y); 
          y += 6;

          sec.content.forEach(item => {
            if (y > 270) { doc.addPage(); y = 20; }

            if (item.type === 'text') {
              doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(50, 50, 50);
              const lines = doc.splitTextToSize(item.val, pw);
              doc.text(lines, lm, y); y += lines.length * 4.8 + 4;
            } else if (item.type === 'entry') {
              const e = item.val;
              doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(20, 20, 20);
              doc.text(e.role || '', lm, y);
              if (e.duration) { doc.setFont('times', 'italic'); doc.setFontSize(9); doc.text(e.duration, rm, y, { align: 'right' }); }
              y += 5;
              doc.setFont('times', 'italic'); doc.setFontSize(10); doc.setTextColor(80, 80, 80);
              doc.text(e.organization || '', lm, y);
              if (e.location) { doc.text(e.location, rm, y, { align: 'right' }); }
              y += 5;
              doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(50, 50, 50);
              (e.points || []).forEach(p => {
                const pLines = doc.splitTextToSize('• ' + p, pw - 5);
                doc.text(pLines, lm, y); y += pLines.length * 4.5 + 1;
              });
              y += 3;
            } else if (item.type === 'list') {
              doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(50, 50, 50);
              item.val.forEach(a => {
                const aLines = doc.splitTextToSize('• ' + a, pw - 5);
                doc.text(aLines, lm, y); y += aLines.length * 4.5 + 1;
              });
              y += 3;
            } else if (item.type === 'skills') {
              const s = item.val;
              const drawSkill = (label, values) => {
                if (!values?.length) return;
                doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.text(label + ':', lm, y);
                doc.setFont('helvetica', 'normal'); const valStr = values.join(', '); const vLines = doc.splitTextToSize(valStr, pw - 30);
                doc.text(vLines, lm + 25, y); y += vLines.length * 4.5 + 1;
              };
              drawSkill('Languages', s.languages);
              drawSkill('Tools', s.tools);
              drawSkill('Soft Skills', s.soft_skills);
              y += 2;
            } else if (item.type === 'spoken') {
              doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.text(item.val.join('  —  '), lm, y); y += 6;
            } else if (item.type === 'edu') {
              const e = item.val;
              doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.text(e.degree || '', lm, y);
              if (e.duration) { doc.setFont('times', 'italic'); doc.setFontSize(9); doc.text(e.duration, rm, y, { align: 'right' }); }
              y += 5;
              doc.setFont('times', 'italic'); doc.setFontSize(10); doc.text(e.institution || '', lm, y); y += 6;
            }
          });
          y += 4;
        });

        // ── Template: MODERN ──
      } else if (tpl === 'modern') {
        const sbW = 65, mainX = lm + sbW + 8, mainW = rm - mainX;
        const pageH = 297;

        // Sidebar bg
        doc.setFillColor(17, 24, 39);
        doc.rect(0, 0, lm + sbW, pageH, 'F');

        // Name in sidebar
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(232, 255, 71);
        const nameLines = doc.splitTextToSize(d.name || 'Your Name', sbW - 4);
        doc.text(nameLines, lm, y); y += nameLines.length * 8 + 6;

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9.5);
        doc.setTextColor(180, 180, 180);
        const titleLines = doc.splitTextToSize(d.title || '', sbW - 4);
        doc.text(titleLines, lm, y); y += titleLines.length * 5 + 10;

        // Contact in sidebar
        const sbSection = (t) => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(232, 255, 71);
          doc.text(t.toUpperCase(), lm, y); y += 3;
          doc.setDrawColor(60, 60, 80);
          doc.setLineWidth(0.3);
          doc.line(lm, y, lm + sbW - 4, y); y += 5;
        };

        sbSection('Contact');
        const c = d.contact || {};
        [c.phone, c.email, c.location, ...(c.links || [])].filter(Boolean).forEach(cp => {
          doc.setFont('courier', 'normal'); doc.setFontSize(7.5); doc.setTextColor(160, 160, 180);
          const ls = doc.splitTextToSize(cp, sbW - 4);
          doc.text(ls, lm, y); y += ls.length * 4 + 2;
        });
        y += 6;

        const sk = d.skills || {};
        if (sk.languages?.length || sk.tools?.length || sk.soft_skills?.length) {
          sbSection('Skills');
          [...(sk.languages || []), ...(sk.tools || []), ...(sk.soft_skills || [])].slice(0, 20).forEach(s => {
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(200, 200, 210);
            doc.text('› ' + s, lm, y); y += 5;
          });
        }

        if (d.links) {
          const lks = Object.entries(d.links).filter(([, v]) => v);
          if (lks.length) {
            y += 4;
            sbSection('Links');
            lks.forEach(([k, v]) => {
              doc.setFont('courier', 'normal');
              doc.setFontSize(7.5);
              doc.setTextColor(160, 160, 180);
              doc.text(k + ': ' + v, lm, y, { maxWidth: sbW - 4 }); y += 5;
            });
          }
        }

        // Main content
        let my = 20;
        const mainSection = (t) => {
          if (my > 260) { doc.addPage(); my = 20; doc.setFillColor(17, 24, 39); doc.rect(0, 0, lm + sbW, pageH, 'F'); }
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(50, 80, 120);
          doc.text(t.toUpperCase(), mainX, my); my += 3;
          doc.setDrawColor(50, 80, 120);
          doc.setLineWidth(0.5);
          doc.line(mainX, my, rm, my); my += 8;
        };

        if (d.about) {
          mainSection('About');
          doc.setFont('times', 'italic'); doc.setFontSize(10.5); doc.setTextColor(50, 50, 50);
          const ls = doc.splitTextToSize(d.about, mainW);
          doc.text(ls, mainX, my); my += ls.length * 5 + 6;
        }

        const mainEntry = (items, type) => {
          items.forEach(item => {
            if (my > 260) { doc.addPage(); my = 20; doc.setFillColor(17, 24, 39); doc.rect(0, 0, lm + sbW, pageH, 'F'); }
            if (type === 'exp') {
              doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(20, 20, 20);
              const header = (item.role || '') + (item.organization ? ' · ' + item.organization : '');
              const hLines = doc.splitTextToSize(header, mainW);
              doc.text(hLines, mainX, my); my += hLines.length * 5.5 + 1;
              if (item.duration) { doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(100, 100, 100); doc.text(item.duration, mainX, my); my += 5; }
              doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(60, 60, 60);
              (item.points || []).forEach(p => { const ls = doc.splitTextToSize('• ' + p, mainW); doc.text(ls, mainX, my); my += ls.length * 4.5 + 1; });
            } else if (type === 'edu') {
              doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(20, 20, 20);
              const header = (item.degree || '') + (item.institution ? ' · ' + item.institution : '');
              const hLines = doc.splitTextToSize(header, mainW);
              doc.text(hLines, mainX, my); my += hLines.length * 5.5 + 1;
              if (item.duration) { doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 100, 100); doc.text(item.duration, mainX, my); my += 5; }
            }
            my += 4;
          });
        };

        const expItems = (d.experience || []).filter(e => e.role || e.organization);
        if (expItems.length) { mainSection('Experience'); mainEntry(expItems, 'exp'); }
        if (d.achievements?.length) {
          mainSection('Achievements');
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(60, 60, 60);
          d.achievements.forEach(a => { const ls = doc.splitTextToSize('• ' + a, mainW); doc.text(ls, mainX, my); my += ls.length * 4.5 + 1; });
          my += 4;
        }
        const eduItems = (d.education || []).filter(e => e.degree);
        if (eduItems.length) { mainSection('Education'); mainEntry(eduItems, 'edu'); }

        // ── Template: CLASSIC ──
      } else {
        // Warm accent color: #c94a2e
        const A = [201, 74, 46];

        // Header with accent bar
        doc.setFillColor(...A);
        doc.rect(lm, y - 5, 3, 18, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(30, 20, 10);
        doc.text(d.name || 'Your Name', lm + 8, y + 2); y += 10;

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(11);
        doc.setTextColor(...A);
        doc.text(d.title || '', lm + 8, y); y += 7;

        const contact = [d.email, d.phone, d.location, d.website].filter(Boolean).join('  ·  ');
        doc.setFont('courier', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(120, 100, 80);
        doc.text(contact, lm + 8, y, { maxWidth: pw - 8 }); y += 10;

        doc.setDrawColor(...A);
        doc.setLineWidth(0.8);
        doc.line(lm, y, rm, y); y += 8;

        const clsSection = (t) => {
          if (y > 260) { doc.addPage(); y = 20; }
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(...A);
          doc.text(t.toUpperCase(), lm, y); y += 3;
          doc.setDrawColor(220, 200, 190);
          doc.setLineWidth(0.3);
          doc.line(lm, y, rm, y); y += 8;
        };

        const clsEntry = (items, type) => {
          items.forEach(item => {
            if (y > 260) { doc.addPage(); y = 20; }
            if (type === 'exp' || type === 'proj') {
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(11);
              doc.setTextColor(30, 20, 10);
              const h = type === 'exp' ? (item.role || '') + (item.company ? ' · ' + item.company : '') : item.name || '';
              const hLines = doc.splitTextToSize(h, pw - 10);
              doc.text(hLines, lm, y); y += hLines.length * 5.5 + 0.5;

              const sub = type === 'exp' ? item.duration : item.tech;
              if (sub) {
                doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(150, 120, 100);
                const sLines = doc.splitTextToSize(sub, pw - 10);
                doc.text(sLines, lm, y); y += sLines.length * 4.5 + 1;
              }
              const desc = item.description;
              if (desc) {
                doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(70, 55, 40);
                const ls = doc.splitTextToSize(desc, pw - 10);
                doc.text(ls, lm, y); y += ls.length * 4.8 + 5;
              }
            } else if (type === 'edu') {
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(11);
              doc.setTextColor(30, 20, 10);
              const header = (item.degree || '') + (item.institution ? ' · ' + item.institution : '');
              const hLines = doc.splitTextToSize(header, pw - 10);
              doc.text(hLines, lm, y); y += hLines.length * 5 + 0.5;
              if (item.year) {
                doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(150, 120, 100);
                doc.text(item.year, lm, y); y += 5;
              }
            }
          });
          y += 2;
        };

        if (d.summary) {
          clsSection('Profile');
          doc.setFont('times', 'italic');
          doc.setFontSize(10.5);
          doc.setTextColor(70, 55, 40);
          const ls = doc.splitTextToSize(d.summary, pw);
          doc.text(ls, lm, y); y += ls.length * 5 + 6;
        }

        const expItems = (d.experience || []).filter(e => e.role || e.company);
        if (expItems.length) { clsSection('Experience'); clsEntry(expItems, 'exp'); }
        const projItems = (d.projects || []).filter(p => p.name);
        if (projItems.length) { clsSection('Projects'); clsEntry(projItems, 'proj'); }
        const eduItems = (d.education || []).filter(e => e.degree);
        if (eduItems.length) { clsSection('Education'); clsEntry(eduItems, 'edu'); }
        if (d.skills?.length) {
          clsSection('Skills');
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(70, 55, 40);
          const ls = doc.splitTextToSize(d.skills.join('  ·  '), pw - 10);
          doc.text(ls, lm, y); y += ls.length * 5.5 + 6;
        }
        if (d.links && Object.values(d.links).some(Boolean)) {
          clsSection('Links');
          doc.setFont('courier', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(100, 80, 60);
          const linkStr = Object.entries(d.links).filter(([k, v]) => v).map(([k, v]) => `${k}: ${v}`).join('  ·  ');
          const ls = doc.splitTextToSize(linkStr, pw - 10);
          doc.text(ls, lm, y);
        }
      }

      const fname = (d.name || 'resume').toLowerCase().replace(/\s+/g, '-');
      doc.save(`${fname}-${tpl}-resume.pdf`);

      // Automatically show feedback modal after download
      setTimeout(() => {
        if (typeof toggleFeedback === 'function') toggleFeedback();
      }, 1500);
    }

    // ===== UTILS =====
    function esc(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function startOver() {
      document.getElementById('url-input').value = '';
      document.getElementById('result-section').style.display = 'none';
      document.getElementById('stages').style.display = 'none';
      hideError();
      setCopyButtonState('idle');
      resumeData = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function toggleFaq(el) {
      el.closest('.faq-item').classList.toggle('open');
    }

    // Keyboard support for hints and templates
    document.querySelectorAll('.hint').forEach(el => {
      el.addEventListener('keydown', e => { if (e.key === 'Enter') el.click(); });
    });
    document.querySelectorAll('.tpl').forEach(el => {
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') el.click(); });
    });

    document.getElementById('url-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') generateResume();
    });

    document.addEventListener('keydown', e => {
      const isCopyShortcut = (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c';
      if (!isCopyShortcut || !resumeData) return;
      e.preventDefault();
      copyResume();
    });

    async function improveResumeText() {
      const input = document.getElementById('improver-input');
      const output = document.getElementById('improver-output');
      const improveBtn = document.getElementById('improve-btn');
      const copyBtn = document.getElementById('copy-improved-btn');
      const text = input.value.trim();

      if (!text) {
        showToast('Add a resume sentence to improve.', 'error');
        input.focus();
        return;
      }

      improveBtn.disabled = true;
      improveBtn.textContent = 'Improving...';
      copyBtn.disabled = true;
      output.style.display = 'block';
      output.textContent = 'Improving your sentence...';

      try {
        const result = await window.EasyResumeAI.improveText(text);
        output.textContent = result.improvedText;
        output.dataset.improvedText = result.improvedText;
        copyBtn.disabled = false;
      } catch (error) {
        output.textContent = getFriendlyApiError(error);
        showToast('Could not improve that text. Please try again.', 'error');
      } finally {
        improveBtn.disabled = false;
        improveBtn.textContent = 'Improve';
      }
    }

    async function copyImprovedText() {
      const output = document.getElementById('improver-output');
      const text = output.dataset.improvedText || output.textContent.trim();
      if (!text) return;

      try {
        await copyTextToClipboard(text);
        showToast('Improved text copied!');
      } catch (error) {
        showToast('Failed to copy improved text.', 'error');
      }
    }

    function toggleFeedback() {
      const m = document.getElementById('feedback-modal');
      m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
    }
