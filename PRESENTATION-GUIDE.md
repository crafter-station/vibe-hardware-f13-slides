# Nuestro workflow con IA para construir hardware

Guion de práctica para una charla de 30 minutos en F13.

## Tesis

> El agente acelera propuestas. Las fuentes y las mediciones autorizan el
> siguiente paso.

## Resultado

Construir un robot de dos ruedas que:

1. Avanza.
2. Mide distancia con un HC-SR04.
3. Se detiene a menos de 20 cm de un obstáculo.
4. Gira y continúa.

El montaje usa un ESP32, un TB6612FNG, dos motores DC, cuatro pilas AA, tierra
compartida y un divisor de voltaje para ECHO.

El ejemplo sigue siendo ilustrativo hasta montar y medir el hardware exacto.

## Cronograma

| Slides | Contenido | Tiempo |
| --- | --- | ---: |
| 1–3 | Resultado y comportamiento | 2:30 |
| 4–7 | Piezas, arquitectura y estrategia | 4:45 |
| 8–12 | Contexto, prompt y propuesta | 5:45 |
| 13–18 | Verificación y construcción incremental | 7:15 |
| 19–22 | Demo de debugging | 5:45 |
| 23–24 | Alucinaciones y checklist | 1:45 |
| 25–27 | Resultado, workflow y cierre | 2:00 |
|  | **Total** | **30:00** |

## Guion

### Slide 1 — 0:30

> Vamos a construir un primer proyecto de hardware de principio a fin usando un
> agente. El agente ayuda, pero no decide qué es seguro conectar.

### Slide 2 — 1:00

> Este es el resultado: un robot de dos ruedas que percibe un obstáculo y cambia
> su movimiento. Vamos a recorrer todo lo necesario para llegar aquí.

Mostrar el robot real si ya está listo. La ilustración debe reemplazarse por una
foto propia antes del evento.

### Slide 3 — 1:00

> Empezamos con comportamiento verificable: avanzar, medir, detenerse a 20
> centímetros y girar. Estas cuatro acciones son nuestras pruebas de aceptación.

### Slide 4 — 1:15

> Cerramos el inventario. El agente no puede agregar componentes que no están
> sobre la mesa. Antes del evento confirmamos la revisión exacta de cada módulo.

Mostrar físicamente el ESP32, el HC-SR04 y el TB6612FNG.

### Slide 5 — 1:00

> Pensamos el robot como un sistema de software: entrada, decisión y salida. El
> HC-SR04 produce datos, el ESP32 decide y el driver entrega corriente a los
> motores.

> El ESP32 controla el motor. No lo alimenta.

### Slide 6 — 1:30

> Tenemos dos dominios. USB alimenta la lógica. Las pilas alimentan los motores
> por VM. Ambos comparten tierra para que las señales tengan la misma referencia.

Explicar que los picos de corriente de los motores pueden resetear el
microcontrolador si se trata todo como una sola carga.

### Slide 7 — 1:00

> Construimos por etapas. Cada etapa termina con una prueba. No integramos la
> siguiente parte hasta que la anterior produzca evidencia estable.

### Slide 8 — 1:15

> El agente empieza con contexto: fuentes exactas, inventario, restricciones y
> estado real del montaje. La memoria del modelo no es una fuente.

### Slide 9 — 1:15

> Reservamos pines antes de pedir firmware. Cada pin debe existir en nuestra placa,
> soportar la dirección requerida y no interferir con el arranque.

La tabla es ilustrativa. Confirmarla contra el pinout del ESP32 exacto.

### Slide 10 — 1:15

> Abrimos Cursor con GPT-5.6 Sol High y pedimos arquitectura antes de código. La
> salida debe incluir conexiones, voltajes, fuentes, riesgos y una prueba sin
> energía.

Interacción:

1. Cargar el contexto real del montaje.
2. Pegar la instrucción visible en la slide.
3. Detener al agente cuando entregue el mapa.
4. Revisar la respuesta antes de aceptar cambios.

Reemplazar el ejemplo por una captura real. Guardar una captura de respaldo para
presentar sin internet.

### Slide 11 — 1:00

> El mapa del agente es una propuesta revisable. Validamos cada línea como una
> interfaz entre dos sistemas y conectamos después.

### Slide 12 — 1:00

> Para cada conexión identificamos origen, destino, fuente y prueba. Esta plantilla
> es más importante que la seguridad con la que el modelo redacta la respuesta.

### Slide 13 — 1:15

> Aquí aparece el riesgo principal. ECHO sale cerca de 5 voltios. El GPIO del
> ESP32 usa lógica de 3.3 voltios. Una respuesta convincente no cambia ese límite.

No afirmar que esta propuesta apareció en una conversación real sin conservar la
evidencia. Presentarla como un caso reproducible.

### Slide 14 — 1:15

> Agregamos un divisor. Con 1 kiloohm arriba y 2 kiloohms hacia tierra obtenemos
> aproximadamente 3.3 voltios. Antes de conectar el GPIO, medimos la salida real.

