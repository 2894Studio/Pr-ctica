# Plan aprobado: web de Combbi

**Opción elegida:** A, «La camisa verde en M».
**Negocio:** app de inventario para tiendas de moda independientes (lo de la agencia de selección de `design.md` era un error).

## Fuentes y reglas

- `estrategia.md` (brief): público, promesa, tono y lo que Combbi no es.
- `design.md`: colores, tipografía, esquinas y espaciados. Es lo único que se usa para estilos.
- `wise.com-DESIGN.md`: solo la estructura y los recursos de página (promesa sobre objeto, etiquetas flotantes, tarjetas, filas, cierre sobre textura y pie útil), siempre traducidos a los tokens de `design.md`.

## Resumen de marca

- **Público:** dueñas de tiendas de moda independientes, con una o dos tiendas y tienda online.
- **Propuesta de valor:** abres Combbi y sabes qué prendas y qué tallas te quedan, en tienda y online, sin ir al almacén.
- **Objetivo de la web:** presentar la app y apuntar tiendas a la **lista de espera** por email. Sin precio.
- **Palabra clave principal:** «app de inventario para tiendas de moda».
- **Tono:** seco y concreto. Sin «SKU», sin «escalar», sin «vende más», sin «en tiempo real».

## Cómo se combinan Wise y `design.md`

| Recurso de Wise | Versión Combbi |
|---|---|
| Apertura en lima a todo lo ancho | Fondo `lima` #D9FF8F con texto `bosque` #0B4F2E |
| Titulares en bloque, muy gruesos | Plus Jakarta Sans 700; mayúsculas solo en la apertura y el cierre |
| Botones en píldora | Principal `bosque`/`lima`; secundario con borde `bosque` |
| Bandas verde salvia | `crema` #F4EFE4 y `lima-suave` #E0F9BB; página en `fondo` #FBF8F0 |
| Tarjetas oscuras | `bosque` con texto `lima` |
| Etiquetas blancas flotantes | «Quedan 2 M · camisa de lino», «Inventario actualizado» |
| Cierre con textura pintada | Textura solo con `bosque`, `hoja`, `lima` y `crema`, con panel blanco encima |
| Esquinas | 24 px en bloques, 20 px en tarjetas, píldora en botones y etiquetas |
| `hoja` #2E7D4B | Solo para iconos y líneas; nunca para texto pequeño |

## Secciones y textos

1. **Cabecera:** logo, enlaces «Cómo funciona», «Funciones», «Para quién» y botón «Lista de espera». En móvil, menú que se abre y se cierra.
2. **Apertura (`lima`)**
   - h1: «App de inventario para tiendas de moda» + «Qué tallas te quedan, sin ir al almacén».
   - Texto de apoyo: «Combbi reúne en un solo sitio tus prendas, sus tallas y tus ventas online. Cada venta descuenta su talla, venga de la tienda o de la web.»
   - Botones: «Únete a la lista de espera» y «Mira cómo funciona».
   - Ficha de ejemplo «Camisa de lino · verde» que se puede usar: simula un pedido online de una M y aparece la etiqueta «Inventario actualizado».
3. **La escena (`crema`)**
   - h2: «La camisa verde, en M».
   - Texto: la clienta pide la talla, la dueña va al almacén y no está porque se vendió online y nadie lo apuntó. «Con Combbi lo ves antes de ir.»
4. **Funciones:** h2 «Tres cosas, en un solo sitio». Tres tarjetas: Inventario (percha), Tallas (caja) y Ventas online (carrito).
5. **Cómo funciona**
   - h2: «Así se mantiene al día».
   - Foto a un lado, con la etiqueta flotante «Quedan 2 M de la camisa de lino».
   - Tres filas al otro: vendes en tienda → se descuenta; entra un pedido online → se descuenta la misma talla; abres Combbi → ves qué queda.
6. **Para quién / lo que no es (`bosque`):** h2 «Lo que Combbi no hace». Sin facturas ni contabilidad. Prendas y tallas, no SKU ni variantes. Para una o dos tiendas y tu web, no para cadenas.
7. **Cierre (panel blanco sobre textura de marca)**
   - h2: «Tu tienda de moda, mejor gestionada».
   - Texto: «Combbi aún no está abierta. Apúntate a la lista de espera y te avisamos cuando puedas probarla en tu tienda.»
   - Botón: «Únete a la lista de espera» (`mailto:` con asunto y mensaje ya escritos).
8. **Pie (`crema`):** logo, enlaces a secciones y contacto por email. Sin textos legales (es una práctica de clase).

## Técnica

- HTML, CSS y JS puros, sin dependencias ni compilación.
- Archivos: `index.html`, `styles.css`, `script.js` y `assets/` (logos, iconos y fuentes del kit).
- SEO: un solo h1 con la palabra clave, `title`, meta description, Open Graph y textos alt.
- Accesibilidad: contrastes AA según la tabla de `design.md`, foco visible, enlace para saltar al contenido, menú usable con teclado (Esc cierra) y `prefers-reduced-motion`.

## Cambios posteriores

- **Apertura rehecha:** titular grande a la izquierda y, a la derecha, la dueña de la tienda sobre un círculo `bosque`, con tarjetas flotantes («Quedan 2 M de la camisa de lino», «Pedido online», «Inventario actualizado»).
- La foto se generó en Canva y se recortó quitando un fondo magenta (`assets/fotos/duena.webp`).
- La ficha de ejemplo de la camisa pasó de la apertura a «Así se mantiene al día».
- «Funciones» ahora es un móvil central con tarjetas alrededor y una línea lima ondulada.

## Decisiones posteriores

- Contacto solo por email; sin WhatsApp ni teléfono.
- Sin precio, sin datos legales y sin redes sociales.
- Imagen para compartir: `assets/logos/combbi-wordmark-sobre-verde.png`.

## Datos pendientes

Marcados en la web como `[PENDIENTE: …]`:

- email de contacto
- foto(s) de la sección «Así se mantiene al día»
- dominio (comentario en el `<head>`, para `canonical` y `og:url`)
- confirmar que cada venta descuenta su talla en tienda y online
- tiendas online compatibles
