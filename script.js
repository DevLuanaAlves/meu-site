// Menu Mobile
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Fechar menu ao clicar em um link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// Formulário de Contato
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Obrigada pela mensagem! Entrarei em contato em breve. 😊");
  this.reset();
});

// Animação de rolagem suave
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Adicionar classe ativa ao link da navegação ao rolar
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

//numeros animados
document.addEventListener("DOMContentLoaded", () => {
  const statNumbers = document.querySelectorAll(".stat-number");
  let animationStarted = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animationStarted) {
          animationStarted = true;
          animarNumeros();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 },
  );

  const secaoSobre = document.querySelector("#about");
  if (secaoSobre) observer.observe(secaoSobre);

  function animarNumeros() {
    statNumbers.forEach((el) => {
      // Pega o texto atual, ex: "2+" -> extrai 2
      const textoOriginal = el.textContent.trim();
      const numeroExtraido = parseInt(textoOriginal, 10);
      let sufixo = textoOriginal.replace(/[\d]/g, ""); // captura "+", "%", etc.

      // Se tiver data-target, usa ele (prioridade)
      let target = parseInt(el.getAttribute("data-target"), 10);
      if (isNaN(target)) {
        target = numeroExtraido;
        if (isNaN(target)) return; // se não for número, pula
      }

      

      const duracao = 2000;
      const inicio = performance.now();

      function atualizar(agora) {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const valorAtual = Math.floor(progresso * target);
        el.textContent = valorAtual + sufixo;

        if (progresso < 1) {
          requestAnimationFrame(atualizar);
        } else {
          el.textContent = target + sufixo; // valor final
        }
      }
      requestAnimationFrame(atualizar);
    });
  }
});


//EFEITO DE DIGITAÇÃO (no hero)


document.addEventListener("DOMContentLoaded", () => {
  const elemento = document.querySelector(".hero-content h2");
  if (!elemento) return;

  const texto = "Desenvolvedora Full-Stack";
  // Limpa o conteúdo estático (que estava no HTML)
  elemento.textContent = "";
  let index = 0;
  let cursorVisible = true;
  let cursorInterval;

  function digitar() {
    if (index < texto.length) {
      elemento.textContent = texto.substring(0, index + 1);
      index++;
      setTimeout(digitar, 80);
    } else {
      // Após terminar, mantém o cursor piscando
      clearInterval(cursorInterval);
      cursorInterval = setInterval(() => {
        cursorVisible = !cursorVisible;
        elemento.textContent = texto + (cursorVisible ? "|" : "");
      }, 500);
    }
  }

  // Pequeno delay para não começar instantaneamente
  setTimeout(digitar, 400);
});


//  DADOS DO GITHUB – SELINHO DE ATUALIZAÇÃO
// Busca os repositórios públicos e adiciona um selinho
// em cada card de projeto com a data da última atualização.
// O selinho é criado dinamicamente

document.addEventListener("DOMContentLoaded", () => {
  const USERNAME = "DevLuanaAlves"; // ⚠️ Substitua se necessário
  const API_URL = `https://api.github.com/users/${USERNAME}/repos`;

  // Primeiro, garante que cada card tenha um local para o selinho.
  // Se não existir, cria um span com a classe .repo-updated.
  document.querySelectorAll(".project-card").forEach((card) => {
    let selinho = card.querySelector(".repo-updated");
    if (!selinho) {
      selinho = document.createElement("span");
      selinho.className = "repo-updated";
      selinho.style.display = "inline-block";
      selinho.style.marginTop = "12px";
      selinho.style.fontSize = "12px";
      selinho.style.fontFamily = "IBM Plex Mono, monospace";
      selinho.style.color = "#A79FC2";
      selinho.style.border = "1px solid rgba(255,255,255,0.08)";
      selinho.style.padding = "4px 12px";
      selinho.style.borderRadius = "4px";
      selinho.textContent = "⏳ carregando...";
      // Insere antes do .project-links (ou no final do card)
      const links = card.querySelector(".project-links");
      if (links) {
        card.insertBefore(selinho, links);
      } else {
        card.appendChild(selinho);
      }
    }
  });

  fetch(API_URL)
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar repositórios");
      return res.json();
    })
    .then((repos) => {
      // Cria um mapa de nome do repo -> data de push
      const repoMap = new Map();
      repos.forEach((repo) => {
        repoMap.set(repo.name.toLowerCase(), new Date(repo.pushed_at));
      });

      // Para cada card, tenta encontrar o repositório correspondente
      document.querySelectorAll(".project-card").forEach((card) => {
        const titulo = card.querySelector("h3");
        if (!titulo) return;
        const nomeProjeto = titulo.textContent.trim().toLowerCase();

        // Tenta encontrar pelo nome exato ou contendo
        let dataPush = null;
        for (let [repoName, date] of repoMap.entries()) {
          if (
            repoName === nomeProjeto ||
            repoName.includes(nomeProjeto) ||
            nomeProjeto.includes(repoName)
          ) {
            dataPush = date;
            break;
          }
        }

        const selinho = card.querySelector(".repo-updated");
        if (!selinho) return;

        if (dataPush) {
          const agora = new Date();
          const diffMs = agora - dataPush;
          const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          let texto = "";
          if (diffDias === 0) texto = "Atualizado hoje";
          else if (diffDias === 1) texto = "Atualizado há 1 dia";
          else texto = `Atualizado há ${diffDias} dias`;
          selinho.textContent = texto;
          selinho.style.borderColor = "#B197FC";
          selinho.style.color = "#B197FC";
        } else {
          selinho.textContent = "⚡ repo não encontrado";
        }
      });
    })
    .catch((err) => {
      console.warn("Falha ao obter dados do GitHub:", err);
      document.querySelectorAll(".repo-updated").forEach((el) => {
        el.textContent = "⚠️ erro ao carregar";
      });
    });
});
