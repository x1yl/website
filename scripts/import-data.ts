import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

const prisma = new PrismaClient();

interface UserCSV {
  email: string;
  name: string;
  preferredName: string;
  prefect: string;
  pronouns: string;
  gradYear: string;
  position: string;
  registeredAt: string;
  birthday: string;
  referredBy?: string;
  sgoSticker: string;
  givenCredits: string;
  miscPoints: string;
  didOsis: string;
  discordID?: string;
  instagram?: string;
  phone?: string;
  eventAlerts: string;
  lastUpdated: string;
}

interface ExecDetailsCSV {
  position: string;
  description: string;
  selfieURL?: string;
  email: string;
}

interface EventCSV {
  id: string;
  name: string;
  description: string;
  maxPoints: string;
  eventTime: string;
  createdAt: string;
  imageURL?: string;
  maxHours: string;
  address: string;
  limit?: string;
  finishTime: string;
  messageID: string;
  serviceLetters?: string;
  closed: string;
  registerBefore: string;
}

interface EventAttendeeCSV {
  eventId: string;
  earnedPoints: string;
  registeredAt: string;
  userEmail: string;
  earnedHours: string;
  attendedAt?: string;
  earnedEntries: string;
}

interface DeletedUsersCSV {
  id: string;
  registeredAt: string;
  leftAt: string;
}

function readCSV(filePath: string): any[] {
  const csvData = fs.readFileSync(filePath, 'utf-8');
  return parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  });
}

function parseBoolean(value: string): boolean {
  return value.toLowerCase() === 'true' || value === '1';
}

function parseDate(dateString: string): Date {
  return new Date(dateString);
}

function parseFloatSafe(value: string): number {
  return parseFloat(value) || 0;
}

function parseIntSafe(value: string): number {
  return parseInt(value) || 0;
}

async function importUsers() {
  console.log("Importing users...");
  const csvPath = "/home/kevin/_User__202507231626.csv";
  
  if (!fs.existsSync(csvPath)) {
    console.log(`User CSV file not found at ${csvPath}`);
    return;
  }

  const users: UserCSV[] = readCSV(csvPath);
  
  for (const user of users) {
    try {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          preferredName: user.preferredName,
          prefect: user.prefect,
          pronouns: user.pronouns,
          gradYear: parseIntSafe(user.gradYear),
          position: user.position as any,
          registeredAt: parseDate(user.registeredAt),
          birthday: user.birthday,
          referredBy: user.referredBy || null,
          sgoSticker: parseBoolean(user.sgoSticker),
          givenCredits: parseIntSafe(user.givenCredits),
          miscPoints: parseFloatSafe(user.miscPoints),
          didOsis: parseBoolean(user.didOsis),
          discordID: user.discordID || null,
          instagram: user.instagram || null,
          phone: user.phone || null,
          eventAlerts: parseBoolean(user.eventAlerts),
          lastUpdated: parseDate(user.lastUpdated),
        },
        create: {
          email: user.email,
          name: user.name,
          preferredName: user.preferredName,
          prefect: user.prefect,
          pronouns: user.pronouns,
          gradYear: parseIntSafe(user.gradYear),
          position: user.position as any,
          registeredAt: parseDate(user.registeredAt),
          birthday: user.birthday,
          referredBy: user.referredBy || null,
          sgoSticker: parseBoolean(user.sgoSticker),
          givenCredits: parseIntSafe(user.givenCredits),
          miscPoints: parseFloatSafe(user.miscPoints),
          didOsis: parseBoolean(user.didOsis),
          discordID: user.discordID || null,
          instagram: user.instagram || null,
          phone: user.phone || null,
          eventAlerts: parseBoolean(user.eventAlerts),
          lastUpdated: parseDate(user.lastUpdated),
        },
      });
    } catch (error) {
      console.error(`Error importing user ${user.email}:`, error);
    }
  }
  
  console.log(`Imported ${users.length} users`);
}

async function importExecDetails() {
  console.log("Importing exec details...");
  const csvPath = "/home/kevin/ExecDetails_202507231626.csv";
  
  if (!fs.existsSync(csvPath)) {
    console.log(`ExecDetails CSV file not found at ${csvPath}`);
    return;
  }

  const execDetails: ExecDetailsCSV[] = readCSV(csvPath);
  
  for (const exec of execDetails) {
    try {
      await prisma.execDetails.upsert({
        where: { email: exec.email },
        update: {
          position: exec.position as any,
          description: exec.description,
          selfieURL: exec.selfieURL || null,
        },
        create: {
          email: exec.email,
          position: exec.position as any,
          description: exec.description,
          selfieURL: exec.selfieURL || null,
        },
      });
    } catch (error) {
      console.error(`Error importing exec details for ${exec.email}:`, error);
    }
  }
  
  console.log(`Imported ${execDetails.length} exec details`);
}

