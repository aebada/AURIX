#!/usr/bin/env python3
"""Money20/20 ME partner outreach — profile-fitted emails only.

Uses verified public emails from docs/money2020-partner-pipeline.json
(or the with-emails CSV/XLSX). Never invents addresses.

Message body is chosen from Role track + mailbox tone so each email
fits the recipient profile (IR / press / sales / support redirect /
banking / payments / compliance / capital / media).

Usage:
  python3 scripts/money2020-partner-outreach.py --dry-run
  python3 scripts/money2020-partner-outreach.py
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
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PIPELINE = ROOT / "docs" / "money2020-partner-pipeline.json"
LOG_PATH = ROOT / "docs" / "money2020-partner-outreach-log.json"

APPLY_URL = "https://aurixapp.de/partner-with-us/"
BUSINESS_URL = "https://aurixapp.de/business/"
INVESTORS_URL = "https://aurixapp.de/investors/"
DEMO_URL = "https://aurixapp.de/demo/?mode=full"
FROM_DEFAULT = "contact@aurixapp.de"


def load_contacts():
    data = json.loads(PIPELINE.read_text(encoding="utf-8"))
    seen = set()
    out = []
    for c in data["contacts"]:
        email = (c.get("email") or "").strip().lower()
        if not email or "@" not in email or email in seen:
            continue
        seen.add(email)
        out.append(c)
    return out


def greeting(org: str, tone: str) -> str:
    if tone == "press":
        return f"Hello {org} communications team,"
    if tone == "ir":
        return f"Hello {org} Investor Relations,"
    if tone == "sales":
        return f"Hello {org} partnerships / sales team,"
    if tone == "support_redirect":
        return f"Hello {org} team — please forward to partnerships,"
    if tone == "compliance":
        return f"Hello {org} compliance team,"
    return f"Hello {org} team,"


def track_pitch(track: str) -> tuple[str, str, str]:
    """Return (subject_suffix, pitch_paragraph, cta_block)."""
    if track == "capital":
        return (
            "strategic capital conversation",
            "AURIX is an early-stage gold-linked fintech (orchestration layer — we do not custody metal). "
            "We are opening conversations with investors who understand payments, RWA, and MENA corridors.",
            f"IR overview: {INVESTORS_URL}\nPractice product: {DEMO_URL}\nOr reply here.",
        )
    if track == "banking":
        return (
            "banking & rails partnership",
            "We are exploring licensed banking and custody rails for gold-linked wallets, payroll-in-metal, "
            "and cross-border gold pickup — live settlement stays gated until certification.",
            f"Business overview: {BUSINESS_URL}\nPartner apply: {APPLY_URL}",
        )
    if track == "payments":
        return (
            "payments / fintech partnership",
            "AURIX is building practice-today, licensed-later payment surfaces: multi-wallets, merchant flows, "
            "and Gold as a Service corridors across SA / EG / KW / AE / QA.",
            f"Partner apply: {APPLY_URL}\nFull test environment: {DEMO_URL}",
        )
    if track == "compliance":
        return (
            "KYC / AML partner exploration",
            "As we prepare licensed rails, we evaluate KYC/AML and identity partners for onboarding, "
            "monitoring, and corridor compliance — no live claims until certified.",
            f"Partner apply: {APPLY_URL}\nContact: {FROM_DEFAULT}",
        )
    if track == "media":
        return (
            "media / briefing intro",
            "Happy to share an honest briefing on AURIX (practice product live; custody/settlement not enabled yet) "
            "for Money20/20 Middle East audiences.",
            f"Site: https://aurixapp.de/\nPress contact: {FROM_DEFAULT}",
        )
    if track == "sponsor":
        return (
            "ecosystem partnership",
            "Following Money20/20 Middle East, we would like to explore an ecosystem partnership — "
            "distribution, sponsorship adjacency, or product collaboration aligned with your brand.",
            f"Partner apply: {APPLY_URL}\nBusiness: {BUSINESS_URL}",
        )
    # fintech default
    return (
        "fintech partnership",
        "AURIX connects gold-linked value to modern wallets and B2B payroll (metal salary splits). "
        "We invite a conversation about integrating or co-selling in MENA.",
        f"Partner apply: {APPLY_URL}\nDemo: {DEMO_URL}",
    )


def body_for(c: dict) -> tuple[str, str]:
    org = c["organization"]
    track = c.get("track") or "fintech"
    tone = c.get("tone") or "general"
    suffix, pitch, cta = track_pitch(track)
    subject = f"AURIX × {org} — {suffix}"
    # keep subjects shorter for press/IR
    if tone == "press":
        subject = f"AURIX briefing for {org} (Money20/20 ME follow-up)"
    elif tone == "ir":
        subject = f"AURIX — early-stage IR intro for {org}"

    body = f"""{greeting(org, tone)}

