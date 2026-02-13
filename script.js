/* ===========================
   TYME BOXED — Main JavaScript
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== Navbar scroll effect =====
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ===== Mobile menu toggle =====
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }


  // ===== Scroll Reveal — Mave-style (subtle, slow) =====
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }


  // ===== FAQ Accordion =====
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const inner = item.querySelector('.faq-answer-inner');

    if (question && answer && inner) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all
        faqItems.forEach(i => {
          i.classList.remove('open');
          const a = i.querySelector('.faq-answer');
          if (a) a.style.maxHeight = '0';
          const q = i.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });

        // Open clicked if it was closed
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = inner.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });


  // ===== Smooth scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ===== Science Page — Sticky Sidebar Scroll Tracking =====
  const scienceSidebar = document.getElementById('scienceSidebar');
  if (scienceSidebar) {
    const sidebarLinks = scienceSidebar.querySelectorAll('a[data-target]');
    const scienceSections = [];

    sidebarLinks.forEach(link => {
      const section = document.getElementById(link.dataset.target);
      if (section) scienceSections.push({ link, section });
    });

    const updateActiveSection = () => {
      const scrollY = window.scrollY + 200;

      let activeSection = scienceSections[0];
      scienceSections.forEach(item => {
        if (scrollY >= item.section.offsetTop) {
          activeSection = item;
        }
      });

      sidebarLinks.forEach(l => l.classList.remove('active'));
      if (activeSection) activeSection.link.classList.add('active');
    };

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();

    // Smooth scroll for sidebar links
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(link.dataset.target);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }


  // ===== Quiz Page — Step Management =====
  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizResult = document.getElementById('quizResult');
  const progressFill = document.getElementById('quizProgressFill');
  const progressText = document.getElementById('quizProgressText');
  const totalSteps = 4;

  if (quizSteps.length > 0) {
    let currentStep = 1;
    let answeredSteps = new Set();

    // Option selection
    document.querySelectorAll('.quiz-options').forEach(optionsGroup => {
      const options = optionsGroup.querySelectorAll('.quiz-option');
      const isMulti = optionsGroup.dataset.multi === 'true';

      options.forEach(option => {
        option.addEventListener('click', () => {
          if (isMulti) {
            option.classList.toggle('selected');
          } else {
            options.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
          }

          // Enable/disable next button
          const step = option.closest('.quiz-step');
          const stepNum = parseInt(step.dataset.step);
          const nextBtn = document.getElementById(`quizNext${stepNum}`);
          const hasSelection = step.querySelectorAll('.quiz-option.selected').length > 0;

          if (nextBtn) {
            nextBtn.classList.toggle('enabled', hasSelection);
          }
        });
      });
    });

    // Next button handlers
    for (let i = 1; i <= totalSteps; i++) {
      const btn = document.getElementById(`quizNext${i}`);
      if (btn) {
        btn.addEventListener('click', () => {
          if (!btn.classList.contains('enabled')) return;

          answeredSteps.add(i);

          if (i < totalSteps) {
            // Go to next step
            goToStep(i + 1);
          } else {
            // Show result
            showResult();
          }
        });
      }
    }

    function goToStep(stepNum) {
      currentStep = stepNum;

      // Hide all steps
      quizSteps.forEach(s => s.classList.remove('active'));

      // Show target step
      const targetStep = document.getElementById(`quizStep${stepNum}`);
      if (targetStep) {
        targetStep.classList.add('active');
      }

      // Update progress
      updateProgress();

      // Scroll to top of quiz
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }

    function showResult() {
      // Hide all steps and progress
      quizSteps.forEach(s => s.classList.remove('active'));
      const progress = document.getElementById('quizProgress');
      if (progress) progress.style.display = 'none';

      // Show result
      if (quizResult) {
        quizResult.classList.add('active');
      }

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateProgress() {
      const answered = answeredSteps.size;
      const pct = (answered / totalSteps) * 100;

      if (progressFill) progressFill.style.width = pct + '%';
      if (progressText) progressText.textContent = `${answered}/${totalSteps} questions answered`;
    }

    // Email submit handler
    const emailSubmit = document.getElementById('quizEmailSubmit');
    const emailInput = document.getElementById('quizEmail');
    if (emailSubmit && emailInput) {
      emailSubmit.addEventListener('click', () => {
        const email = emailInput.value.trim();
        if (email && email.includes('@')) {
          emailSubmit.textContent = '✓ You\'re on the list!';
          emailSubmit.style.background = '#4A9E6E';
          emailSubmit.style.color = '#fff';
          emailSubmit.disabled = true;
          emailInput.disabled = true;
        } else {
          emailInput.style.borderColor = '#C45C5C';
          emailInput.placeholder = 'Please enter a valid email';
        }
      });
    }
  }

});
