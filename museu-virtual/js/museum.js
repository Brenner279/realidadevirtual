(() => {
  const scene = document.querySelector('#museum-scene');
  const museum = document.querySelector('#museum');
  const intro = document.querySelector('#intro');
  const titleNode = document.querySelector('#caption-title');
  const descriptionNode = document.querySelector('#caption-description');
  const hintNode = document.querySelector('#hud-hint');
  const caption = document.querySelector('#art-caption');
  const motionStatusNode = document.querySelector('#motion-status');

  const artworks = [
    { id: 1, title: 'Movimento das Cores', artist: 'Acervo demonstrativo', year: '2026', description: 'Uma composição abstrata sobre ritmo, cor e transformação. Este espaço receberá o vídeo animado da primeira obra.', wall: 'left', z: 3, color: '#b96b4d', accent: '#e9c17d' },
    { id: 2, title: 'Entre Formas e Luz', artist: 'Acervo demonstrativo', year: '2026', description: 'Formas geométricas e contrastes luminosos criam uma experiência visual em constante mudança.', wall: 'left', z: -1, color: '#416b78', accent: '#e0b66e' },
    { id: 3, title: 'Paisagem em Trânsito', artist: 'Acervo demonstrativo', year: '2026', description: 'Uma paisagem imaginária que convida a observar as relações entre natureza e movimento.', wall: 'left', z: -5, color: '#71805c', accent: '#d9c58e' },
    { id: 4, title: 'Memórias em Camadas', artist: 'Acervo demonstrativo', year: '2026', description: 'Texturas e camadas visuais representam lembranças, registros e diferentes perspectivas do tempo.', wall: 'right', z: 1, color: '#725c83', accent: '#e3b77e' },
    { id: 5, title: 'Horizonte Imaginado', artist: 'Acervo demonstrativo', year: '2026', description: 'Uma obra sobre possibilidades, futuro e imaginação, com espaço para animações e efeitos visuais.', wall: 'right', z: -4, color: '#9a704e', accent: '#d9d0a1' }
  ];

  function el(parent, tag, attrs) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value));
    parent.appendChild(node);
    return node;
  }

  function box(parent, position, width, height, depth, color) {
    return el(parent, 'a-box', { position, width, height, depth, color });
  }

  function animateTo(entity, name, property, to, duration = 550) {
    entity.setAttribute('animation__' + name, {
      property,
      to,
      dur: duration,
      easing: 'easeInOutSine'
    });
  }

  function build() {
    el(museum, 'a-plane', { rotation: '-90 0 0', position: '0 0 0', width: 16, height: 18, color: '#8e8980', material: 'roughness: .82' });
    el(museum, 'a-plane', { rotation: '90 0 0', position: '0 5.2 0', width: 16, height: 18, color: '#242833' });
    el(museum, 'a-plane', { position: '0 2.6 -9', width: 16, height: 5.2, color: '#ded9ce' });
    el(museum, 'a-plane', { position: '0 2.6 9', rotation: '0 180 0', width: 16, height: 5.2, color: '#d8d2c7' });
    el(museum, 'a-plane', { position: '-8 2.6 0', rotation: '0 90 0', width: 18, height: 5.2, color: '#d9d3c8' });
    el(museum, 'a-plane', { position: '8 2.6 0', rotation: '0 -90 0', width: 18, height: 5.2, color: '#d9d3c8' });

    box(museum, '0 .12 0', 15.8, .24, 17.8, '#3a3632');
    [-5, 0, 5].forEach((x) => {
      box(museum, x + ' 5.08 -1', .08, .04, 13, '#b99a61');
      el(museum, 'a-light', {
        type: 'spot',
        color: '#fff0d5',
        intensity: 1.0,
        angle: 42,
        penumbra: .55,
        position: x + ' 4.8 0',
        rotation: '-90 0 0',
        distance: 10
      });
    });

    box(museum, '0 1.8 8.88', 4.8, 2.7, .12, '#20232d');
    el(museum, 'a-text', { value: 'MUSEU VIRTUAL', align: 'center', color: '#e3c58e', width: 5, position: '0 2.25 8.7', rotation: '0 180 0' });
    el(museum, 'a-text', { value: 'ARTE • MOVIMENTO • EXPERIÊNCIA', align: 'center', color: '#d8d2c7', width: 4, position: '0 1.83 8.7', rotation: '0 180 0' });

    artworks.forEach(createArtwork);
  }

  function createArtwork(art) {
    const isLeft = art.wall === 'left';
    const group = el(museum, 'a-entity', {
      position: (isLeft ? '-7.91' : '7.91') + ' 2.75 ' + art.z,
      rotation: isLeft ? '0 90 0' : '0 -90 0'
    });

    // Halo discreto ao redor da moldura: sua intensidade aumenta quando a obra recebe foco.
    const halo = el(group, 'a-plane', {
      position: '0 0 .094',
      width: 2.72,
      height: 2.07,
      color: art.accent,
      material: 'shader: flat; transparent: true; opacity: .08; side: double'
    });

    box(group, '0 0 0', 2.55, 1.9, .18, '#30271d');
    const trim = box(group, '0 0 .105', 2.4, 1.75, .045, '#b38c51');
    trim.setAttribute('material', 'color: #b38c51; metalness: .25; roughness: .38; emissive: #5c3b12; emissiveIntensity: .10');
    box(group, '0 0 .14', 2.28, 1.63, .035, '#17191f');

    el(group, 'a-plane', { position: '0 0 .165', width: 2.18, height: 1.53, color: art.color, material: 'shader: flat' });
    el(group, 'a-ring', { position: '-.48 .12 .18', radiusInner: .28, radiusOuter: .48, color: art.accent, material: 'shader: flat' });
    el(group, 'a-circle', { position: '.42 -.2 .181', radius: .36, color: art.accent, material: 'shader: flat' });
    el(group, 'a-box', { position: '.25 .32 .18', width: .42, height: .42, depth: .025, color: '#eee0bd', rotation: '0 0 22' });

    const videoPlane = el(group, 'a-video', {
      src: '#video-' + art.id,
      position: '0 0 .23',
      width: 2.18,
      height: 1.53,
      material: 'shader: flat; transparent: true; opacity: 0'
    });

    const trigger = el(group, 'a-plane', {
      class: 'art-trigger',
      position: '0 0 .27',
      width: 2.18,
      height: 1.53,
      material: 'shader: flat; transparent: true; opacity: 0'
    });

    // Luz individual posicionada diante da obra, voltada para a superfície da moldura.
    const frameLight = el(group, 'a-light', {
      type: 'spot',
      color: art.accent,
      intensity: .18,
      angle: 58,
      penumbra: .8,
      distance: 4.5,
      decay: 2,
      position: '0 0 .82',
      rotation: '0 0 0'
    });

    const plaque = el(group, 'a-entity', { position: '1.82 0 .04' });
    const plaqueBase = box(plaque, '0 0 0', 1.15, 1.38, .08, '#242832');
    const plaqueNumber = el(plaque, 'a-text', { value: '0' + art.id + ' / EXPOSIÇÃO', align: 'left', color: '#d5b477', width: 1, position: '-.46 .48 .06' });
    const plaqueTitle = el(plaque, 'a-text', { value: art.title, align: 'left', color: '#f2eee5', width: 1, wrapCount: 17, position: '-.46 .19 .06' });
    el(plaque, 'a-text', { value: art.artist + '\n' + art.year, align: 'left', color: '#c9c4b9', width: 1, position: '-.46 -.2 .06' });
    const plaqueDescription = el(plaque, 'a-text', {
      value: art.description,
      align: 'left',
      color: '#b9b5ad',
      width: 1,
      wrapCount: 22,
      position: '-.46 -.42 .06',
      height: .32
    });

    const video = document.querySelector('#video-' + art.id);

    function focusArtwork() {
      titleNode.textContent = art.title;
      descriptionNode.textContent = art.artist + ' · ' + art.year + '. ' + art.description;
      hintNode.textContent = 'Obra 0' + art.id + ' · iluminação e descrição em destaque';
      caption.classList.add('is-active');

      animateTo(halo, 'halo', 'material.opacity', .34, 650);
      animateTo(frameLight, 'intensity', 'light.intensity', 1.35, 700);
      animateTo(trim, 'metal', 'material.emissiveIntensity', .8, 650);
      animateTo(plaqueBase, 'plaque', 'material.color', '#403523', 550);
      animateTo(plaqueTitle, 'title', 'color', art.accent, 500);
      animateTo(plaqueDescription, 'description', 'color', '#fff3d8', 550);
      animateTo(plaqueNumber, 'number', 'color', '#f4d49b', 500);

      if (video && video.readyState >= 2) {
        video.play().then(() => {
          animateTo(videoPlane, 'video', 'material.opacity', 1, 650);
        }).catch((error) => {
          hintNode.textContent = 'Toque na tela para permitir a reprodução do vídeo';
          console.info('Reprodução de vídeo aguardando interação.', error);
        });
      } else {
        hintNode.textContent = 'Obra 0' + art.id + ' · vídeo aguardando upload';
      }
    }

    function blurArtwork() {
      if (video) {
        video.pause();
        try { video.currentTime = 0; } catch (error) { /* O vídeo pode ainda não ter metadados. */ }
      }
      animateTo(videoPlane, 'video', 'material.opacity', 0, 350);
      animateTo(halo, 'halo', 'material.opacity', .08, 650);
      animateTo(frameLight, 'intensity', 'light.intensity', .18, 700);
      animateTo(trim, 'metal', 'material.emissiveIntensity', .10, 650);
      animateTo(plaqueBase, 'plaque', 'material.color', '#242832', 550);
      animateTo(plaqueTitle, 'title', 'color', '#f2eee5', 500);
      animateTo(plaqueDescription, 'description', 'color', '#b9b5ad', 550);
      animateTo(plaqueNumber, 'number', 'color', '#d5b477', 500);

      caption.classList.remove('is-active');
      titleNode.textContent = 'Bem-vindo ao Museu Virtual';
      descriptionNode.textContent = 'Aproxime-se de uma moldura e observe a obra para conhecer sua descrição e iniciar a animação.';
      hintNode.textContent = 'Joystick para caminhar · arraste para olhar';
    }

    trigger.addEventListener('mouseenter', focusArtwork);
    trigger.addEventListener('mouseleave', blurArtwork);
    trigger.addEventListener('click', focusArtwork);
  }

  // Mantém o visitante dentro da galeria sem interferir no movimento do A-Frame Extras.
  AFRAME.registerComponent('museum-boundaries', {
    tick() {
      const position = this.el.object3D.position;
      position.x = Math.max(-7.35, Math.min(7.35, position.x));
      position.z = Math.max(-8.35, Math.min(8.35, position.z));
      position.y = 0;
    }
  });

  document.querySelector('#enter-button').addEventListener('click', () => {
    intro.style.display = 'none';
    motionStatusNode.textContent = 'MODO WALK ATIVO · use o joystick à esquerda';
    hintNode.textContent = 'Joystick para caminhar · arraste para olhar';
  });
  document.querySelector('#help-button').addEventListener('click', () => { document.querySelector('#help-panel').hidden = false; });
  document.querySelector('#close-help').addEventListener('click', () => { document.querySelector('#help-panel').hidden = true; });

  scene.addEventListener('loaded', build);
  if (scene.hasLoaded) build();
})();