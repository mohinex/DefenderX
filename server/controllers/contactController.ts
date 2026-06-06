import { Request, Response } from "express";
import { ContactService } from "../services/contactService";

export class ContactController {
  public static submitInquiry(req: Request, res: Response): void {
    try {
      const { name, email, company, message } = req.body;

      if (typeof name !== "string" || typeof email !== "string" || typeof company !== "string" || typeof message !== "string") {
        res.status(400).json({ error: "PARAMS_INVALID", message: "Inquiry body properties must be primitive strings." });
        return;
      }

      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();
      const cleanCompany = company.trim();
      const cleanMessage = message.trim();

      if (!cleanName || !cleanEmail || !cleanCompany || !cleanMessage) {
        res.status(400).json({ error: "PARAMS_MISSING", message: "All form fields are strictly required." });
        return;
      }

      if (cleanEmail.length > 200 || cleanName.length > 100 || cleanMessage.length > 2000) {
        res.status(400).json({ error: "OVERFLOW_ATTEMPT", message: "Safety bounds checklist matched on consultancy request." });
        return;
      }

      const result = ContactService.saveContactInquiry(cleanName, cleanEmail, cleanCompany, cleanMessage);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Consultation pipeline transient failure." });
    }
  }

  public static getInquiries(req: Request, res: Response): void {
    try {
      const data = ContactService.getInquiries();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Failed to read contact inquiries registry." });
    }
  }
}
