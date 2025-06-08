import { eq } from "drizzle-orm";
import { app, dialog } from "electron";
import * as fs from "fs";
import { unparse, parse } from "papaparse";
import * as path from "path";

import { db } from "../../db";
import { apiUser } from "../../db/schema";
import {
  APIUserZodSchema,
  createAPIUserSchema,
  CreateAPIUserZodSchema
} from "../../shared/schemas";
import { APIResponse, LoginResponse } from "../types/apiTypes";
import { apiLogin } from "../api/auth";

/**
 * fetchAPIUsersService
 * @returns - All apiUsers from the database
 *
 * Fetches all apiUsers from the database
 */
export async function fetchAPIUsersService(): Promise<APIUserZodSchema[]> {
  try {
    const apiUsers: APIUserZodSchema[] = db
      .select()
      .from(apiUser)
      .orderBy(apiUser.apiUserCustomerName)
      .all();
    return apiUsers;
  } catch (error) {
    throw new Error(`Unable to fetch apiUsers`);
  }
}

/**
 * fetchAPIUserByIdService
 * @param id - The Id of the apiUser you want to fetch
 * @returns - The apiUser object retrieved
 *
 * Fetches an apiUser with the given id if it exists
 */
export async function fetchAPIUserByIdService(id: number): Promise<APIUserZodSchema> {
  try {
    const [retrievedUser] = await db.select().from(apiUser).where(eq(apiUser.id, id));
    return retrievedUser;
  } catch (error) {
    throw new Error(`Unable to fetch apiUser with Id: ${id}`);
  }
}

/**
 * createExistingAPIUserService
 * @param newAPIUser - CreateAPIUserZodSchema object with new apiUser's details
 * @returns - The newly created APIUserZodSchema object
 *
 * Creates an existing APIUser in the database
 */
export async function createExistingAPIUserService(
  existingAPIUser: CreateAPIUserZodSchema
): Promise<APIUserZodSchema> {
  try {
    const validatedData = createAPIUserSchema.parse(existingAPIUser);

    // Check if an API User with the given username already exists
    const [result] = await db
      .select()
      .from(apiUser)
      .where(eq(apiUser.apiUserUsername, validatedData.apiUserUsername));

    if (result) {
      throw new Error(
        `An API User with the username: ${validatedData.apiUserUsername} already exists`
      );
    }

    const response = await db.insert(apiUser).values({
      ...validatedData,
      accessToken: validatedData.accessToken ?? null,
      accessTokenCreatedAt: validatedData.accessTokenCreatedAt
        ? validatedData.accessTokenCreatedAt
        : null
    });
    const lastInsertRowId = Number(response.lastInsertRowid);
    const [createdAPIUser] = await db.select().from(apiUser).where(eq(apiUser.id, lastInsertRowId));
    return createdAPIUser;
  } catch (error) {
    throw new Error(`Unable to create API User: ${error}`);
  }
}

/**
 * updateAPIUserService
 * @param id - The Id of the apiUser you want to update
 * @param accessToken - The access token that you want to update
 * @returns - The updated APIUserZodSchema object
 */
export async function updateAPIUserService(
  id: number,
  accessToken: string
): Promise<APIUserZodSchema> {
  try {
    const currentTimestamp = new Date().toISOString();
    const [result] = await db
      .update(apiUser)
      .set({ accessToken: accessToken, accessTokenCreatedAt: currentTimestamp })
      .where(eq(apiUser.id, id))
      .returning();
    return result;
  } catch (error) {
    throw new Error(`Unable to update apiUser with id: ${id}`);
  }
}

/**
 * deleteAPIUserService
 * @param id - The Id of the apiUser you want to delete
 */
export async function deleteAPIUserService(id: number): Promise<void> {
  try {
    await db.delete(apiUser).where(eq(apiUser.id, id));
  } catch (error) {
    throw new Error(`Unable to delete apiUser with id: ${id} - ${error}`);
  }
}

/**
 * isTokenValid
 * @param accessToken
 * @param accessTokenCreatedAt
 * @returns true if the token is still valid, false if it is not
 */
function isTokenValid(
  accessToken: string | null | undefined,
  accessTokenCreatedAt: string | null | undefined
): boolean {
  // Check if token exists
  if (!accessToken || !accessTokenCreatedAt) {
    return false;
  }

  // Check if token is still valid
  const currentDate = new Date();
  const tokenCreatedAtDate = new Date(accessTokenCreatedAt);
  const tokenAgeInSeconds = currentDate.getTime() - tokenCreatedAtDate.getTime();

  if (tokenAgeInSeconds >= 86400) {
    return false;
  }
  return true;
}

