/* Combbi v2 · interacción
   1. Menú móvil (abrir, cerrar, Esc, clic fuera, cierre al navegar)
   2. Ficha de ejemplo: vender una prenda descuenta su talla
   3. Móvil: al verlo, entra un pedido online y la M baja de 2 a 1 (el único momento animado)
   4. Año del pie
   Nada se mueve por el scroll. */
(function () {
  "use strict";

  /* ---------- 1. Menú móvil ---------- */
  var boton = document.querySelector(".nav__boton");
  var menu = document.getElementById("menu-principal");
  var textoBoton = boton ? boton.querySelector(".nav__boton-texto") : null;
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

  /* ---------- 2. Ficha de ejemplo ---------- */
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
      var etiqueta = celda.closest(".talla");
      etiqueta.classList.toggle("agotada", n === 0);
      etiqueta.querySelector("input").setAttribute("aria-label",
        "Talla " + talla + ", " + (n === 0 ? "agotada" : n + (n === 1 ? " unidad" : " unidades")));
      if (animar) {
        etiqueta.classList.remove("cambio");
        void etiqueta.offsetWidth;
        etiqueta.classList.add("cambio");
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
      Object.keys(inicial).forEach(function (t) { stock[t] = inicial[t]; pintarTalla(t, false); });
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

  /* ---------- 3. Móvil: el único momento animado ---------- */
  var movil = document.querySelector("[data-movil]");
  if (movil) {
    var aviso = movil.querySelector("[data-aviso]");
    var miniM = movil.querySelector("[data-mini-m]");
    var quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    var temporizador = null;

    var ponerM = function (n) { if (miniM) miniM.lastChild.textContent = " " + n; };
    var aplicar = function () {
      ponerM(1);
      if (miniM) miniM.classList.add("mini--cambio");
      if (aviso) aviso.classList.add("visible");
    };
    var deshacer = function () {
      clearTimeout(temporizador);
      ponerM(2);
      if (miniM) miniM.classList.remove("mini--cambio");
      if (aviso) aviso.classList.remove("visible");
    };

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) {
            clearTimeout(temporizador);
            if (quieto.matches) aplicar();
            else temporizador = setTimeout(aplicar, 900);
          } else {
            deshacer();
          }
        });
      }, { threshold: 0.6 }).observe(movil);
    }
  }

  /* ---------- 4. Año del pie ---------- */
  var anio = document.querySelector("[data-anio]");
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
