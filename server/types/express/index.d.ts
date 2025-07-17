// server/types/express/index.d.ts
import type { User } from "../../server/mongoStorage"; // Adjust path if needed

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
