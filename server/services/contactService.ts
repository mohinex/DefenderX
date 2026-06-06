import { db } from "../repositories/database";

export class ContactService {
  public static saveContactInquiry(name: string, email: string, company: string, message: string) {
    const inquiry = db.addContactInquiry(name, email, company, message);
    return {
      success: true,
      message: "Security consultation request logged. Our perimeter team will establish connection soon.",
      inquiry
    };
  }

  public static getInquiries() {
    return { inquiries: db.getContactInquiries() };
  }
}
