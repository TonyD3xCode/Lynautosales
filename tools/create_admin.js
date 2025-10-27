import pool from "../config/db.js";
import bcrypt from "bcrypt";

(async () => {
  try {
    const email = "admin@lyn.com";
    const password = "SpraYL@2024"; // tu contraseña
    const role = "admin";

    // ✅ Comprobamos si ya existe
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length) {
      console.log("✅ Admin ya existe, no se crea de nuevo.");
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)", [email, hash, role]);
    console.log("✅ Admin creado correctamente.");
    process.exit(0);

  } catch (err) {
    console.error("Error creando admin:", err);
    process.exit(1);
  }
})();
