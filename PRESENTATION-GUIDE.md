# Nuestro workflow con IA para construir hardware

Guion de práctica para Shiara y Anthony. F13, domingo 13 de septiembre, 15:45.

## Objetivo de tiempo

- **Contenido hablado y acciones:** aproximadamente 16:30.
- **Colchón dentro de cada punto:** 3:30 en total.
- **Final obligatorio de la presentación:** 20:00.
- **Reserva adicional del slot de 30 minutos:** 10:00 para cambios técnicos, fallos de la demo o preguntas.

No llenar el colchón durante el ensayo. Si todo funciona, terminar antes de 20:00 es correcto.

## Tesis

> La IA puede ampliar lo que somos capaces de construir fuera de nuestra especialidad, pero solo si construimos un loop de verificación a su alrededor.

> La IA nos da hipótesis. La realidad nos da respuestas.

## Roles

- **Shiara, mundo físico:** componentes, montaje, observaciones, mediciones y reparación.
- **Anthony, mundo del modelo:** contexto, prompts, supuestos, hipótesis y actualización del agente.
- Las intervenciones funcionan como ping-pong. No hacer “la mitad de cada uno”.

## Cronograma de 20 minutos

| Punto | Tema | Contenido | Colchón | Máximo | Acumulado |
| --- | --- | ---: | ---: | ---: | ---: |
| 1 | Proyecto terminado | 1:30 | 0:30 | 2:00 | 2:00 |
| 2 | Crash vs. humo | 1:30 | 0:30 | 2:00 | 4:00 |
| 3 | La IA no ve la realidad | 1:45 | 0:30 | 2:15 | 6:15 |
| 4 | El codebase del hardware | 2:00 | 0:30 | 2:30 | 8:45 |
| 5 | Exponer incertidumbre | 2:00 | 0:30 | 2:30 | 11:15 |
| 6 | Debugging y loop | 2:00 | 0:30 | 2:30 | 13:45 |
| 7 | Live Vibe Hardware Time | 3:30 | 0:45 | 4:15 | 18:00 |
| 8 | Tres reglas | 0:45 | 0:15 | 1:00 | 19:00 |
| 9 | Cierre y QR | 0:45 | 0:15 | 1:00 | 20:00 |

Marcas de control:

- Salir del punto 3 antes de **6:15**.
- Empezar la demo antes de **13:45**.
- Recuperar las slides antes de **18:00**.
- Cerrar antes de **20:00**.

## Qué se eliminó

- La slide independiente del error de 5 V: el riesgo ya se explica en los puntos 2 y 3.
- La slide abstracta del loop: el loop ahora aparece dentro del punto 6.
- La slide independiente de medición: la medición ocurre físicamente durante la demo.

Así evitamos explicar dos veces lo que el público puede ver en directo.

## Preparación de la demo

### Mesa

- Proyecto preensamblado, asegurado a una base y probado.
- No construir desde cero ni soldar en directo.
- Fallo seguro y repetible: interruptor USB apagado o alimentación conocida desconectada.
- Multímetro configurado en voltaje DC, con puntas conectadas.
- Punto de prueba de 3.3 V marcado.
- Reparación preparada y marcada discretamente para Shiara.
- Segundo proyecto funcionando como respaldo.
- Ningún conductor suelto que pueda causar un corto.

### Agente

- Contexto y prompt abiertos antes de empezar.
- Respuesta de respaldo guardada localmente.
- No escribir el prompt desde cero; enviarlo ya preparado.
- No cambiar código antes de comprobar la alimentación.

### Cámara

- Conectar el teléfono, GoPro o cámara al MacBook antes de abrir la presentación.
- Abrir la app de cámara en el MacBook y seleccionar esa cámara como fuente.
- Conceder permisos de cámara antes del evento; no provocar un diálogo del sistema durante la charla.
- Colocar la cámara en plano cenital, horizontal y conectada a corriente.
- Bloquear enfoque, exposición y orientación.
- Encuadrar placa, display, multímetro y manos de Shiara.
- Confirmar que el valor del multímetro se lee en el proyector.
- Mantener abiertas y ordenadas las tres ventanas: slides, cámara y agente.
- Ensayar el cambio con `Cmd-Tab` sin mostrar escritorio, notificaciones ni ventanas privadas.
- Desactivar notificaciones y evitar que el MacBook o la cámara entren en reposo.
- Entrada: Anthony dice **“cambiamos a la mesa”** y abre la app de cámara.
- Salida: Anthony dice **“volvemos al mapa”** y vuelve al navegador.

## Guion

### 1. Proyecto terminado, máximo 2:00

**En pantalla:** título.

**Acción:** Shiara muestra o activa el proyecto terminado.

**Shiara:**