/**
 * authenticateAPIUserService
 * @param apiUserDetails the api user that you want to authenticate
 * @returns the api user with the updated access token
 */
export async function authenticateAPIUserService(
  apiUserDetails: APIUserZodSchema
): Promise<APIUserZodSchema> {
  try {
    // Check if their token is valid:
    const { accessToken, accessTokenCreatedAt } = apiUserDetails;
    if (!isTokenValid(accessToken, accessTokenCreatedAt)) {
      // Login and get a new token
      const loginResponse: APIResponse<LoginResponse> = await apiLogin(
        apiUserDetails.apiUserUsername,
        btoa(apiUserDetails.apiUserPassword)
      );

      if (!loginResponse.success) {
        throw new Error(`Authentication has failed:\n${loginResponse}`);
      }
      // Update the apiUsers access token
      const accessToken = loginResponse.results?.AccessToken;
      if (accessToken) {
        apiUserDetails = await updateAPIUserService(apiUserDetails.id, accessToken);
      }
    }
    return apiUserDetails;
  } catch (error) {
    throw new Error(`Error  authenticating the api user:${error}`);
  }
}

/**
 * exportAPIUsersService
 * @param apiUsers List of APIUserZodSchema objects to export
 * @returns true if the export was successful, false otherwise
 */
export async function exportAPIUsersService(apiUsers: APIUserZodSchema[]): Promise<boolean> {
  const includedFields = [
    "apiUserCustomerName",
    "apiUserUsername",
    "apiUserPassword",
    "orgId",
    "apiKey"
  ];

  try {
    // Exlude the accessToken and accessTokenCreatedAt fields
    const filteredData = apiUsers.map((user) => {
      const filtered: Record<string, any> = {};
      for (const field of includedFields) {
        filtered[field] = user[field];
      }
      return filtered;
    });

    // Generate CSV data
    const csvData = unparse(filteredData);

    // Write the CSV data to a file
    const currentDateTime = new Date().toISOString().replace(/[:.]/g, "-");
    const outputPath = path.join(
      app.getPath("downloads"),
      `cm-reminder-export-${currentDateTime}.csv`
    );
    fs.writeFileSync(outputPath, csvData, "utf8");
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * importAPIUsersService
 *
 * @returns A promise that resolves to an object containing the import success status and an optional error message.
 *
 * Opens a dialog to select a CSV file, reads the file, parses the CSV data, validates it against the CreateAPIUserZodSchema,
 * and imports valid API Users into the database. If there are any errors during parsing or validation, it returns an error message.
 */
export async function importAPIUsersService(): Promise<{ importSuccess: boolean; error?: string }> {
  try {
    // Open a dialog to select the CSV file
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [
        { name: "CSV Files", extensions: ["*.csv"] },
        { name: "All Files", extensions: ["*"] }
      ]
    });

    // Check if the user canceled the dialog or selected no files
    if (result.canceled || result.filePaths.length === 0) {
      throw new Error("No file selected for import.");
    }

    // Retrieve the file path
    const filePath = result.filePaths[0];

    // Read in the CSV data
    const csvData = fs.readFileSync(filePath, "utf8");

    // Parse the CSV data
    const { data, errors } = parse<Record<string, string>>(csvData, {
      header: true,
      skipEmptyLines: true
    });

    if (errors.length > 0) {
      console.warn("Errors while parsing CSV:", errors);
    }

    // Validate the data
    const validData: CreateAPIUserZodSchema[] = [];
    const failedRows: { index: number; error: string }[] = [];

    data.forEach((row, idx) => {
      const parsed = createAPIUserSchema.safeParse(row);
      if (parsed.success) {
        validData.push(parsed.data);
      } else {
        failedRows.push({ index: idx + 1, error: parsed.error.message });
      }
    });

    let errorMessage = "The following users could not be importd:";
    let hasErrors = false;

    if (failedRows.length > 0) {
      console.warn(`[!] ${failedRows.length} invalid users found:`);
      hasErrors = true;
      failedRows.forEach((row) => {
        console.warn(`User: ${row.index} - Error: ${row.error}`);
        errorMessage += `\nUser: ${JSON.stringify(row)} - Error: ${row.error}`;
      });
    }

    // Save the valid API Users to the database
    await db.insert(apiUser).values(validData);

    // If the import was successful, but there were errors, return the error message to the frontend
    if (hasErrors) {
      return { importSuccess: false, error: errorMessage };
    } else {
      return { importSuccess: true };
    }
  } catch (error) {
    throw new Error(`Error importing API Users: ${error}`);
  }
}
