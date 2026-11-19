/* Combbi · interacción
   1. Menú móvil (abrir/cerrar, Esc, clic fuera, cierre al navegar)
   2. Sombra de la cabecera al desplazarse
   3. Ficha de ejemplo: vender en tienda / pedido online descuenta la talla
   4. Año del pie
   5. Aparición al hacer scroll, profundidad (parallax), onda y aviso del móvil
*/
document.documentElement.classList.add("js");
(function () {
  "use strict";

  /* ---------- 1. Menú móvil ---------- */
  var boton = document.querySelector(".menu-boton");
  var menu = document.getElementById("menu-principal");
  var textoBoton = boton ? boton.querySelector(".menu-boton__texto") : null;
  var escritorio = window.matchMedia("(min-width: 900px)");

  function abrirMenu(abrir) {
    if (!boton || !menu) return;
    boton.setAttribute("aria-expanded", abrir ? "true" : "false");
    menu.classList.toggle("abierto", abrir);
    if (textoBoton) textoBoton.textContent = abrir ? "Cerrar" : "Menú";
  }

  if (boton && menu) {
    boton.addEventListener("click", function () {
      abrirMenu(boton.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) abrirMenu(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && boton.getAttribute("aria-expanded") === "true") {
        abrirMenu(false);
        boton.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (boton.getAttribute("aria-expanded") === "true" &&
          !menu.contains(e.target) && !boton.contains(e.target)) {
        abrirMenu(false);
      }
    });

    var alCambiar = function () { if (escritorio.matches) abrirMenu(false); };
    if (escritorio.addEventListener) escritorio.addEventListener("change", alCambiar);
    else if (escritorio.addListener) escritorio.addListener(alCambiar);
  }

  /* ---------- 2. Sombra de la cabecera ---------- */
  var cabecera = document.querySelector(".cabecera");
  if (cabecera) {
    var actualizarSombra = function () {
      cabecera.classList.toggle("con-sombra", window.scrollY > 8);
    };
    window.addEventListener("scroll", actualizarSombra, { passive: true });
    actualizarSombra();
  }

  /* ---------- 3. Ficha de ejemplo ---------- */
  var ficha = document.querySelector(".ficha");
  if (ficha) {
    var inicial = { XS: 1, S: 3, M: 2, L: 4, XL: 0 };
    var stock = {};
    var prenda = "la camisa de lino";

    var total = ficha.querySelector("[data-total]");
    var estado = ficha.querySelector("[data-estado]");
    var estadoTexto = ficha.querySelector("[data-estado-texto]");
    var reiniciar = ficha.querySelector("[data-reiniciar]");
    var botonesVenta = ficha.querySelectorAll("[data-venta]");
    var radios = ficha.querySelectorAll('input[name="talla"]');

    var tallaElegida = function () {
      var r = ficha.querySelector('input[name="talla"]:checked');
      return r ? r.value : "M";
    };

    var frase = function (talla, n) {
      if (n === 0) return "No quedan " + talla + " de " + prenda;
      return (n === 1 ? "Queda 1 " : "Quedan " + n + " ") + talla + " de " + prenda;
    };

    var pintarTalla = function (talla, animar) {
      var celda = ficha.querySelector('[data-cantidad="' + talla + '"]');
      if (!celda) return;
      var n = stock[talla];
      celda.textContent = n === 0 ? "Agotada" : String(n);
      var label = celda.closest(".talla");
      label.classList.toggle("agotada", n === 0);
      var input = label.querySelector("input");
      input.setAttribute("aria-label", "Talla " + talla + ", " + (n === 0 ? "agotada" : n + (n === 1 ? " unidad" : " unidades")));
      if (animar) {
        label.classList.remove("cambio");
        void label.offsetWidth; // reinicia la animación
        label.classList.add("cambio");
      }
    };

    var pintarTotal = function () {
      var suma = 0;
      Object.keys(stock).forEach(function (t) { suma += stock[t]; });
      if (total) total.textContent = String(suma);
    };

    var pintarBotones = function () {
      var agotada = stock[tallaElegida()] === 0;
      Array.prototype.forEach.call(botonesVenta, function (b) { b.disabled = agotada; });
    };

    var anunciar = function (texto) {
      if (!estadoTexto) return;
      estadoTexto.textContent = texto;
      estado.classList.remove("actualizada");
      void estado.offsetWidth;
      estado.classList.add("actualizada");
    };

    var empezar = function () {
      Object.keys(inicial).forEach(function (t) {
        stock[t] = inicial[t];
        pintarTalla(t, false);
      });
      pintarTotal();
      pintarBotones();
      if (reiniciar) reiniciar.hidden = true;
    };

    Array.prototype.forEach.call(radios, function (r) {
      r.addEventListener("change", function () {
        pintarBotones();
        anunciar(frase(r.value, stock[r.value]));
      });
    });

    Array.prototype.forEach.call(botonesVenta, function (b) {
      b.addEventListener("click", function () {
        var talla = tallaElegida();
        if (stock[talla] === 0) return;
        stock[talla] -= 1;
        pintarTalla(talla, true);
        pintarTotal();
        pintarBotones();
        var origen = b.getAttribute("data-venta") === "online"
          ? "Pedido online de una " + talla
          : "Venta en tienda de una " + talla;
        anunciar("Inventario actualizado · " + origen + ". " + frase(talla, stock[talla]) + ".");
        if (reiniciar) reiniciar.hidden = false;
      });
    });

    if (reiniciar) {
      reiniciar.addEventListener("click", function () {
        empezar();
        anunciar(frase(tallaElegida(), stock[tallaElegida()]));
      });
    }

    empezar();
  }

  /* ---------- 5. Movimiento ---------- */
  var sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");
  var ancho = window.matchMedia("(min-width: 1024px)");
  var hayIO = "IntersectionObserver" in window;

  // 5a. Aparición: las tarjetas suben a su sitio al entrar en pantalla
  var revelables = document.querySelectorAll("[data-revelar]");
  var revelar = function (el) {
    el.classList.add("visible");
    setTimeout(function () { el.classList.add("listo"); }, 900);
  };
  if (hayIO && !sinMovimiento.matches) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { revelar(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    Array.prototype.forEach.call(revelables, function (el, i) {
      el.style.transitionDelay = (i % 2) * 120 + "ms";
      io.observe(el);
    });
  } else {
    Array.prototype.forEach.call(revelables, revelar);
  }

  // 5b. Profundidad con el scroll y la onda que se dibuja
  var capas = document.querySelectorAll("[data-profundidad]");
  var onda = document.querySelector(".escaparate__onda path");
  var largoOnda = 0;
  if (onda && onda.getTotalLength) {
    largoOnda = onda.getTotalLength();
    onda.style.strokeDasharray = largoOnda + " " + largoOnda;
  }

  var pendiente = false;
  var actualizar = function () {
    pendiente = false;
    var alto = window.innerHeight;
    var quieto = sinMovimiento.matches;

    Array.prototype.forEach.call(capas, function (el) {
      var enCarrusel = !ancho.matches && el.closest(".escaparate__lado");
      if (quieto || enCarrusel) { el.style.setProperty("--py", "0px"); return; }
      var r = el.getBoundingClientRect();
      var centro = (r.top + r.height / 2 - alto / 2) / alto; // -1 … 1
      var prof = parseFloat(el.getAttribute("data-profundidad")) || 0;
      el.style.setProperty("--py", (centro * -prof).toFixed(1) + "px");
    });

    if (onda && largoOnda) {
      if (quieto) { onda.style.strokeDashoffset = "0"; return; }
      var r2 = onda.closest(".escaparate").getBoundingClientRect();
      var avance = (alto - r2.top) / (alto * 0.9 + r2.height * 0.4);
      avance = Math.max(0, Math.min(1, avance));
      onda.style.strokeDashoffset = (largoOnda * (1 - avance)).toFixed(1);
    }
  };
  var pedir = function () {
    if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); }
  };
  window.addEventListener("scroll", pedir, { passive: true });
  window.addEventListener("resize", pedir);
  actualizar();

  // 5c. La escena sigue un poco al puntero (solo ratón)
  var escena = document.querySelector("[data-escena]");
  if (escena && window.matchMedia("(pointer: fine)").matches) {
    var flotantes = escena.querySelectorAll("[data-profundidad]");
    escena.addEventListener("pointermove", function (e) {
      if (sinMovimiento.matches) return;
      var r = escena.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      Array.prototype.forEach.call(flotantes, function (el) {
        var prof = parseFloat(el.getAttribute("data-profundidad")) || 0;
        el.style.setProperty("--px", (x * prof * 0.6).toFixed(1) + "px");
      });
    });
    escena.addEventListener("pointerleave", function () {
      Array.prototype.forEach.call(flotantes, function (el) { el.style.setProperty("--px", "0px"); });
    });
  }

  // 5d. Móvil: al verlo, entra un pedido online y la M baja de 2 a 1
  var movil = document.querySelector("[data-movil]");
  if (movil) {
    var aviso = movil.querySelector("[data-aviso]");
    var chipM = null;
    Array.prototype.forEach.call(movil.querySelectorAll("[data-prenda-demo] .chip"), function (c) {
      if (c.querySelector("b").textContent === "M") chipM = c;
    });
    var temporizador = null;
    var ponerM = function (n) {
      if (!chipM) return;
      chipM.lastChild.textContent = " " + n;
    };
    var reproducir = function () {
      clearTimeout(temporizador);
      if (sinMovimiento.matches) {
        ponerM(1); chipM && chipM.classList.add("chip--cambio"); aviso.classList.add("visible");
        return;
      }
      temporizador = setTimeout(function () {
        ponerM(1);
        if (chipM) chipM.classList.add("chip--cambio");
        aviso.classList.add("visible");
      }, 900);
    };
    var reiniciar = function () {
      clearTimeout(temporizador);
      ponerM(2);
      if (chipM) chipM.classList.remove("chip--cambio");
      aviso.classList.remove("visible");
    };
    if (hayIO) {
      new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) { if (e.isIntersecting) reproducir(); else reiniciar(); });
      }, { threshold: 0.6 }).observe(movil);
    } else {
      reproducir();
    }
  }

  /* ---------- 4. Año del pie ---------- */
  var anio = document.querySelector("[data-anio]");
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