> Esto es lo que construimos. Somos personas de software y producto; empezamos sin saber diseñar electrónica y aprendimos construyendo algo físico.

**Anthony:**

> Usamos un agente de IA durante todo el proceso. Lo interesante no fue que pudiera explicarnos electrónica. Fue descubrir cuándo no creerle.

> No vamos a enseñar una colección de prompts. Vamos a enseñar el sistema que usamos para que la IA pueda equivocarse sin romper nada.

**Transición:**

> Porque equivocarse en hardware tiene consecuencias distintas.

### 2. Crash vs. humo, máximo 2:00

**En pantalla:** “En software hace crash. En hardware hace humo.”

**Anthony:**

> En software, una respuesta incorrecta suele producir un error o un test rojo.

Pausa.

> En hardware puede aplicar el voltaje equivocado, superar un límite eléctrico o freír un componente.

**Acción:** Shiara señala un componente frágil.

**Shiara:**

> El componente no sabe que la respuesta sonaba convincente. Solo recibe el voltaje.

**Anthony:**

> Nuestro objetivo no es confiar mejor. Es equivocarnos de forma segura.

### 3. La IA no ve la realidad, máximo 2:15

**En pantalla:** LLM ≠ circuito físico.

**Anthony:**

> El modelo conoce texto sobre placas. No ve la revisión que compramos, cómo está cableada ni qué voltaje existe ahora en este punto.

> Puede confundir GPIO, voltaje, pinout o una API y seguir sonando seguro.

**Shiara:**

> En nuestro proyecto vimos [FALLO REAL 1] y [FALLO REAL 2]. Las respuestas eran plausibles, pero sus supuestos no coincidían con el objeto sobre la mesa.

**Anthony:**

> El problema no es generar. Es grounding: conectar la respuesta con la realidad.

### 4. El codebase del hardware, máximo 2:30

**En pantalla:** datasheets, `constraints.md`, `current-wiring.md`.

**Anthony:**

> A un agente de software le damos el repositorio. El hardware también tiene codebase: datasheets, esquemas, inventario, restricciones y cableado actual.

> En lugar de preguntar “¿cómo conecto esto?”, entregamos las fuentes exactas de esta placa y este componente.

**Shiara:**

> `current-wiring.md` describe el montaje real, no el circuito ideal que creemos haber construido. También registra lógica de 3.3 V, pines ocupados y piezas que no toleran 5 V.

**Anthony:**

> La memoria del modelo deja de ser la autoridad. Las fuentes del proyecto son la autoridad.

### 5. Exponer incertidumbre, máximo 2:30

**En pantalla:** prompt restringido.

**Anthony:**

> Antes de cablear pedimos: verifica voltajes y pines en las fuentes; expón supuestos; marca decisiones peligrosas y cita el datasheet.

> No pedimos solamente una respuesta. Pedimos las condiciones que podrían convertirla en un error.

**Shiara:**

> Si aparece “asumo que este pin tolera 5 V”, detenemos el montaje. Primero verificamos el supuesto; después conectamos el cable.

**Anthony:**

> La confianza lingüística no es evidencia. La evidencia decide.

### 6. Debugging y loop, máximo 2:30

**En pantalla:** “No funciona no basta” y el loop completo.

**Shiara:**

> Terminamos de montar y el display no enciende. La tentación es escribir: “No funciona, arréglalo”.

**Anthony:**

> En cambio pedimos tres hipótesis y un experimento seguro que permita distinguirlas. No queremos diez arreglos al azar; queremos la medición más informativa.

**Acción:** recorrer visualmente la línea del loop.

**Anthony:**

> Síntoma, hipótesis, experimento, medición y actualización. El output del modelo no termina el proceso: propone el siguiente paso.

**Shiara:**

> Cada medición elimina posibilidades y devuelve realidad al contexto.

**Transición de Anthony:**

> En vez de explicarlo otra vez en otra slide, vamos a hacerlo.

### 7. Live Vibe Hardware Time, máximo 4:15

#### Abrir la cámara, 0:30

**En pantalla:** “LIVE VIBE HARDWARE TIME” y “SLIDES → CAMERA APP → HARDWARE TABLE”.

**Anthony:**

> Llegó Live Vibe Hardware Time. Pausamos las slides y cambiamos a la cámara de la mesa.

**Acción de Anthony:** cambiar del navegador a la app de cámara ya abierta. Confirmar visualmente el plano antes de que Shiara empiece.

#### Montaje y síntoma, 0:35

**Shiara:**

> Aquí están el controlador, el [DISPLAY/SENSOR REAL] y el punto donde esperamos 3.3 V. El montaje está listo, pero el display está apagado.

**Acción:** señalar las partes. No mover conexiones.

#### Hipótesis, 0:50

