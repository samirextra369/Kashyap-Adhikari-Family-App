import { Router, type IRouter } from "express";
import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  familyBranches,
  people,
  personRelationships,
  type Person,
} from "@workspace/db/schema";
import {
  FindRelationshipResponse,
  GenealogyTree,
  SearchPeopleResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
let seeded = false;

const demoBranches = [
  { id: "pokhara", name: "Pokhara branch", ancestralLocation: "Kaski, Gandaki" },
  { id: "kathmandu", name: "Kathmandu branch", ancestralLocation: "Kathmandu Valley" },
];

const demoPeople = [
  { id: "hari", englishName: "Hari Prasad Adhikari", role: "Great-grandfather", initials: "HP", generation: 1, branchId: "pokhara", deceased: true },
  { id: "maya", englishName: "Maya Adhikari", role: "Great-grandmother", initials: "MA", generation: 1, branchId: "pokhara", deceased: true },
  { id: "ram", englishName: "Ram Adhikari", role: "Grandfather", initials: "RA", generation: 2, branchId: "pokhara", deceased: true },
  { id: "sita", englishName: "Sita Adhikari", role: "Grandmother", initials: "SA", generation: 2, branchId: "pokhara", deceased: false },
  { id: "suman", englishName: "Suman Adhikari", role: "You", initials: "SU", generation: 3, branchId: "pokhara", deceased: false },
  { id: "aashish", englishName: "Aashish Adhikari", role: "Brother", initials: "AA", generation: 3, branchId: "kathmandu", deceased: false },
  { id: "nirmala", englishName: "Nirmala Adhikari", role: "Aunt", initials: "NA", generation: 3, branchId: "pokhara", deceased: false },
];

const demoRelationships = [
  { id: "r-hari-ram", personAId: "hari", personBId: "ram", type: "PARENT_CHILD" },
  { id: "r-maya-ram", personAId: "maya", personBId: "ram", type: "PARENT_CHILD" },
  { id: "r-ram-suman", personAId: "ram", personBId: "suman", type: "PARENT_CHILD" },
  { id: "r-sita-suman", personAId: "sita", personBId: "suman", type: "PARENT_CHILD" },
  { id: "r-ram-nirmala", personAId: "ram", personBId: "nirmala", type: "PARENT_CHILD" },
  { id: "r-sita-nirmala", personAId: "sita", personBId: "nirmala", type: "PARENT_CHILD" },
  { id: "r-suman-aashish", personAId: "suman", personBId: "aashish", type: "SIBLING" },
  { id: "r-ram-sita", personAId: "ram", personBId: "sita", type: "SPOUSE" },
  { id: "r-hari-maya", personAId: "hari", personBId: "maya", type: "SPOUSE" },
];

async function ensureDemoData() {
  if (seeded) return;
  const existing = await db.select({ id: people.id }).from(people).limit(1);
  if (existing.length === 0) {
    await db.insert(familyBranches).values(demoBranches).onConflictDoNothing();
    await db.insert(people).values(demoPeople).onConflictDoNothing();
    await db.insert(personRelationships).values(demoRelationships).onConflictDoNothing();
  }
  seeded = true;
}

function mapPerson(person: Person, branchName: string) {
  return {
    id: person.id,
    nepaliName: person.nepaliName,
    englishName: person.englishName,
    role: person.role,
    initials: person.initials,
    generation: person.generation,
    branch: branchName,
    deceased: person.deceased,
    verificationStatus: person.verificationStatus,
  };
}

router.get("/v1/genealogy/tree", async (req, res, next) => {
  try {
    await ensureDemoData();
    const centerPersonId = String(req.query.centerPersonId ?? "suman");
    const generationLimit = Math.min(Math.max(Number(req.query.generations ?? 3), 1), 5);
    const allPeople = await db.select().from(people);
    const branches = await db.select().from(familyBranches);
    const branchMap = new Map(branches.map((branch) => [branch.id, branch.name]));
    const center = allPeople.find((person) => person.id === centerPersonId) ?? allPeople.find((person) => person.id === "suman");
    if (!center) return res.status(404).json({ message: "Genealogy center person not found." });
    const nearby = allPeople.filter((person) => Math.abs(person.generation - center.generation) <= generationLimit);
    const nearbyIds = new Set(nearby.map((person) => person.id));
    const relationships = await db.select().from(personRelationships);
    return res.json(GenealogyTree.parse({
      centerPersonId: center.id,
      people: nearby.map((person) => mapPerson(person, branchMap.get(person.branchId ?? "") ?? "Unassigned branch")),
      relationships: relationships.filter((relationship) => nearbyIds.has(relationship.personAId) && nearbyIds.has(relationship.personBId)).map((relationship) => ({
        id: relationship.id,
        personAId: relationship.personAId,
        personBId: relationship.personBId,
        type: relationship.type,
      })),
    }));
  } catch (error) {
    next(error);
  }
});

router.get("/v1/people/search", async (req, res, next) => {
  try {
    await ensureDemoData();
    const query = String(req.query.q ?? "").trim();
    if (!query) return res.status(400).json({ message: "Search text is required." });
    const matches = await db.select({
      person: people,
      branch: familyBranches.name,
    }).from(people).leftJoin(familyBranches, eq(people.branchId, familyBranches.id)).where(or(ilike(people.englishName, `%${query}%`), ilike(people.role, `%${query}%`), ilike(familyBranches.name, `%${query}%`))).limit(25);
    return res.json(SearchPeopleResponse.parse(matches.map(({ person, branch }) => mapPerson(person, branch ?? "Unassigned branch"))));
  } catch (error) {
    next(error);
  }
});

router.get("/v1/relationships/find", async (req, res, next) => {
  try {
    await ensureDemoData();
    const fromId = String(req.query.fromPersonId ?? "");
    const toId = String(req.query.toPersonId ?? "");
    const allPeople = await db.select().from(people);
    const peopleMap = new Map(allPeople.map((person) => [person.id, person]));
    const links = await db.select().from(personRelationships).where(and(eq(personRelationships.status, "VERIFIED")));
    const adjacency = new Map<string, Array<{ id: string; label: string }>>();
    for (const link of links) {
      const label = link.type === "SPOUSE" ? "spouse" : "relative";
      adjacency.set(link.personAId, [...(adjacency.get(link.personAId) ?? []), { id: link.personBId, label }]);
      adjacency.set(link.personBId, [...(adjacency.get(link.personBId) ?? []), { id: link.personAId, label }]);
    }
    const queue: Array<{ id: string; path: string[] }> = [{ id: fromId, path: [fromId] }];
    const visited = new Set([fromId]);
    let found: { id: string; path: string[] } | undefined;
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) break;
      if (current.id === toId) { found = current; break; }
      if (current.path.length > 15) continue;
      for (const next of adjacency.get(current.id) ?? []) {
        if (!visited.has(next.id)) {
          visited.add(next.id);
          queue.push({ id: next.id, path: [...current.path, next.id] });
        }
      }
    }
    if (!found || !peopleMap.has(fromId) || !peopleMap.has(toId)) {
      return res.json(FindRelationshipResponse.parse({ connected: false, relationship: "No verified relationship", path: [], hops: 0, message: "No verified genealogy relationship could be determined from the available family records." }));
    }
    const pathNames = found.path.map((id) => peopleMap.get(id)?.englishName ?? id);
    const hops = Math.max(found.path.length - 1, 0);
    const relationship = hops === 0 ? "Self" : hops === 1 ? "Close family" : hops === 2 ? "Grandparent or sibling" : "Extended family";
    return res.json(FindRelationshipResponse.parse({ connected: true, relationship, path: pathNames, hops, message: "Calculated from verified direct relationships." }));
  } catch (error) {
    next(error);
  }
});

export default router;