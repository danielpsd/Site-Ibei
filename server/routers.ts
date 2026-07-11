import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import * as db from "./db";
import { validateCPF, validateRG, validatePhone, sanitizeString } from "./_core/validators";

// Schemas de validação
const memberSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").transform(sanitizeString),
  email: z.string().email("Email inválido").toLowerCase(),
  phone: z.string().min(10, "Telefone inválido").refine(validatePhone, "Telefone inválido"),
  birthDate: z.string().optional(),
  gender: z.enum(["masculino", "feminino", "outro"]).optional(),
  maritalStatus: z.enum(["solteiro", "casado", "divorciado", "viuvo"]).optional(),
  marriageDate: z.string().optional(),
  rg: z.string().optional().refine((val) => !val || validateRG(val), "RG inválido"),
  cpf: z.string().optional().refine((val) => !val || validateCPF(val), "CPF inválido"),
  specialNeeds: z.string().optional().transform((val) => val ? sanitizeString(val) : val),
  address: z.string().optional().transform((val) => val ? sanitizeString(val) : val),
  isBaptized: z.enum(["sim", "nao"]).optional(),
  baptismDate: z.string().optional(),
  isPastor: z.enum(["sim", "nao"]).optional(),
  isLeader: z.enum(["sim", "nao"]).optional(),
  spiritualFeeling: z.string().optional().transform((val) => val ? sanitizeString(val) : val),
  groups: z.string().optional().transform((val) => val ? sanitizeString(val) : val),
  trails: z.string().optional().transform((val) => val ? sanitizeString(val) : val),
  status: z.enum(["ativo", "inativo", "afastado"]).default("ativo"),
});

const visitorSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").transform(sanitizeString),
  email: z.string().email("Email inválido").toLowerCase(),
  phone: z.string().min(10, "Telefone inválido").refine(validatePhone, "Telefone inválido"),
  address: z.string().optional().transform((val) => val ? sanitizeString(val) : val),
  interested: z.enum(["sim", "nao", "talvez"]).default("talvez"),
  notes: z.string().optional().transform((val) => val ? sanitizeString(val) : val),
});

const convertSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").transform(sanitizeString),
  email: z.string().email("Email inválido").toLowerCase(),
  phone: z.string().min(10, "Telefone inválido").refine(validatePhone, "Telefone inválido"),
  birthDate: z.string().optional(),
  address: z.string().optional().transform((val) => val ? sanitizeString(val) : val),
  baptismDate: z.string().optional(),
  status: z.enum(["novo", "em_acompanhamento", "batizado", "membro"]).default("novo"),
  notes: z.string().optional().transform((val) => val ? sanitizeString(val) : val),
});

const galleryPhotoSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").transform(sanitizeString),
  imageUrl: z.string().min(1, "URL da imagem é obrigatória"),
  photoDate: z.string().optional(),
});

const muralPostSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").transform(sanitizeString),
  youtubeUrl: z.string().optional(),
  content: z.string().optional().transform((val) => val ? sanitizeString(val) : val),
  pdfUrl: z.string().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ===== MEMBERS ROUTER =====
  members: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllMembers();
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getMemberById(input.id);
      }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getMemberById(input.id);
      }),
    
    create: protectedProcedure
      .input(memberSchema)
      .mutation(async ({ input }) => {
        const result = await db.createMember(input);
        await notifyOwner({
          title: "Novo Membro Cadastrado",
          content: `${input.name} foi cadastrado como novo membro. Email: ${input.email}`,
        });
        return result;
      }),
    
    update: protectedProcedure
      .input(z.object({ id: z.number(), data: memberSchema.partial() }))
      .mutation(async ({ input }) => {
        return await db.updateMember(input.id, input.data);
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({ id: z.number(), status: z.enum(["ativo", "inativo", "afastado"]) }))
      .mutation(async ({ input }) => {
        return await db.updateMember(input.id, { status: input.status });
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteMember(input.id);
      }),
  }),

  // ===== VISITORS ROUTER =====
  visitors: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllVisitors();
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getVisitorById(input.id);
      }),
    
    create: protectedProcedure
      .input(visitorSchema)
      .mutation(async ({ input }) => {
        const result = await db.createVisitor(input);
        await notifyOwner({
          title: "Novo Visitante Registrado",
          content: `${input.name} visitou a igreja. Email: ${input.email}`,
        });
        return result;
      }),
    
    update: protectedProcedure
      .input(z.object({ id: z.number(), data: visitorSchema.partial() }))
      .mutation(async ({ input }) => {
        return await db.updateVisitor(input.id, input.data);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteVisitor(input.id);
      }),
  }),

  // ===== CONVERTS ROUTER =====
  converts: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllConverts();
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getConvertById(input.id);
      }),
    
    create: protectedProcedure
      .input(convertSchema)
      .mutation(async ({ input }) => {
        const result = await db.createConvert(input);
        await notifyOwner({
          title: "Novo Convertido Registrado",
          content: `${input.name} foi registrado como novo convertido. Email: ${input.email}`,
        });
        return result;
      }),
    
    update: protectedProcedure
      .input(z.object({ id: z.number(), data: convertSchema.partial() }))
      .mutation(async ({ input }) => {
        return await db.updateConvert(input.id, input.data);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteConvert(input.id);
      }),
  }),

  // ===== BIRTHDAYS ROUTER =====
  birthdays: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllBirthdays();
    }),
  }),

  // ===== GALLERY ROUTER (Galeria de Fotos - página pública) =====
  gallery: router({
    list: publicProcedure.query(async () => {
      return await db.getAllGalleryPhotos();
    }),

    create: adminProcedure
      .input(galleryPhotoSchema)
      .mutation(async ({ input }) => {
        return await db.createGalleryPhoto(input);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteGalleryPhoto(input.id);
      }),
  }),

  // ===== MURAL PALAVRA ROUTER (página pública) =====
  mural: router({
    list: publicProcedure.query(async () => {
      return await db.getAllMuralPosts();
    }),

    create: adminProcedure
      .input(muralPostSchema)
      .mutation(async ({ input }) => {
        return await db.createMuralPost(input);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteMuralPost(input.id);
      }),
  }),

  // ===== USERS ROUTER (Usuários - somente admin) =====
  users: router({
    list: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),
  }),
});

export type AppRouter = typeof appRouter;
