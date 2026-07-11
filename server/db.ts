import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, members, visitors, converts, birthdays, galleryPhotos, muralPosts, InsertMember, InsertVisitor, InsertConvert, InsertBirthday, InsertGalleryPhoto, InsertMuralPost } from "../drizzle/schema";
import { desc } from "drizzle-orm";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== MEMBERS QUERIES =====
export async function getAllMembers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(members).orderBy(members.createdAt);
}

export async function getMemberById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createMember(data: InsertMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(members).values(data);
  // Return the created member data
  return data as any;
}

export async function updateMember(id: number, data: Partial<InsertMember>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(members).set(data).where(eq(members.id, id));
}

export async function deleteMember(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(members).where(eq(members.id, id));
}

// ===== VISITORS QUERIES =====
export async function getAllVisitors() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(visitors).orderBy(visitors.createdAt);
}

export async function getVisitorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(visitors).where(eq(visitors.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createVisitor(data: InsertVisitor) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(visitors).values(data);
  // Return the created visitor data
  return data as any;
}

export async function updateVisitor(id: number, data: Partial<InsertVisitor>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(visitors).set(data).where(eq(visitors.id, id));
}

export async function deleteVisitor(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(visitors).where(eq(visitors.id, id));
}

// ===== CONVERTS QUERIES =====
export async function getAllConverts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(converts).orderBy(converts.createdAt);
}

export async function getConvertById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(converts).where(eq(converts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createConvert(data: InsertConvert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(converts).values(data);
  // Return the created convert data
  return data as any;
}

export async function updateConvert(id: number, data: Partial<InsertConvert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(converts).set(data).where(eq(converts.id, id));
}

export async function deleteConvert(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(converts).where(eq(converts.id, id));
}

// ===== BIRTHDAYS QUERIES =====
export async function getAllBirthdays() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(birthdays).orderBy(birthdays.birthDate);
}

export async function createBirthday(data: InsertBirthday) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(birthdays).values(data);
}

export async function getAllGalleryPhotos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(galleryPhotos).orderBy(desc(galleryPhotos.createdAt));
}

export async function createGalleryPhoto(data: InsertGalleryPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(galleryPhotos).values(data);
  return data as any;
}

export async function deleteGalleryPhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));
}

export async function getAllMuralPosts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(muralPosts).orderBy(desc(muralPosts.createdAt));
}

export async function createMuralPost(data: InsertMuralPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(muralPosts).values(data);
  return data as any;
}

export async function deleteMuralPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(muralPosts).where(eq(muralPosts.id, id));
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).orderBy(desc(users.createdAt));
}
