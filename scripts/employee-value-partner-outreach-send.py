#!/usr/bin/env python3
"""Send AURIX employee-value partner outreach (Flink, SCHUFA, n8n, AUTO1, Personio).

Requires Hostinger SMTP for contact@aurixapp.de:
  export SMTP_PASS='…'   # mailbox password from hPanel (never commit)
  # optional overrides:
  # SMTP_HOST=smtp.hostinger.com SMTP_PORT=465
  # SMTP_USER=contact@aurixapp.de SMTP_FROM=contact@aurixapp.de

Usage:
  python3 scripts/employee-value-partner-outreach-send.py --dry-run
  python3 scripts/employee-value-partner-outreach-send.py
"""
from __future__ import annotations

import argparse
import json
import os
import smtplib
import ssl
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from email.mime.text import MIMEText
from email.utils import formataddr, make_msgid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOG_PATH = ROOT / "docs" / "aurix-employee-value-partners-send-log.json"
CRM_LOG_PATH = ROOT / "docs" / "aurix-employee-value-partners-crm-log.json"

FROM_ADDR = "contact@aurixapp.de"
FROM_NAME = "Prof. Dr. Ahmed Ebada / AURIX"
PRODUCT_URL = "https://aurixapp.de/for-business/payroll/"

DISCLAIMER = (
    "Disclaimer: AURIX provides tools to help administer this benefit. "
    "We are not your tax advisor. Confirm thresholds and eligibility with your own "
    "Steuerberater before any payroll or tax filing decision. "
    "Benefit must be additional to salary."
)

SHARED_BODY = """We’re exploring early partnerships around AURIX for Payroll: a gold Sachbezug / Sachzuwendung benefit for German and Austrian employers. Employees receive a small, recurring allotment of gold (administered digitally as BPC) that they can see in their wallet — real ownership, a savings habit, and an inflation-aware asset — granted in addition to salary, never as a substitute.

Why employees tend to love it
• Real gold savings they own (not points that expire)
• Clear “my employer invests in my future” signal
• Complements cash compensation instead of competing with it

Why employers consider it
• Targets the well-known ~€50/employee/month non-cash benefit framing (and a separate annual lump-sum regime up to ~€10,000/employee/year at a flat employer-side rate) — always confirm current law with your Steuerberater; this is not tax advice
• Worked framing: €50/month/employee in gold vs. an equivalent net cash raise typically costs more in gross pay + employer social contributions (exact math depends on bracket — your advisor owns that)
• Additionality is a hard product rule (Zusätzlichkeitserfordernis): we will not build salary-reduction controls into the grant flow

Where we are today
Live gold grants are not enabled yet (certification / custody gate). We’re building a waitlist of employers who want to shape a pilot and be first in line when PAYROLL_BENEFIT_LIVE turns on for DE (then AT)."""


RECIPIENTS = [
    {
        "company": "Flink",
        "to": "contact@goflink.com",
        "lead_id": 24208,
        "subject": "Flink × AURIX — employee-value partner (gold Sachbezug pilot waitlist)",
        "greeting": "Hello Flink team — please forward to People / Workplace Experience / Total Rewards,",
        "opening": (
            "Flink’s teams — from hubs to HQ — live in a high-tempo environment where retention "
            "and belonging matter. We’re seeking employers who want to give employees something "
            "they can feel: owned gold savings on top of salary, not another voucher that disappears."
        ),
        "ask": (
            "Would you be open to a short intro with People / Total Rewards — starting with a "
            "DE HQ pilot waitlist — or shall I send a one-pager for your Steuerberater?"
        ),
    },
    {
        "company": "SCHUFA Holding AG",
        "to": "jobs@schufa.de",
        "lead_id": 24209,
        "subject": "Please forward to Total Rewards / Comp & Benefits — AURIX employee benefit partnership (not a job application)",
        "greeting": "Hello SCHUFA People / recruiting team — please forward to Total Rewards / Compensation & Benefits (partnership inquiry, not a job application),",
        "opening": (
            "SCHUFA’s people work at the intersection of trust, data, and financial life in Germany. "
            "We’re looking for employers who want to elevate employee benefits with something equally "
            "tangible and compliance-minded: a tax-advantaged gold Sachbezug — additional to salary — "
            "that employees own in-wallet, with documentation their Steuerberater can review."
        ),
        "ask": (
            "Could you route this to Compensation & Benefits / People for a short intro, "
            "or optional Steuerberater review before any pilot talk?"
        ),
    },
    {
        "company": "n8n",
        "to": "partners@n8n.io",
        "lead_id": 23126,
        "subject": "People / employee benefit — please route — AURIX gold Sachbezug (pilot waitlist)",
        "greeting": "Hello n8n partners team — please route to People Operations / Total Rewards,",
        "opening": (
            "n8n’s team builds tools that give people leverage. We’re seeking companies that want to "
            "give their own people leverage of a different kind: a modern employee benefit — owned gold "
            "savings as a Sachbezug — on top of salary, designed to feel as real as the product they ship."
        ),
        "ask": (
            "Would People Ops / Total Rewards be open to a short intro — pilot waitlist for "
            "DE-based employees first — or shall I send a one-pager?"
        ),
    },
    {
        "company": "AUTO1 Group",
        "to": "info@auto1-group.com",
        "lead_id": 377,
        "subject": "AUTO1 × AURIX — Total Rewards employee-value partner (gold Sachbezug pilot waitlist)",
        "greeting": "Hello AUTO1 Group team — please forward to HR Business Partner / Total Rewards / People Germany,",
        "opening": (
            "AUTO1 Group competes for talent across Berlin HQ and Europe. We’re looking for employers "
            "who want a benefit employees actually talk about: tax-advantaged gold as a Sachbezug — "
            "real ownership in their wallet, additional to salary — as a distinctive line in Total Rewards."
        ),
        "ask": (
            "Would Total Rewards / People Germany be open to a short intro — pilot waitlist for "
            "Germany first — or shall I send a one-pager for your Steuerberater?"
        ),
    },
    {
        "company": "Personio",
        "to": "integration-partner@personio.com",
        "lead_id": 32,
        "subject": "Complementary employee benefit for Personio customers — gold Sachbezug (early partnership)",
        "greeting": "Hello Personio Partner / Integrations team,",
        "opening": None,  # partnership variant
        "ask": None,
        "partnership": True,
    },
]