**Anthony:**

> El agente ya tiene los datasheets y el cableado. Le damos el síntoma y pedimos tres hipótesis y la primera prueba segura.

**Acción de Anthony:** cambiar de la cámara al agente y enviar el prompt preparado.

```text
El display no enciende. Genera las tres hipótesis más probables.
No sugieras modificaciones todavía. Propón el primer experimento seguro
que mejor permita distinguirlas e indica el valor esperado.
```

**Anthony:**

> Propone alimentación, cableado o comunicación. Primero mediremos la alimentación.

Si tarda más de diez segundos, mostrar la respuesta guardada inmediatamente.

#### Medición, 0:55

**Acción de Anthony:** volver a la app de cámara antes de que Shiara mida.

**Shiara:**

> El multímetro está en voltaje DC. Esperamos 3.3 V.

**Acción:** medir y mantener el valor visible dos segundos.

**Shiara:**

> Medimos 0.0 V. Esto es un dato del mundo, no una suposición.

**Anthony:**

> No tocamos código. Sin alimentación, cambiar una librería no arregla nada.

#### Actualizar y reparar, 1:05

**Acción de Anthony:** cambiar al agente y enviar:

```text
Esperábamos 3.3 V y medimos 0.0 V en alimentación.
Actualiza las hipótesis y propone la siguiente comprobación segura.
```

**Anthony:**

> Ahora prioriza fuente, interruptor, cable y regulador. Comunicación deja de ser la primera sospecha.

**Shiara:**

> Recorremos esa ruta. Este interruptor está apagado [o esta conexión está suelta]. Lo corregimos y medimos otra vez.

**Acción de Anthony:** volver a la app de cámara.

**Acción de Shiara:** reparar, medir 3.3 V y activar el proyecto.

**Shiara:**

> Ahora tenemos 3.3 V y el display enciende.

#### Volver a las slides, 0:20

**Anthony:**

> La IA propuso. La medición redujo la incertidumbre. La realidad respondió. Volvemos al mapa.

**Acción de Anthony:** cambiar directamente de la app de cámara al navegador y avanzar al punto 8.

## Plan B de la demo

| Problema | Respuesta inmediata |
| --- | --- |
| La app no detecta la cámara | Ejecutar la secuencia visual con `R` y narrar las acciones. |
| `Cmd-Tab` abre otra ventana | Seleccionar la app desde el Dock y continuar; no intentar reordenar ventanas en directo. |
| Falla internet | Mostrar la respuesta guardada y continuar la medición. |
| La medida no es 0.0 V | Leer el valor real: “La realidad invalidó el escenario preparado”. Mostrar el respaldo. |
| No enciende al reparar | Detener cambios, mostrar el proyecto de respaldo y cerrar el loop verbalmente. |
| Quedan menos de 2 minutos | Omitir el agente en vivo y hacer síntoma → medición → reparación. |

Frase de recuperación:

> El plan del modelo no manda. La observación real manda, y actualizamos desde ahí.

### 8. Tres reglas, máximo 1:00

**En pantalla:** Ground, Constrain, Close the loop.

**Shiara:**

> Uno: ground. Entrega especificaciones y estado real.

**Anthony:**

> Dos: constrain. Expón supuestos y riesgos. Tres: close the loop. Mide y devuelve el resultado al contexto.

### 9. Cierre, máximo 1:00

**En pantalla:** frase final y QR.

**Anthony:**

> El objetivo no es hacer que la IA sepa electrónica perfectamente.

**Shiara:**

> Es construir un sistema donde pueda estar equivocada de forma segura.

**Ambos, alternando:**

> La IA nos da hipótesis.

> La realidad nos da respuestas.

**Anthony:**

> El repo, los prompts, el checklist y nuestra comunidad están en el QR. Gracias.

**Acción:** dejar el QR durante las preguntas.

## Ensayos

### Ensayo de contenido

- Sustituir todos los textos entre corchetes.
- Confirmar que los errores presentados como reales sí ocurrieron.
- Hablar durante el tiempo de contenido, no llenar el colchón.

### Ensayo técnico

- Probar conexión de cámara, permisos del MacBook, proyector, agente, multímetro y respaldo.
- Ensayar la secuencia slides → cámara → agente → cámara → agente → cámara → slides.
- Ensayar todos los planes B sin ayuda externa.
- Verificar que la demo completa tarda menos de 3:30 sin colchón.

### Ensayo cronometrado

- Hacer una pasada completa sin detenerse.
- Si la demo empieza después de 13:45, recortar ejemplos, no el loop.
- Si las slides no vuelven a 18:00, hacer las tres reglas verbalmente y cerrar.
- Nunca superar 20:00 intentando recuperar contenido omitido.
