import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    try {
        console.log("Renaming table 'staff' to 'Staff'...");
        await connection.query("RENAME TABLE `staff` TO `Staff`");
        console.log("Renamed 'staff' to 'Staff'.");
    } catch (e) {
        console.log("Error renaming 'staff' (it might not exist or already be renamed):", e.message);
    }

    try {
        console.log("Renaming table 'refresh_tokens' to 'RefreshToken'...");
        await connection.query("RENAME TABLE `refresh_tokens` TO `RefreshToken`");
        console.log("Renamed 'refresh_tokens' to 'RefreshToken'.");
    } catch (e) {
        console.log("Error renaming 'refresh_tokens' (it might not exist or already be renamed):", e.message);
    }

    await connection.end();
}

main();
