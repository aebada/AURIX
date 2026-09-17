#!/usr/bin/env python3
"""Partner outreach for gold-service prospects.

Sends partnership invites via Hostinger SMTP when SMTP_* env is set,
upserts MTE CRM when MTE_CRM_KEY is set, and always writes a local log.

Usage:
  python3 scripts/partner-outreach.py [--dry-run]
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import smtplib
import ssl
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from email.mime.text import MIMEText
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "docs" / "gold-service-store-prospects.csv"
LOG_PATH = ROOT / "docs" / "partner-outreach-log.json"

APPLY_URL = "https://aurixapp.de/partner-with-us/"
FROM_DEFAULT = "contact@aurixapp.de"


def load_prospects():
    rows = list(csv.DictReader(CSV_PATH.open(encoding="utf-8")))
    seen = set()
    out = []
    for r in rows:
        email = (r.get("email") or "").strip()
        if not email or "@" not in email:
            continue
        key = email.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(r)
    return out


def body_for(row: dict) -> str:
    name = row.get("name") or "Partner"
    return f"""Hello {name} team,

AURIX is building Gold as a Service — cross-border gold pickup and redemption across Saudi Arabia, Egypt, Kuwait, UAE, and Qatar.

We would like to invite {name} to join as a partner location (prospect outreach — this is not a signed agreement).

Apply here: {APPLY_URL}

Questions: {FROM_DEFAULT}

— AURIX Partnerships
"""


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
    ctx = ssl.create_default_context()
    with smtplib.SMTP_SSL(host, port, context=ctx) as s:
        s.login(user, password)
        s.sendmail(msg["From"], [to], msg.as_string())
    return True


def crm_upsert(row: dict) -> bool:
    base = os.environ.get("MTE_CRM_BASE", "https://munichtechexpo.com/back/admin").rstrip("/")
    key = os.environ.get("MTE_CRM_KEY") or os.environ.get("MIGRATE_DEPLOY_KEY")
    if not key:
        return False
    email = (row.get("email") or "").strip()
    params = {
        "key": key,
        "company_name": row.get("name") or "AURIX prospect",
        "contact_email": email,
        "website": row.get("website") or "https://aurixapp.de",
        "tags": "AURIX,partner_outreach",
        "email_source": "aurix_partner_invite",
        "notes": f"Gold service partner invite · {row.get('country')}/{row.get('city')} · {APPLY_URL}",
    }
    url = f"{base}/upsert-outreach-lead?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return 200 <= resp.status < 300


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    prospects = load_prospects()
    log = []
    for row in prospects:
        email = row["email"].strip()
        entry = {
            "at": datetime.now(timezone.utc).isoformat(),
            "name": row.get("name"),
            "email": email,
            "country": row.get("country"),
            "mail": False,
            "crm": False,
            "dry_run": args.dry_run,
        }
        if args.dry_run:
            entry["mail"] = "skipped"
            entry["crm"] = "skipped"
        else:
            try:
                entry["mail"] = send_smtp(
                    email,
                    "Partner invitation — AURIX Gold as a Service",
                    body_for(row),
                )
            except Exception as e:
                entry["mail_error"] = str(e)
            try:
                entry["crm"] = crm_upsert(row)
            except Exception as e:
                entry["crm_error"] = str(e)
        log.append(entry)
        print(json.dumps(entry))

    LOG_PATH.write_text(json.dumps(log, indent=2), encoding="utf-8")
    print(f"Wrote {LOG_PATH} ({len(log)} unique emails)")


if __name__ == "__main__":
    main()
