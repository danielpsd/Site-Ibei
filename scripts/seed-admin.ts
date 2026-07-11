/**
 * Cria (ou atualiza) o usuário administrador com login local por email/senha.
 *
 * Uso:
 *   npm run seed:admin -- --email=seu@email.com --password=suaSenha --name="Seu Nome"
 *
 * Lê a DATABASE_URL do arquivo .env (via dotenv/config).
 */
import "dotenv/config";
import { hashPassword } from "../server/_core/password";
import * as db from "../server/db";

function parseArgs() {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};
  for (const arg of args) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) {
      result[match[1]] = match[2];
    }
  }
  return result;
}

async function main() {
  const args = parseArgs();
  const email = args.email;
  const password = args.password;
  const name = args.name || "Administrador";

  if (!email || !password) {
    console.error(
      "Uso: npm run seed:admin -- --email=seu@email.com --password=suaSenha --name=\"Seu Nome\""
    );
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  // openId estável derivado do email, só para satisfazer a coluna existente (login OAuth legado).
  const openId = `local:${email.toLowerCase()}`;

  await db.upsertUser({
    openId,
    name,
    email: email.toLowerCase(),
    loginMethod: "email",
    passwordHash,
    role: "admin",
    lastSignedIn: new Date(),
  });

  console.log(`✅ Usuário admin criado/atualizado: ${email}`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Erro ao criar usuário admin:", error);
  process.exit(1);
});
