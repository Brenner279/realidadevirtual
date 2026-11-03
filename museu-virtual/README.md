# Museu Virtual — Galeria Imersiva

Museu de arte em realidade virtual desenvolvido com **A-Frame 1.7.0**, **A-Frame Extras 7.7.0**, HTML, CSS e JavaScript.

## Navegação Walk (atualização)

A experiência utiliza os componentes oficiais do A-Frame Extras:
- `movement-controls`: controla a locomoção do visitante e a direção da câmera.
- `nipple-controls`: cria um joystick virtual fixo no celular.
- No celular, use o joystick no canto inferior esquerdo para caminhar; arraste o lado direito da tela para olhar ao redor.
- No computador, use WASD ou as setas e o mouse para olhar.
- O movimento é contínuo enquanto o joystick estiver inclinado, sem contar passos ou exigir toques repetidos.
- Um componente de limites mantém o visitante dentro da galeria.

## Recursos
- Galeria 3D com arquitetura de museu, iluminação e cinco pontos de exposição.
- Cinco molduras tridimensionais com painéis gráficos provisórios e placas informativas.
- Ao olhar para uma obra, a iluminação da moldura aumenta suavemente, o halo dourado aparece e a placa e a descrição recebem destaque.
- O vídeo correspondente começa quando já estiver disponível; ao desviar o olhar, ele é pausado.
- Entrada em modo VR quando o dispositivo oferece suporte a WebXR.

## Testar
Abra `index.html` por um servidor local ou publique no GitHub Pages. Na raiz do repositório, execute:

```bash
python -m http.server 8000
```

Depois acesse http://localhost:8000/museu-virtual/.

## Adicionar os vídeos
Coloque os arquivos MP4 em `assets/videos/` com os nomes `obra-01.mp4` até `obra-05.mp4`. Os painéis abstratos são provisórios e permanecem visíveis enquanto o vídeo não estiver disponível.

## Estrutura
- `index.html`: interface, controles e cena A-Frame.
- `css/style.css`: tela de entrada, HUD, joystick e painel de descrição.
- `js/museum.js`: arquitetura, limites de movimento, molduras, iluminação e interações.
- `assets/videos/`: vídeos da exposição.

Os scripts A-Frame e A-Frame Extras são carregados por CDN. A publicação deve utilizar HTTPS para habilitar recursos WebXR.
