# Nuestro workflow con IA para construir hardware

Deck de 27 slides para una charla de 30 minutos en F13. La presentación sigue
un solo ejemplo: construir un primer robot desde software, verificar cada etapa
y depurar una falla con un multímetro.

La secuencia cubre comportamiento, inventario, arquitectura, energía, contexto
del agente, mapa de pines, protección de ECHO, pruebas aisladas, integración,
debugging y verificación final. Incluye interacciones reproducibles con Cursor y
GPT-5.6 Sol High para planificar, generar una prueba mínima y depurar con
mediciones.

## Ejecutar

```bash
bun install
bun run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Navegación

- `→`, `↓`, `Space`, click: siguiente slide
- `←`, `↑`: slide anterior
- `Home`: inicio
- `End`: cierre
- `F`: pantalla completa
- `N`: notas para presenters

## Ejemplo del robot

- ESP32
- Sensor ultrasónico HC-SR04
- Driver de motores TB6612FNG
- Dos motores DC
- Cuatro pilas AA para los motores
- Alimentación USB para el ESP32
- Tierra compartida
- Divisor de voltaje entre ECHO y el GPIO del ESP32

La falla controlada de la demo es la alimentación de motores apagada. El robot
detecta el obstáculo, pero las ruedas no giran. La primera prueba segura es
medir `VM` en el driver: se esperan aproximadamente 6 V y se observan 0 V.

## Antes del evento

1. Confirmar los componentes reales y sus datasheets.
2. No presentar el ejemplo como una construcción real si todavía no fue
   montado y medido.
3. Ensayar la demo con el robot elevado para que las ruedas giren sin moverse.
4. Preparar una respuesta del agente y una grabación de respaldo.
5. Verificar que el QR final apunta a los recursos correctos.
6. Seguir [`PRESENTATION-GUIDE.md`](./PRESENTATION-GUIDE.md).
7. Reemplazar `robot-plan.svg` por una foto propia del montaje terminado.
8. Reemplazar los ejemplos de agente por capturas de interacciones reales.

## Verificar

```bash
bun run check
bun run build
```

Las atribuciones de tipografías están en
[`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md).