def body_for(r: dict) -> str:
    if r.get("partnership"):
        return f"""{r['greeting']}

AURIX is looking for partners who want to help employers deliver big value to employees.

We build AURIX for Payroll: a gold Sachbezug benefit for German/Austrian employers — employees receive a small recurring gold allotment (BPC) they own in-wallet, on top of salary. Live grants are gated off until certification; we’re opening a partnership conversation now.

Why this fits Personio’s ecosystem
• Complementary to HR/payroll — not a competing HCM
• Aimed at the same DACH SME customers who already care about benefits, compliance, and employee experience
• Roadmap interest in Steuerberater / payroll-software co-marketing and referral (alongside DATEV, sage)
• Clear compliance posture: additionality required; AURIX is not tax advice

We’re interested in exploring: marketplace listing path, referral/co-marketing, or a lightweight integration story once our employer portal and export rails mature.

Could we book a short partnership intro? Happy to also connect with your People team — Personio as an employer is a natural pilot for the same benefit.

Overview: {PRODUCT_URL}
Partner contact preference: integration-partner@personio.com / https://www.personio.com/partner/

Best regards,
Prof. Dr. Ahmed Ebada
AURIX — Employee-value & platform partnerships
{FROM_ADDR}

{DISCLAIMER}
"""
    return f"""{r['greeting']}

{r['opening']}

{SHARED_BODY}

{r['ask']}

Product overview: {PRODUCT_URL}
Reply: {FROM_ADDR}

Best regards,
Prof. Dr. Ahmed Ebada
AURIX — Employee-value partnerships

{DISCLAIMER}
"""


def send_smtp(to: str, subject: str, body: str) -> dict:
    host = os.environ.get("SMTP_HOST", "smtp.hostinger.com")
    port = int(os.environ.get("SMTP_PORT", "465"))
    user = os.environ.get("SMTP_USER", FROM_ADDR)
    password = os.environ.get("SMTP_PASS") or os.environ.get("SMTP_PASSWORD")
    from_addr = os.environ.get("SMTP_FROM", user)
    from_name = os.environ.get("SMTP_FROM_NAME", FROM_NAME)
    if not password:
        return {"ok": False, "error": "SMTP_PASS not set"}

    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = formataddr((from_name, from_addr))
    msg["To"] = to
    msg["Reply-To"] = FROM_ADDR
    msgid = make_msgid(domain="aurixapp.de")
    msg["Message-ID"] = msgid

    ctx = ssl.create_default_context()
    if port == 465:
        with smtplib.SMTP_SSL(host, port, context=ctx, timeout=60) as s:
            s.login(user, password)
            s.sendmail(from_addr, [to], msg.as_string())
    else:
        with smtplib.SMTP(host, port, timeout=60) as s:
            s.ehlo()
            s.starttls(context=ctx)
            s.ehlo()
            s.login(user, password)
            s.sendmail(from_addr, [to], msg.as_string())
    return {"ok": True, "message_id": msgid, "from": from_addr}