Verificar resistencias, tolerancias y voltaje con el montaje exacto.

### Slide 15 — 1:15

> Después de aprobar el circuito, Cursor genera la prueba más pequeña: leer
> distancia por serial con los pines acordados y sin incluir motores.

Interacción:

1. Pedir un único cambio pequeño.
2. Revisar el diff antes de ejecutar.
3. Compilar y cargar el firmware.
4. Mover un objeto y comparar la lectura con una regla.

Mostrar el diff real y la salida serial real durante la charla.

### Slide 16 — 1:15

> Probamos los motores con las ruedas elevadas. Primero medimos VM, luego ponemos
> STBY en alto y giramos un motor a la vez. Así detectamos polaridad y dirección
> sin que el robot salga disparado.

### Slide 17 — 1:15

> La integración inicial es pequeña. Si la distancia es menor a 20 centímetros,
> detenemos y giramos. En cualquier otro caso avanzamos.

El código mostrado es pseudocódigo; el firmware real debe coincidir con la
biblioteca y los pines verificados.

### Slide 18 — 1:00

> Cada estado deja evidencia en serial y en el movimiento. El log debe decir
> LEYENDO, AVANZANDO, DETENIDO o GIRANDO para conectar la decisión del software con
> el resultado físico.

### Slide 19 — 0:45

> Ahora ejecutamos el robot. El sensor funciona, pero las ruedas no giran. No
> cambiamos código todavía.

Iniciar la demo física.

### Slide 20 — 1:00

> Ordenamos tres hipótesis: falta alimentación en VM, STBY está bajo o las señales
> PWM están mal. Empezamos por la prueba más barata y menos invasiva.

### Slide 21 — 3:00

> Configuramos el multímetro en voltaje DC. Punta negra a GND y punta roja a VM.
> Esperamos aproximadamente 6 voltios. Medimos 0.0.

> Esa lectura prioriza batería, switch y continuidad. Todavía no hay evidencia
> para tocar el firmware.

Después de corregir la alimentación, volver a medir VM antes de activar los
motores.

### Slide 22 — 1:00

> Devolvemos evidencia concreta: VM igual a 0.0 voltios, USB activo y sensor
> estable. También indicamos que no cambie firmware. El agente propone medir antes
> y después del switch para localizar dónde desaparece el voltaje.

Interacción:

1. Escribir valores observados, no “sigue fallando”.
2. Pedir una sola prueba que separe hipótesis.
3. Ejecutar la prueba físicamente.
4. Actualizar el contexto con el resultado.

Reemplazar el ejemplo por la conversación real después de montar el robot.

### Slide 23 — 1:00

> Un síntoma solo produce cambios genéricos. “El robot se reinicia” puede llevar al
> agente a agregar delays o cambiar librerías. Un log de brownout y una caída en
> 3.3 voltios cambian el diagnóstico hacia alimentación.

Ejemplo reproducible:

1. Arrancar motores desde una alimentación inadecuada.
2. Capturar `Brownout detector was triggered`.
3. Pedir al agente una prueba física antes de modificar código.
4. Separar la potencia de motores, compartir GND y medir otra vez.

No afirmar que fue una falla real del proyecto sin conservar el log y la
medición.

### Slide 24 — 0:45

> Antes de energizar revisamos polaridad, voltajes, tierra común, continuidad,
> pines exactos y ruedas elevadas. La lista es corta para que realmente se use.

### Slide 25 — 1:00

> Definimos terminado con cuatro pruebas físicas: medir, avanzar, detenerse a 20
> centímetros y girar. Reemplazaremos esta ilustración por la foto y los
> resultados del montaje real.

### Slide 26 — 0:30

> Vibecoding hardware significa hacer un cambio pequeño, medir el resultado y
> devolver la evidencia al agente. El ciclo se repite para sensor, motores e
> integración.

### Slide 27 — 0:30

> La IA propone. La realidad responde.

> Construye con contexto. Verifica antes de conectar.

## Montaje seguro de la demo

- Robot elevado durante la prueba de motores.
- Divisor de voltaje instalado antes de energizar el HC-SR04.
- Switch de motores accesible.
- Multímetro configurado y probado.
- Puntos VM y GND identificados.
- Ningún conductor suelto.
- Respuesta del agente guardada localmente.
- Video corto de respaldo.

## Plan B

- Sin internet: usar la respuesta guardada.
- Sin cámara: mostrar una foto del multímetro y narrar el valor.
- Si VM no mide 0 V: usar el valor real y explicar cómo cambia la hipótesis.
- Si el robot no gira después de corregir potencia: detener la demo y usar video.
- No improvisar conexiones durante la charla.

## Antes de presentar

1. Montar y medir el robot completo.
2. Confirmar revisiones y datasheets.
3. Reemplazar la ilustración por fotos propias.
4. Sustituir valores ilustrativos por mediciones reales.
5. Confirmar el pin map y el firmware.
6. Ensayar la demo de slides 19–22 en menos de seis minutos.
7. Verificar el QR.
