// reorganizar-projeto.mjs

import { promises as fs } from "fs";
import path from "path";

const DRY_RUN = true;

// Se estiver usando Node < 22, troque isso por:
// import path from "path";
// const __dirname = path.resolve();

const projetoRoot = process.cwd();

// MAPA: de onde -> para onde
const moves = [
  // libs antigas
  {
    from: "libs/docxtemplater.js",
    to:   "src/export/libs/docxtemplater.js",
  },
  {
    from: "libs/pizzip.min.js",
    to:   "src/export/libs/pizzip.min.js",
  },

  // core -> app
  {
    from: "src/core/automations.js",
    to:   "src/app/automations.js",
  },
  {
    from: "src/core/main.js",
    to:   "src/app/main.js",
  },
  {
    from: "relatorio.js",
    to:   "src/app/relatorio.js",
  },
  {
    from: "src/core/utils.js",
    to:   "src/app/utils.js",
  },

  // placeholders e validações
  {
    from: "src/core/placeholders-map.js",
    to:   "src/app/mapping/placeholders-map.js",
  },
  {
    from: "validacao_exemplo.js",
    to:   "src/app/validations/validacao_exemplo.js",
  },

  // Se tiver mais arquivos para mover, adicione aqui
];

async function ensureDirFor(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

async function moveFile(oldRel, newRel) {
  const oldPath = path.join(projetoRoot, oldRel);
  const newPath = path.join(projetoRoot, newRel);

  try {
    await fs.access(oldPath);
  } catch {
    console.warn(`⚠️  Arquivo NÃO encontrado, pulando: ${oldRel}`);
    return;
  }

  if (DRY_RUN) {
    console.log(`[DRY RUN] Simular mover: ${oldRel}  ->  ${newRel}`);
    return;
  }

  await ensureDirFor(newPath);
  await fs.rename(oldPath, newPath);
  console.log(`✅ Movido: ${oldRel}  ->  ${newRel}`);
}

async function main() {
  console.log("🚀 Iniciando reorganização do projeto...\n");

  for (const { from, to } of moves) {
    try {
      await moveFile(from, to);
    } catch (err) {
      console.error(`❌ Erro ao mover ${from} -> ${to}:`, err.message);
    }
  }

  console.log("\n🎉 Fim da reorganização. Confira se tudo está no lugar.");
}

main().catch((err) => {
  console.error("Erro geral no script:", err);
});
