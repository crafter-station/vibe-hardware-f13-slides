# Vibe Hardware · Field Map

Mapa interactivo para **“Nuestro workflow con IA para construir hardware”**, presentado por Shiara y Anthony en F13.

No es una secuencia de slides. Todo el contenido vive en un único mapa conectado: se puede ver la ruta completa, entrar a cualquiera de sus 9 puntos, hacer zoom y recorrer el canvas libremente.

## Ejecutar

```bash
bun install
bun run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Navegación

| Control | Acción |
| --- | --- |
| Click en un punto numerado | Viajar directamente a ese punto |
| `→`, `↓`, `Space` | Siguiente punto |
| `←`, `↑` | Punto anterior |
| `O`, `Esc`, `Home` | Volver al mapa completo |
| Scroll, `+`, `-` | Zoom libre alrededor del cursor |
| Drag | Recorrer libremente el mapa |
| `End` | Ir al cierre |
| `F` | Pantalla completa |
| `T` | Tema oscuro / claro |
| `M` | Audio ambiente y señales |
| `N` | Notas para presenters |
| `R` | Repetir la secuencia visual de apoyo en el punto 7 |

El navegador exige una primera interacción antes de reproducir audio; el mapa muestra un botón discreto para activarlo.

## Antes del evento

1. Sustituir la placa genérica del punto 1 por una foto limpia del proyecto terminado.
2. Preparar dos ejemplos reales y breves de errores del agente para el punto 3.
3. El QR del punto 9 apunta a [crafters.chat](http://crafters.chat/), la comunidad de devs aprendiendo a shippear hardware.
4. Ensayar la demo física con los valores esperado y medido del punto 7.
5. Conectar la cámara al MacBook y ensayar el cambio entre slides, app de cámara y agente en el punto 7.
6. Seguir el guion cronometrado de [`PRESENTATION-GUIDE.md`](./PRESENTATION-GUIDE.md) para ensayar roles, acciones y plan B.

## Verificar

```bash
bun run check
bun build ./index.html --outdir ./dist
```

Las atribuciones de fotografías y tipografías están en [`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md).
