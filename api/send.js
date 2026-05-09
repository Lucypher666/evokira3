export default async function handler(req, res) {
  const { Resend } = require("resend");
  const resend = new Resend("re_CYpi5Eqp_G8u66YajwmcEtFSUsecUK1mu");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, service, budget, timeline, message } = req.body;

  if (!name || !email || !service || !message)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    await resend.emails.send({
      from: "Evokira Inquiry <onboarding@resend.dev>",
      to:   "evokira.services@gmail.com",
      replyTo: email,
      subject: `New inquiry — ${service} from ${name}`,
      html: `
<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#1e3a8a;padding:28px 32px;border-radius:12px 12px 0 0;">
    <h2 style="color:#fff;margin:0;">New Project Inquiry</h2>
    <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px;">via evokira.com</p>
  </div>
  <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;width:110px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${name}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;"><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Service</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;">${service}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;">Budget</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">${budget || "Not specified"}</td></tr>
      <tr><td style="padding:10px 0;color:#6b7280;">Timeline</td><td style="padding:10px 0;">${timeline || "Not specified"}</td></tr>
    </table>
    <div style="margin-top:24px;background:#f9fafb;padding:20px;border-radius:8px;">
      <p style="margin:0 0 8px;font-size:12px;color:#6b7280;text-transform:uppercase;">Project details</p>
      <p style="margin:0;font-size:14px;line-height:1.7;">${message.replace(/\n/g,"<br/>")}</p>
    </div>
    <div style="margin-top:24px;">
      <a href="mailto:${email}" style="background:#1e3a8a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Reply to ${name}</a>
    </div>
  </div>
</div>`,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return res.status(500).json({ error: err.message });
  }
};
