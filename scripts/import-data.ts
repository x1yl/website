import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

// Load environment variables for CSV paths
const CSV_USERS_PATH = process.env.CSV_USERS_PATH ?? "./data/users.csv";

const CSV_EXEC_DETAILS_PATH =
  process.env.CSV_EXEC_DETAILS_PATH ?? "./data/exec_details.csv";

const CSV_EVENTS_PATH = process.env.CSV_EVENTS_PATH ?? "./data/events.csv";

const CSV_EVENT_ATTENDEES_PATH =
  process.env.CSV_EVENT_ATTENDEES_PATH ?? "./data/event_attendees.csv";

const CSV_DELETED_USERS_PATH =
  process.env.CSV_DELETED_USERS_PATH ?? "./data/deleted_users.csv";

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

/**
 * Reads a CSV file and returns its contents as an array of objects, with each object representing a row keyed by column names.
 *
 * @param filePath - The path to the CSV file to read
 * @returns An array of objects representing the parsed CSV rows
 */
function readCSV(filePath: string): any[] {
  const csvData = fs.readFileSync(filePath, "utf-8");
  return parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  });
}

/**
 * Converts a string to a boolean, returning true for "true" (case-insensitive) or "1", and false otherwise.
 *
 * @param value - The string to convert to a boolean
 * @returns The boolean representation of the input string
 */
function parseBoolean(value: string): boolean {
  return value.toLowerCase() === "true" || value === "1";
}

/**
 * Converts a date string to a JavaScript Date object.
 *
 * @param dateString - The string representation of the date to convert
 * @returns The corresponding Date object
 */
function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Parses a string as a floating-point number, returning 0 if parsing fails.
 *
 * @param value - The string to parse as a float
 * @returns The parsed floating-point number, or 0 if the input is not a valid number
 */
function parseFloatSafe(value: string): number {
  return parseFloat(value) || 0;
}

/**
 * Parses a string as an integer, returning 0 if parsing fails.
 *
 * @param value - The string to parse as an integer
 * @returns The parsed integer, or 0 if the input is not a valid number
 */
function parseIntSafe(value: string): number {
  return parseInt(value) || 0;
}

/**
 * Imports user records from a CSV file and upserts them into the database.
 *
 * Reads user data from a predefined CSV file path, parses and converts fields as needed, and performs upsert operations for each user based on their email address. Logs errors for individual records without interrupting the import process.
 */
async function importUsers() {
  console.log("Importing users...");
  const csvPath = CSV_USERS_PATH;

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

/**
 * Imports executive details from a CSV file and upserts them into the database.
 *
 * Reads executive details from a specified CSV file, then inserts or updates records in the database based on email. Fields such as position, description, and optional selfieURL are handled for each record. Logs errors for individual records without interrupting the import process.
 */
async function importExecDetails() {
  console.log("Importing exec details...");
  const csvPath = CSV_EXEC_DETAILS_PATH;

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

/**
 * Imports event records from a CSV file and upserts them into the database.
 *
 * Reads event data from a specified CSV file, parses and converts fields as needed, and performs upsert operations for each event based on its ID. Logs errors for individual records without interrupting the import process.
 */
async function importEvents() {
  console.log("Importing events...");
  const csvPath = CSV_EVENTS_PATH;

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

/**
 * Imports event attendance records from a CSV file and upserts them into the database.
 *
 * Reads event attendee data from a specified CSV file, parses and converts relevant fields, and performs upsert operations based on the composite key of user email and event ID. Logs errors for individual records without interrupting the import process.
 */
async function importEventAttendees() {
  console.log("Importing event attendees...");
  const csvPath = CSV_EVENT_ATTENDEES_PATH;

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
          attendedAt: attendee.attendedAt
            ? parseDate(attendee.attendedAt)
            : null,
        },
        create: {
          userEmail: attendee.userEmail,
          eventId: attendee.eventId,
          earnedPoints: parseFloatSafe(attendee.earnedPoints),
          earnedHours: parseFloatSafe(attendee.earnedHours),
          earnedEntries: parseFloatSafe(attendee.earnedEntries),
          registeredAt: parseDate(attendee.registeredAt),
          attendedAt: attendee.attendedAt
            ? parseDate(attendee.attendedAt)
            : null,
        },
      });
    } catch (error) {
      console.error(
        `Error importing attendee ${attendee.userEmail} for event ${attendee.eventId}:`,
        error,
      );
    }
  }

  console.log(`Imported ${attendees.length} event attendees`);
}

/**
 * Imports deleted user records from a CSV file and upserts them into the database.
 *
 * Reads deleted user data from a specified CSV file, parses date fields, and performs upsert operations for each record based on the user ID.
 */
async function importDeletedUsers() {
  console.log("Importing deleted users...");
  const csvPath = CSV_DELETED_USERS_PATH;

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

/**
 * Orchestrates the sequential import of users, executive details, events, event attendees, and deleted users from CSV files into the database.
 *
 * Ensures that data is imported in an order that respects foreign key constraints. Logs progress and errors, and disconnects the Prisma client upon completion or failure.
 */
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