async function importEvents() {
  console.log("Importing events...");
  const csvPath = "/home/kevin/Event_202507231625.csv";
  
  if (!fs.existsSync(csvPath)) {
    console.log(`Event CSV file not found at ${csvPath}`);
    return;
  }

  const events: EventCSV[] = readCSV(csvPath);
  
  for (const event of events) {
    try {
      await prisma.event.upsert({
        where: { id: event.id },
        update: {
          name: event.name,
          description: event.description,
          maxPoints: parseFloatSafe(event.maxPoints),
          maxHours: parseFloatSafe(event.maxHours),
          eventTime: parseDate(event.eventTime),
          finishTime: parseDate(event.finishTime),
          registerBefore: parseBoolean(event.registerBefore),
          closed: parseBoolean(event.closed),
          limit: event.limit ? parseIntSafe(event.limit) : null,
          imageURL: event.imageURL || null,
          serviceLetters: event.serviceLetters || null,
          messageID: event.messageID,
          address: event.address,
          createdAt: parseDate(event.createdAt),
        },
        create: {
          id: event.id,
          name: event.name,
          description: event.description,
          maxPoints: parseFloatSafe(event.maxPoints),
          maxHours: parseFloatSafe(event.maxHours),
          eventTime: parseDate(event.eventTime),
          finishTime: parseDate(event.finishTime),
          registerBefore: parseBoolean(event.registerBefore),
          closed: parseBoolean(event.closed),
          limit: event.limit ? parseIntSafe(event.limit) : null,
          imageURL: event.imageURL || null,
          serviceLetters: event.serviceLetters || null,
          messageID: event.messageID,
          address: event.address,
          createdAt: parseDate(event.createdAt),
        },
      });
    } catch (error) {
      console.error(`Error importing event ${event.id}:`, error);
    }
  }
  
  console.log(`Imported ${events.length} events`);
}

async function importEventAttendees() {
  console.log("Importing event attendees...");
  const csvPath = "/home/kevin/EventAttendee_202507231625.csv";
  
  if (!fs.existsSync(csvPath)) {
    console.log(`EventAttendee CSV file not found at ${csvPath}`);
    return;
  }

  const attendees: EventAttendeeCSV[] = readCSV(csvPath);
  
  for (const attendee of attendees) {
    try {
      await prisma.eventAttendance.upsert({
        where: {
          userEmail_eventId: {
            userEmail: attendee.userEmail,
            eventId: attendee.eventId,
          },
        },
        update: {
          earnedPoints: parseFloatSafe(attendee.earnedPoints),
          earnedHours: parseFloatSafe(attendee.earnedHours),
          earnedEntries: parseFloatSafe(attendee.earnedEntries),
          registeredAt: parseDate(attendee.registeredAt),
          attendedAt: attendee.attendedAt ? parseDate(attendee.attendedAt) : null,
        },
        create: {
          userEmail: attendee.userEmail,
          eventId: attendee.eventId,
          earnedPoints: parseFloatSafe(attendee.earnedPoints),
          earnedHours: parseFloatSafe(attendee.earnedHours),
          earnedEntries: parseFloatSafe(attendee.earnedEntries),
          registeredAt: parseDate(attendee.registeredAt),
          attendedAt: attendee.attendedAt ? parseDate(attendee.attendedAt) : null,
        },
      });
    } catch (error) {
      console.error(`Error importing attendee ${attendee.userEmail} for event ${attendee.eventId}:`, error);
    }
  }
  
  console.log(`Imported ${attendees.length} event attendees`);
}

async function importDeletedUsers() {
  console.log("Importing deleted users...");
  const csvPath = "/home/kevin/DeletedUsers_202507231625.csv";
  
  if (!fs.existsSync(csvPath)) {
    console.log(`DeletedUsers CSV file not found at ${csvPath}`);
    return;
  }

  const deletedUsers: DeletedUsersCSV[] = readCSV(csvPath);
  
  for (const deletedUser of deletedUsers) {
    try {
      await prisma.deletedUsers.upsert({
        where: { id: deletedUser.id },
        update: {
          registeredAt: parseDate(deletedUser.registeredAt),
          leftAt: parseDate(deletedUser.leftAt),
        },
        create: {
          id: deletedUser.id,
          registeredAt: parseDate(deletedUser.registeredAt),
          leftAt: parseDate(deletedUser.leftAt),
        },
      });
    } catch (error) {
      console.error(`Error importing deleted user ${deletedUser.id}:`, error);
    }
  }
  
  console.log(`Imported ${deletedUsers.length} deleted users`);
}

async function main() {
  try {
    console.log("Starting data import...");
    
    // Import in order due to foreign key constraints
    await importUsers();
    await importExecDetails();
    await importEvents();
    await importEventAttendees();
    await importDeletedUsers();
    
    console.log("Data import completed successfully!");
  } catch (error) {
    console.error("Error during import:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
