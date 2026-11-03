# Museu Virtual — Galeria Imersiva
Museu de arte em realidade virtual desenvolvido com **A-Frame 1.6.0**, HTML, CSS e JavaScript.

## Recursos
- Galeria 3D com arquitetura de museu, iluminação e cinco pontos de exposição.
- Cinco molduras tridimensionais com painéis gráficos provisórios e placas informativas.
- No celular, a cada **3 passos detectados** pelo acelerômetro, o visitante avança automaticamente **1,5 metro** na direção horizontal para a qual a câmera está apontada.
- Permissão dos sensores solicitada ao tocar em “Entrar no museu”; o direcional permanece como alternativa em navegadores sem suporte.
- Navegação de teclado (WASD/setas) para computador e direcional de toque como alternativa.
- Movimentação calculada pela orientação real da câmera, em um rig independente, para que W/S acompanhem a direção do olhar.
- Deslocamento lateral e limites internos ajustados para chegar próximo às molduras sem atravessar as paredes.
- Direcional de toque com captura de ponteiro e cancelamento seguro para celulares.
- Detecção de passos por aceleração filtrada, com limiar e intervalo mínimo para reduzir movimentos acidentais. O contador visual informa 1/3, 2/3 e 3/3; ao completar três passos, inicia uma aproximação suave de 1,5 metro.
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

**Limitação técnica:** o acelerômetro estima passos e não fornece rastreamento espacial preciso do corpo. Cada grupo de três passos detectados é convertido em um avanço virtual de 1,5 metro; um rastreamento físico fiel exige dispositivo com tracking posicional 6DoF.