def crm_note(r: dict, mail_ok: bool, message_id: str | None, error: str | None) -> dict:
    key = os.environ.get("MTE_CRM_KEY") or os.environ.get("MIGRATE_DEPLOY_KEY")
    if not key:
        return {"ok": False, "error": "MTE_CRM_KEY not set"}
    base = os.environ.get("MTE_CRM_BASE", "https://munichtechexpo.com/back/admin").rstrip("/")
    now = datetime.now(timezone.utc).isoformat()
    if mail_ok:
        notes = (
            f"[{now}] SENT employee-value partner outreach from {FROM_ADDR} "
            f"to {r['to']} · Message-ID={message_id} · subject={r['subject']}"
        )
        tags = "AURIX,aurix-employee-value-partners,outreach_sent"
    else:
        notes = (
            f"[{now}] FAILED send to {r['to']}: {error} "
            f"(draft: docs/employer-outreach-dach-employee-value-partners.md)"
        )
        tags = "AURIX,aurix-employee-value-partners,send_failed"
    # outreach_leads.status enum rejects values like "contacted"; keep queued and record send in notes/tags
    params = {
        "key": key,
        "company_name": r["company"],
        "contact_email": r["to"],
        "lead_id": r["lead_id"],
        "email_source": "aurix-employee-value-partners",
        "tags": tags,
        "status": "queued",
        "notes": notes,
    }
    url = f"{base}/upsert-outreach-lead?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req, timeout=45) as resp:
        body = resp.read().decode("utf-8", errors="replace")
        data = json.loads(body) if body.strip().startswith("{") else {}
        return {
            "ok": 200 <= resp.status < 300,
            "http_status": resp.status,
            "action": data.get("action") or data.get("result"),
            "lead_id": data.get("lead_id") or r["lead_id"],
        }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--delay", type=float, default=0.8)
    args = ap.parse_args()

    smtp_ready = bool(os.environ.get("SMTP_PASS") or os.environ.get("SMTP_PASSWORD"))
    crm_ready = bool(os.environ.get("MTE_CRM_KEY") or os.environ.get("MIGRATE_DEPLOY_KEY"))
    now = datetime.now(timezone.utc).isoformat()
    log = {
        "attempted_at": now,
        "from": os.environ.get("SMTP_FROM", FROM_ADDR),
        "from_name": os.environ.get("SMTP_FROM_NAME", FROM_NAME),
        "dry_run": args.dry_run,
        "smtp_configured": smtp_ready,
        "crm_configured": crm_ready,
        "status": "dry_run" if args.dry_run else ("ready" if smtp_ready else "blocked"),
        "recipients": [],
        "crm_updates": [],
    }

    for r in RECIPIENTS:
        subject = r["subject"]
        body = body_for(r)
        entry = {
            "at": datetime.now(timezone.utc).isoformat(),
            "company": r["company"],
            "to": r["to"],
            "lead_id": r["lead_id"],
            "subject": subject,
            "mail": False,
            "message_id": None,
        }
        if args.dry_run:
            entry["mail"] = "skipped"
            entry["body_preview"] = body[:280]
        elif not smtp_ready:
            entry["mail_error"] = "SMTP_PASS not set"
        else:
            try:
                result = send_smtp(r["to"], subject, body)
                entry["mail"] = bool(result.get("ok"))
                entry["message_id"] = result.get("message_id")
                if not result.get("ok"):
                    entry["mail_error"] = result.get("error")
                time.sleep(args.delay)
            except Exception as e:
                entry["mail_error"] = str(e)

        log["recipients"].append(entry)

        if not args.dry_run and crm_ready:
            try:
                crm = crm_note(
                    r,
                    bool(entry.get("mail") is True),
                    entry.get("message_id"),
                    entry.get("mail_error"),
                )
                log["crm_updates"].append({"company": r["company"], **crm})
            except Exception as e:
                log["crm_updates"].append({"company": r["company"], "ok": False, "error": str(e)})

        print(
            json.dumps(
                {
                    "company": r["company"],
                    "to": r["to"],
                    "mail": entry.get("mail"),
                    "message_id": entry.get("message_id"),
                    "error": entry.get("mail_error"),
                },
                ensure_ascii=False,
            )
        )

    if not args.dry_run and not smtp_ready:
        log["status"] = "blocked"
        log["blocker"] = "SMTP_PASS not set for contact@aurixapp.de"
    elif not args.dry_run and smtp_ready:
        sent_n = sum(1 for e in log["recipients"] if e.get("mail") is True)
        log["emails_sent"] = sent_n
        log["status"] = "sent" if sent_n == len(RECIPIENTS) else ("partial" if sent_n else "failed")

    LOG_PATH.write_text(json.dumps(log, indent=2, ensure_ascii=False) + "\n")
    print(f"log={LOG_PATH} smtp={smtp_ready} crm={crm_ready}")


if __name__ == "__main__":
    main()
