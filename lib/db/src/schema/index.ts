import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const familyBranches = pgTable("family_branches", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ancestralLocation: text("ancestral_location"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const people = pgTable("people", {
  id: text("id").primaryKey(),
  nepaliName: text("nepali_name"),
  englishName: text("english_name").notNull(),
  role: text("role").notNull(),
  initials: text("initials").notNull(),
  gender: text("gender"),
  generation: integer("generation").notNull(),
  branchId: text("branch_id").references(() => familyBranches.id),
  deceased: boolean("deceased").default(false).notNull(),
  verificationStatus: text("verification_status").default("VERIFIED").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const personRelationships = pgTable("person_relationships", {
  id: text("id").primaryKey(),
  personAId: text("person_a_id").notNull().references(() => people.id),
  personBId: text("person_b_id").notNull().references(() => people.id),
  type: text("type").notNull(),
  status: text("status").default("VERIFIED").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertBranchSchema = {
  id: undefined as unknown as string,
};

export type FamilyBranch = typeof familyBranches.$inferSelect;
export type Person = typeof people.$inferSelect;
export type PersonRelationship = typeof personRelationships.$inferSelect;