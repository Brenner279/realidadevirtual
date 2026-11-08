# Brasil Imersivo — Realidade Virtual Geo

Experiência educativa para explorar os **seis biomas brasileiros** por meio de ambientes 3D, panoramas em 360°, conteúdos de Geografia, narração e recursos audiovisuais.

**Acesse o projeto:** https://brenner279.github.io/realidadevirtual/

## Experiência

A página principal do repositório (index.html) abre diretamente a experiência de Realidade Virtual.

- Exploração dos seis biomas: Amazônia, Cerrado, Caatinga, Mata Atlântica, Pantanal e Pampa.
- Ambientes 3D com A-Frame.
- Panoramas fotográficos em 360°.
- Conteúdos educativos e pontos interativos.
- Narração e vídeo 360°.
- Interface para computador e celular.
- Entrada em realidade virtual quando o navegador e o dispositivo oferecem suporte.

## Arquivos principais

- index.html: experiência principal de Realidade Virtual.
- style.css: estilos da experiência.
- assets/mapa.png: mapa utilizado na experiência.
- amaz.png, Caatinga.png, Cer.png, Mata.png, Pantanal.png, Pampa.png: recursos visuais dos biomas.
- Amazonia.mp3: narração.
- v360amz.mp4: vídeo 360°.
- assets/panoramas/: orientações para panoramas adicionais.

## Como testar

1. Acesse o link publicado pelo GitHub Pages.
2. Escolha um bioma e explore o ambiente.
3. No computador, utilize os controles apresentados na interface.
4. Em um dispositivo compatível, utilize a opção de entrada em realidade virtual.

Para WebXR, a página deve ser acessada por HTTPS (ou localhost durante o desenvolvimento). O suporte ao modo VR depende do navegador, do aparelho e de seus recursos.

## Aplicativo Android

O repositório mantém a configuração do Capacitor e o fluxo do GitHub Actions para gerar um APK de depuração. Para iniciar a compilação, acesse Actions → Gerar APK Android → Run workflow. Ao concluir, baixe o artefato Brasil-Imersivo-APK.

A compatibilidade de WebXR/VR no WebView do Android deve ser validada no aparelho; pode diferir da experiência em um navegador compatível.

## Tecnologias

- HTML5, CSS3 e JavaScript
- A-Frame 1.8.0
- WebXR
- Capacitor
- GitHub Pages e GitHub Actions

## Observação

Este projeto é um protótipo educativo em evolução. Verifique a disponibilidade e a licença dos recursos audiovisuais antes de redistribuí-los.