I’m reaching out from AURIX (aurixapp.de) after Money20/20 Middle East — your organization appears in the public exhibitor / sponsor / investor directory.

{pitch}

Important honesty note: this is a partnership exploration email only. It is not a signed commercial agreement, and AURIX does not claim live vault custody or settlement today.

{cta}

Best regards,
AURIX Partnerships
{FROM_DEFAULT}
"""
    return subject, body


def send_smtp(to: str, subject: str, body: str) -> bool:
    host = os.environ.get("SMTP_HOST", "smtp.hostinger.com")
    port = int(os.environ.get("SMTP_PORT", "465"))
    user = os.environ.get("SMTP_USER", FROM_DEFAULT)
    password = os.environ.get("SMTP_PASS") or os.environ.get("SMTP_PASSWORD")
    if not password:
        return False
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = os.environ.get("SMTP_FROM", user)
    msg["To"] = to
    msg["Reply-To"] = FROM_DEFAULT
    ctx = ssl.create_default_context()
    with smtplib.SMTP_SSL(host, port, context=ctx) as s:
        s.login(user, password)
        s.sendmail(msg["From"], [to], msg.as_string())
    return True


def crm_upsert(c: dict) -> bool:
    base = os.environ.get("MTE_CRM_BASE", "https://munichtechexpo.com/back/admin").rstrip("/")
    key = os.environ.get("MTE_CRM_KEY") or os.environ.get("MIGRATE_DEPLOY_KEY")
    if not key:
        return False
    tags = f"AURIX,money2020,partner_{c.get('track')},{c.get('tone')}"
    params = {
        "key": key,
        "company_name": c.get("organization") or "AURIX prospect",
        "contact_email": c.get("email"),
        "website": c.get("website") or "https://aurixapp.de",
        "tags": tags,
        "email_source": "aurix_money2020_partner",
        "segment": "corporate",
        "categories": c.get("track") or "fintech",
        "status": "queued",
        "notes": (
            f"Money20/20 ME partner outreach · roles={c.get('roles')} · "
            f"track={c.get('track')} · tone={c.get('tone')} · {APPLY_URL}"
        ),
    }
    url = f"{base}/upsert-outreach-lead?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return 200 <= resp.status < 300


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--limit", type=int, default=0, help="Send only first N (0=all)")
    ap.add_argument("--delay", type=float, default=0.4, help="Seconds between sends")
    args = ap.parse_args()

    contacts = load_contacts()
    if args.limit > 0:
        contacts = contacts[: args.limit]

    log = []
    smtp_ready = bool(os.environ.get("SMTP_PASS") or os.environ.get("SMTP_PASSWORD"))
    crm_ready = bool(os.environ.get("MTE_CRM_KEY") or os.environ.get("MIGRATE_DEPLOY_KEY"))

    for c in contacts:
        subject, body = body_for(c)
        entry = {
            "at": datetime.now(timezone.utc).isoformat(),
            "organization": c["organization"],
            "email": c["email"],
            "roles": c["roles"],
            "track": c["track"],
            "tone": c["tone"],
            "subject": subject,
            "mail": False,
            "crm": False,
            "dry_run": args.dry_run,
            "smtp_configured": smtp_ready,
            "crm_configured": crm_ready,
        }
        if args.dry_run:
            entry["mail"] = "skipped"
            entry["crm"] = "skipped"
            entry["body_preview"] = body[:280]
        else:
            try:
                if smtp_ready:
                    entry["mail"] = send_smtp(c["email"], subject, body)
                    time.sleep(args.delay)
                else:
                    entry["mail"] = False
                    entry["mail_error"] = "SMTP_PASS not set"
            except Exception as e:
                entry["mail_error"] = str(e)
            try:
                if crm_ready:
                    entry["crm"] = crm_upsert(c)
                else:
                    entry["crm"] = False
                    entry["crm_error"] = "MTE_CRM_KEY not set"
            except Exception as e:
                entry["crm_error"] = str(e)
        log.append(entry)
        print(json.dumps({k: entry[k] for k in ("organization", "email", "track", "tone", "mail", "crm", "subject")}, ensure_ascii=False))

    LOG_PATH.write_text(json.dumps(log, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    mailed = sum(1 for e in log if e.get("mail") is True)
    crmed = sum(1 for e in log if e.get("crm") is True)
    print(
        f"Wrote {LOG_PATH} · {len(log)} contacts · mailed={mailed} crm={crmed} "
        f"smtp={smtp_ready} crm_key={crm_ready}"
    )


if __name__ == "__main__":
    main()
