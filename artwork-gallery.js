(() => {
  const gallery = document.querySelector('#artwork .artwork-gallery');
  const viewer = document.getElementById('artwork-viewer');
  if (!gallery || !viewer || typeof viewer.showModal !== 'function') return;

  const links = Array.from(gallery.querySelectorAll('.artwork-card .artwork-image-link'));
  const artwork = links.map(link => {
    const card = link.closest('.artwork-card');
    const image = link.querySelector('img');
    const description = card.querySelector('.artwork-type')?.textContent.trim();
    return {
      src: link.href,
      alt: image.alt,
      title: card.querySelector('.artwork-card-title').textContent.trim(),
      description: description || image.alt,
      credit: card.querySelector('.artwork-credit')?.textContent.trim() || ''
    };
  });
  if (!artwork.length) return;

  const title = viewer.querySelector('.artwork-viewer-title');
  const image = viewer.querySelector('.artwork-viewer-image');
  const count = viewer.querySelector('.artwork-viewer-count');
  const description = viewer.querySelector('.artwork-viewer-description');
  const credit = viewer.querySelector('.artwork-viewer-credit');
  const number = new Intl.NumberFormat(document.documentElement.lang);
  const previousKey = document.documentElement.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  const nextKey = previousKey === 'ArrowRight' ? 'ArrowLeft' : 'ArrowRight';
  let current = 0;
  let opener;

  function showArtwork(index) {
    current = (index + artwork.length) % artwork.length;
    const item = artwork[current];
    title.textContent = item.title;
    image.alt = item.alt === item.description ? '' : item.alt;
    image.src = item.src;
    count.textContent = number.format(current + 1) + ' / ' + number.format(artwork.length);
    description.textContent = item.description;
    credit.textContent = item.credit;
  }

  links.forEach((link, index) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', viewer.id);
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      showArtwork(index);
      viewer.showModal();
      document.documentElement.classList.add('artwork-viewer-open');
      viewer.scrollTop = 0;
    });
  });

  viewer.querySelector('.artwork-viewer-previous').addEventListener('click', () => showArtwork(current - 1));
  viewer.querySelector('.artwork-viewer-next').addEventListener('click', () => showArtwork(current + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key !== previousKey && event.key !== nextKey) return;
    event.preventDefault();
    showArtwork(current + (event.key === previousKey ? -1 : 1));
  });
  viewer.addEventListener('close', () => {
    document.documentElement.classList.remove('artwork-viewer-open');
    opener?.focus();
  });
  gallery.setAttribute('data-viewer-ready', '');
})();
