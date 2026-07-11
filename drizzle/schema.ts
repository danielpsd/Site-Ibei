import { int, mysqlEnum, mysqlTable, text, mediumtext, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  /** Hash da senha (scrypt) para login local por email/senha. Nulo para contas OAuth. */
  passwordHash: varchar("passwordHash", { length: 255 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela de Membros
export const members = mysqlTable("members", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  // Dados Pessoais
  birthDate: varchar("birthDate", { length: 10 }), // YYYY-MM-DD
  gender: mysqlEnum("gender", ["masculino", "feminino", "outro"]),
  maritalStatus: mysqlEnum("maritalStatus", ["solteiro", "casado", "divorciado", "viuvo"]),
  marriageDate: varchar("marriageDate", { length: 10 }), // YYYY-MM-DD
  rg: varchar("rg", { length: 20 }),
  cpf: varchar("cpf", { length: 14 }),
  specialNeeds: text("specialNeeds"),
  address: text("address"),
  // Foto de perfil (base64) e comentários administrativos
  photoUrl: mediumtext("photoUrl"),
  notes: text("notes"),
  // Informações Religiosas
  isBaptized: mysqlEnum("isBaptized", ["sim", "nao"]).default("nao"),
  baptismDate: varchar("baptismDate", { length: 10 }), // YYYY-MM-DD
  isPastor: mysqlEnum("isPastor", ["sim", "nao"]).default("nao"),
  isLeader: mysqlEnum("isLeader", ["sim", "nao"]).default("nao"),
  spiritualFeeling: varchar("spiritualFeeling", { length: 255 }),
  // Grupos e Ministérios
  groups: text("groups"), // JSON array de grupos
  trails: text("trails"), // JSON array de trilhas
  // Status
  status: mysqlEnum("status", ["ativo", "inativo", "afastado"]).default("ativo").notNull(),
  joinDate: timestamp("joinDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Member = typeof members.$inferSelect;
export type InsertMember = typeof members.$inferInsert;

// Tabela de Visitantes
export const visitors = mysqlTable("visitors", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address"),
  visitDate: timestamp("visitDate").defaultNow().notNull(),
  interested: mysqlEnum("interested", ["sim", "nao", "talvez"]).default("talvez").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Visitor = typeof visitors.$inferSelect;
export type InsertVisitor = typeof visitors.$inferInsert;

// Tabela de Novos Convertidos
export const converts = mysqlTable("converts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  birthDate: varchar("birthDate", { length: 10 }), // YYYY-MM-DD
  address: text("address"),
  conversionDate: timestamp("conversionDate").defaultNow().notNull(),
  baptismDate: varchar("baptismDate", { length: 10 }), // YYYY-MM-DD
  status: mysqlEnum("status", ["novo", "em_acompanhamento", "batizado", "membro"]).default("novo").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Convert = typeof converts.$inferSelect;
export type InsertConvert = typeof converts.$inferInsert;

// Tabela de Aniversários
export const birthdays = mysqlTable("birthdays", {
  id: int("id").autoincrement().primaryKey(),
  memberId: int("memberId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  birthDate: varchar("birthDate", { length: 10 }).notNull(), // YYYY-MM-DD
  celebrated: mysqlEnum("celebrated", ["sim", "nao"]).default("nao").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Birthday = typeof birthdays.$inferSelect;
export type InsertBirthday = typeof birthdays.$inferInsert;

// Tabela da Galeria de Fotos (público em /galeria)
export const galleryPhotos = mysqlTable("galleryPhotos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  imageUrl: mediumtext("imageUrl").notNull(),
  photoDate: varchar("photoDate", { length: 10 }), // YYYY-MM-DD
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type InsertGalleryPhoto = typeof galleryPhotos.$inferInsert;

// Tabela do Mural Palavra (público em /mural-palavra)
export const muralPosts = mysqlTable("muralPosts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  youtubeUrl: text("youtubeUrl"),
  content: text("content"),
  pdfUrl: text("pdfUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MuralPost = typeof muralPosts.$inferSelect;
export type InsertMuralPost = typeof muralPosts.$inferInsert;

// Conteúdo editável das seções da Home (Quem Somos, Ministérios, Eventos, Blog)
export const siteContent = mysqlTable("siteContent", {
  id: int("id").autoincrement().primaryKey(),
  section: varchar("section", { length: 64 }).notNull().unique(),
  data: mediumtext("data").notNull(), // JSON serializado
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = typeof siteContent.$inferInsert;
