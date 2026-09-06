import index from "./index.html";

Bun.serve({
  port: Number(Bun.env.PORT ?? 3000),
  routes: {
    "/": index,
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log(`Deck running at http://localhost:${Bun.env.PORT ?? 3000}`);
