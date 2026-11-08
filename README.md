# Brasil Imersivo — Realidade Virtual Geo

Projeto educativo sobre os **seis biomas brasileiros**, com uma página inicial de mapa interativo e uma experiência independente de Realidade Virtual com panoramas em 360°.

- **Página inicial (mapa interativo):** https://brenner279.github.io/realidadevirtual/
- **Experiência de Realidade Virtual:** https://brenner279.github.io/realidadevirtual/experiencia.html

## Estrutura e acesso

- `index.html`: página inicial com o mapa interativo e a apresentação dos seis biomas.
- `assets/styles.css` e `assets/app.js`: estilos e interações da página inicial.
- `experiencia.html`: experiência de Realidade Virtual com A-Frame.
- `style.css`: estilos da experiência VR.
- `assets/`: imagens e recursos complementares.

## Acessar o projeto

**Publicação pelo GitHub Actions:** abra **Settings → Pages → Build and deployment**, escolha **GitHub Actions** como fonte e salve. Essa primeira ativação precisa ser feita nas configurações do repositório; depois disso, o workflow publica automaticamente a cada atualização da branch `main`. O site ficará disponível em:

`https://brenner279.github.io/realidadevirtual/`

## Recursos do protótipo

- Seleção entre Amazônia, Cerrado, Caatinga, Mata Atlântica, Pantanal e Pampa.
- Cenários 3D construídos proceduralmente com A-Frame.
- **Amazônia em desenvolvimento avançado:** dossel e sub-bosque, árvores com raízes tabulares, palmeiras, rio, margens, tronco caído, pedras, representação estilizada de uma arara-vermelha e quatro pontos interativos sobre camadas da floresta, ciclo da água, biodiversidade e conservação.
- Navegação pelo cenário com teclado e mouse.
- Botão de entrada em realidade virtual, quando o dispositivo e o navegador oferecem suporte a WebXR.
- Carregamento local de uma fotografia panorâmica 360° para combinar a paisagem real com os elementos 3D.
- Painéis com informações educativas sobre cada bioma.
- Interface responsiva para computador e celular.

## Como testar

1. Abra `index.html` em um servidor local (por exemplo, a extensão Live Server do VS Code) para conhecer o mapa interativo.
2. Para acessar a experiência de Realidade Virtual, abra `experiencia.html`.
3. Na experiência VR (`experiencia.html`), escolha um bioma no painel.
4. No computador, use **W, A, S, D** ou as setas para se deslocar e arraste o mouse para olhar ao redor.
5. Clique em **Carregar foto 360°** e selecione uma imagem panorâmica equiretangular (proporção recomendada 2:1, por exemplo 4096 × 2048).
6. Clique em **Entrar em realidade virtual** em um navegador/dispositivo compatível.

> Para WebXR, o site precisa ser servido por HTTPS (ou localhost durante o desenvolvimento). O suporte a VR depende do navegador, do dispositivo e de seus recursos.

## Adicionar panoramas ao projeto

O botão **Carregar foto 360°** permite testar uma imagem diretamente no dispositivo, sem enviá-la ao GitHub. Para que um panorama seja carregado automaticamente por bioma em uma próxima versão, adicione os arquivos otimizados em `assets/panoramas/` e registre seus caminhos na configuração dos biomas em `index.html`.

Use imagens próprias, de domínio público ou com licença que permita reutilização. Registre a fonte e a licença de cada imagem.

## Tecnologias

- HTML5, CSS3 e JavaScript
- [A-Frame 1.8.0](https://aframe.io/docs/)
- WebXR
- GitHub Pages (hospedagem)

## Escopo e evolução

Este é um protótipo educativo em evolução. A Amazônia recebeu uma primeira expansão de cenário e conteúdo interativo; os demais biomas continuam com ambientes demonstrativos. Os modelos de árvores e animais são representações didáticas estilizadas, não reconstruções científicas em escala real. A camada de panorama 360° já permite testar fotografias locais; a próxima etapa é selecionar e integrar panoramas específicos e licenciados para cada bioma, além de adicionar modelos 3D de espécies nativas, trilhas e pontos de descoberta.

## Licença

A definir. As imagens, panoramas, modelos 3D e áudios incorporados futuramente devem manter suas atribuições e licenças individuais.


## Aplicativo Android offline

O repositório inclui um fluxo do GitHub Actions para empacotar a experiência em um APK Android com Capacitor. A compilação reúne no aplicativo o HTML, as imagens panorâmicas, os vídeos, a narração e a biblioteca A-Frame local. Depois de instalado, o conteúdo principal não precisa de conexão com a internet.

Para gerar o APK, acesse **Actions → Gerar APK Android → Run workflow**. Ao terminar, abra a execução concluída e baixe o artefato **Brasil-Imersivo-APK**. O arquivo gerado é um APK de depuração para instalação e testes. A compatibilidade do modo de óculos VR/WebXR precisa ser validada no aparelho; o WebView do Android pode não oferecer os mesmos recursos de VR de um navegador compatível.
