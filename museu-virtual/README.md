# Museu Virtual — Galeria Imersiva
Museu de arte em realidade virtual desenvolvido com **A-Frame 1.6.0**, HTML, CSS e JavaScript.

## Recursos
- Galeria 3D com arquitetura de museu, iluminação e cinco pontos de exposição.
- Cinco molduras tridimensionais com painéis gráficos provisórios e placas informativas.
- No celular, caminhada automática por detecção de passos com o acelerômetro, avançando na direção para a qual a câmera está apontada.
- Permissão dos sensores solicitada ao tocar em “Entrar no museu”; o direcional permanece como alternativa em navegadores sem suporte.
- Navegação de teclado (WASD/setas) para computador e direcional de toque como alternativa.
- Movimentação calculada pela orientação real da câmera, em um rig independente, para que W/S acompanhem a direção do olhar.
- Deslocamento lateral e limites internos ajustados para chegar próximo às molduras sem atravessar as paredes.
- Direcional de toque com captura de ponteiro e cancelamento seguro para celulares.
- Detecção de passos por aceleração filtrada, com limiar e intervalo mínimo para reduzir movimentos acidentais.
- Ao olhar para uma obra, a iluminação da moldura aumenta suavemente, o halo dourado aparece e a placa e a descrição recebem destaque.
- O vídeo correspondente começa quando já estiver disponível; ao desviar o olhar, ele é pausado.
- Entrada em modo VR quando o dispositivo oferece suporte a WebXR.

## Testar
Abra `index.html` por um servidor local ou publique no GitHub Pages. Na raiz do repositório, execute:
~~~bash
python -m http.server 8000
~~~
Depois acesse http://localhost:8000/museu-virtual/.

## Adicionar os vídeos
Coloque os arquivos MP4 em `assets/videos/` com os nomes `obra-01.mp4` até `obra-05.mp4`. Os painéis abstratos são provisórios e permanecem visíveis enquanto o vídeo não estiver disponível. Quando o arquivo estiver carregado, o vídeo aparece ao focar a moldura.

## Estrutura
- `index.html`: interface, controles e cena A-Frame.
- `css/style.css`: tela de entrada, HUD, direcional e painel de descrição.
- `js/museum.js`: arquitetura, movimentação, molduras, iluminação e interações.
- `assets/videos/`: vídeos da exposição.

Use HTTPS para recursos WebXR e sensores de movimento. Em navegadores que exigem permissão, autorize o acesso ao movimento quando tocar em “Entrar no museu”.

**Limitação técnica:** o acelerômetro estima passos e não fornece rastreamento espacial preciso do corpo. Cada passo detectado é convertido em um avanço virtual aproximado; um rastreamento físico fiel exige dispositivo com tracking posicional 6DoF.
