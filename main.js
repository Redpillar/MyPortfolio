document.addEventListener('DOMContentLoaded', () => {
  initSkillBarAnimation();
});

function initSkillBarAnimation() {
  const chartBox = document.querySelector('.skill-chart-box');
  if (!chartBox) return;

  const rows = chartBox.querySelectorAll('.skill-row');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const runAnimation = () => {
    if (chartBox.classList.contains('is-animated')) return;
    chartBox.classList.add('is-animated');

    rows.forEach((row, index) => {
      const fill = row.querySelector('.progress-fill');
      const valueEl = row.querySelector('.skill-value');
      const target = Number(fill.dataset.value);
      const delay = index * 120;

      setTimeout(() => {
        fill.style.width = `${target}%`;
        animateCount(valueEl, target, prefersReducedMotion ? 0 : 1200);
      }, prefersReducedMotion ? 0 : delay);
    });
  };

  if (prefersReducedMotion) {
    runAnimation();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        runAnimation();
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(chartBox);
}

function animateCount(el, target, duration) {
  if (duration === 0) {
    el.textContent = `${target}%`;
    return;
  }

  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${Math.round(eased * target)}%`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = `${target}%`;
    }
  }

  requestAnimationFrame(update);
}