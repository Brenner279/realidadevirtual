# Museu Virtual — Galeria Imersiva
Museu de arte em realidade virtual desenvolvido com **A-Frame 1.6.0**, HTML, CSS e JavaScript.

## Primeira versão
- Galeria 3D com arquitetura de museu, iluminação e cinco pontos de exposição.
- Cinco molduras tridimensionais com painéis gráficos provisórios.
- Placa informativa ao lado de cada obra.
- Interação por olhar (gaze): ao focar uma obra, o vídeo correspondente é iniciado; ao desviar o olhar, é pausado.
- Navegação por teclado, mouse e dispositivos móveis.
- Entrada em modo VR quando o dispositivo oferece suporte a WebXR.

## Testar
Abra index.html por um servidor local ou publique no GitHub Pages. Na raiz do repositório, execute:
~~~bash
python -m http.server 8000
~~~
Depois acesse http://localhost:8000/museu-virtual/.

## Adicionar os vídeos
Coloque os arquivos MP4 em assets/videos/ com os nomes obra-01.mp4 até obra-05.mp4. Os painéis abstratos são provisórios e permanecem visíveis enquanto o vídeo não estiver disponível. Quando o arquivo estiver carregado, o vídeo aparece ao focar a moldura.

## Estrutura
- index.html: interface e cena A-Frame.
- css/style.css: tela de entrada, HUD e painel de descrição.
- js/museum.js: arquitetura, molduras, placas e interações.
- assets/videos/: vídeos da exposição.

Use HTTPS para recursos WebXR. O GitHub Pages oferece HTTPS.