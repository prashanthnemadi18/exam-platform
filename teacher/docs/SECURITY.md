# Security Guide

## ⚠️ CRITICAL: API Key Security

### 🔴 NEVER DO THIS:

```env
# ❌ BAD: Real API key in .env.example
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here

# ❌ BAD: Real API key in code
const apiKey = "PASTE_YOUR_REAL_KEY_IN_.env.local";

# ❌ BAD: Real API key in documentation
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
```

### ✅ ALWAYS DO THIS:

```env
# ✅ GOOD: Placeholder in .env.example
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here

# ✅ GOOD: Environment variable in code
const apiKey = process.env.GOOGLE_GENAI_API_KEY;

# ✅ GOOD: Real key ONLY in .env.local (which is in .gitignore)
# Store the real key in `.env.local` and never commit it to the repo
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
```

---

## Security Checklist

### Before Committing Code

- [ ] Check `.env.local` is in `.gitignore`
- [ ] Verify no real API keys in `.env.example`
- [ ] Confirm no hardcoded API keys in code
- [ ] Check no API keys in documentation
- [ ] Run `git status` to verify `.env.local` is not tracked
- [ ] Search codebase for potential exposed keys

### Verification Commands

```bash
# Check if .env.local is ignored
git status

# Search for potential API keys in tracked files
git grep -i "AIzaSy"
git grep -i "sk-proj"
git grep -i "sk-ant"

# Check .gitignore
cat .gitignore | grep env
```

---

## File Security Matrix

| File | Contains Real Keys? | In Git? | Purpose |
|------|-------------------|---------|---------|
| `.env.example` | ❌ NO (placeholders only) | ✅ YES | Template for developers |
| `.env.local` | ✅ YES (your real keys) | ❌ NO (in .gitignore) | Local development |
| `.env` | ✅ YES (if used) | ❌ NO (in .gitignore) | Alternative local file |
| `docs/*.md` | ❌ NO (placeholders only) | ✅ YES | Documentation |
| `src/**/*.ts` | ❌ NO (use env vars) | ✅ YES | Source code |

---

## What to Do If You Exposed an API Key

### Immediate Actions (Within 5 minutes)

1. **Revoke the exposed key immediately**
   - Google AI: https://aistudio.google.com/app/apikey
   - OpenAI: https://platform.openai.com/api-keys
   - Anthropic: https://console.anthropic.com/settings/keys

2. **Generate a new key**
   - Create replacement key
   - Update `.env.local` with new key
   - Test that application still works

3. **Remove from Git history** (if committed)
   ```bash
   # Remove file from Git history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (WARNING: Destructive)
   git push origin --force --all
   ```

4. **Notify team members**
   - Alert team about the exposure
   - Ensure everyone updates their keys
   - Review security practices

### Long-term Actions

1. **Audit all repositories**
   - Check for other exposed keys
   - Review commit history
   - Scan with tools like GitGuardian

2. **Implement prevention**
   - Use pre-commit hooks
   - Enable secret scanning (GitHub)
   - Use environment variable management tools

3. **Monitor usage**
   - Check API usage dashboards
   - Look for unusual activity
   - Set up billing alerts

---

## Secure Configuration

### Development Environment

**File: `.env.local` (NOT in Git)**

```env
# Real keys - NEVER commit this file
GOOGLE_GENAI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_GOOGLE_GENAI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

**File: `.env.example` (IN Git)**

```env
# Placeholders only - safe to commit
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
NEXT_PUBLIC_GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
```

### Production Environment

**Vercel:**
```bash
# Add via dashboard or CLI
vercel env add GOOGLE_GENAI_API_KEY production
vercel env add MONGODB_URI production
```

**Other Platforms:**
- Use platform-specific environment variable settings
- Never store in code or config files
- Use secrets management services

---

## Code Security Best Practices

### 1. Always Use Environment Variables

```typescript
// ✅ GOOD
const apiKey = process.env.GOOGLE_GENAI_API_KEY;

// ❌ BAD
const apiKey = "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
```

### 2. Validate Environment Variables

```typescript
// Check if API key exists
if (!process.env.GOOGLE_GENAI_API_KEY) {
  throw new Error('GOOGLE_GENAI_API_KEY is not configured');
}
```

### 3. Never Log API Keys

```typescript
// ✅ GOOD
console.log('API Key:', process.env.GOOGLE_GENAI_API_KEY ? 'Found' : 'Not Found');

// ❌ BAD
console.log('API Key:', process.env.GOOGLE_GENAI_API_KEY);
```

### 4. Use Server-Side Only When Possible

```typescript
// ✅ GOOD: Server-side only
const apiKey = process.env.GOOGLE_GENAI_API_KEY;

// ⚠️ CAUTION: Client-side accessible
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY;
```

---

## Git Security

### .gitignore Configuration

```gitignore
# Environment variables
.env
.env.local
.env.*.local
.env.production
.env.development

# API keys
*.key
*.pem
secrets.json

# Backup files that might contain keys
*.backup
*.bak
```

### Pre-commit Hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash

# Check for potential API keys
if git diff --cached | grep -E "AIzaSy|sk-proj|sk-ant"; then
  echo "❌ ERROR: Potential API key detected!"
  echo "Please remove API keys before committing."
  exit 1
fi

echo "✅ No API keys detected"
exit 0
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## Monitoring & Alerts

### 1. API Usage Monitoring

**Google AI:**
- Visit: https://console.cloud.google.com/
- Check quota usage
- Set up billing alerts

**OpenAI:**
- Visit: https://platform.openai.com/usage
- Monitor spending
- Set usage limits

**Anthropic:**
- Visit: https://console.anthropic.com/
- Check credit usage
- Monitor API calls

### 2. Set Up Alerts

**Billing Alerts:**
- Set threshold at 80% of budget
- Email notifications
- Slack/Discord webhooks

**Unusual Activity:**
- Sudden spike in requests
- Requests from unknown IPs
- Failed authentication attempts

---

## Security Tools

### 1. Secret Scanning

**GitHub Secret Scanning:**
- Automatically enabled for public repos
- Detects common API key patterns
- Sends alerts for exposed secrets

**GitGuardian:**
- Scans commits for secrets
- Real-time alerts
- Historical scanning

### 2. Environment Variable Management

**Doppler:**
- Centralized secret management
- Team collaboration
- Automatic syncing

**AWS Secrets Manager:**
- Enterprise-grade security
- Automatic rotation
- Audit logging

---

## Team Security Practices

### 1. Onboarding New Developers

```bash
# 1. Clone repository
git clone <repo-url>

# 2. Copy environment template
cp .env.example .env.local

# 3. Get API keys from team lead (via secure channel)
# 4. Add keys to .env.local
# 5. NEVER commit .env.local
```

### 2. Secure Key Sharing

**✅ GOOD Methods:**
- Password manager (1Password, LastPass)
- Encrypted messaging (Signal)
- Secure note sharing (Bitwarden Send)
- In-person transfer

**❌ BAD Methods:**
- Email
- Slack/Discord
- SMS
- Shared documents
- Screenshots

### 3. Key Rotation Policy

- Rotate keys every 90 days
- Rotate immediately if:
  - Team member leaves
  - Key potentially exposed
  - Security breach suspected
  - Best practice review

---

## Compliance & Regulations

### Data Protection

- **GDPR** - Protect user data
- **CCPA** - California privacy law
- **FERPA** - Student data protection (if applicable)

### Best Practices

1. **Encrypt data at rest**
2. **Use HTTPS for all communications**
3. **Implement access controls**
4. **Regular security audits**
5. **Incident response plan**

---

## Emergency Contacts

### If Security Breach Occurs

1. **Revoke all API keys immediately**
2. **Notify team lead/admin**
3. **Document the incident**
4. **Review and update security practices**
5. **Notify affected users (if applicable)**

### Support Contacts

- **Google AI:** https://support.google.com/
- **OpenAI:** https://help.openai.com/
- **Anthropic:** https://support.anthropic.com/
- **MongoDB:** https://support.mongodb.com/

---

## Security Audit Checklist

### Monthly Review

- [ ] Review API key usage
- [ ] Check for unusual activity
- [ ] Verify .gitignore is working
- [ ] Scan codebase for exposed secrets
- [ ] Update dependencies
- [ ] Review access logs
- [ ] Test backup/recovery procedures

### Quarterly Review

- [ ] Rotate API keys
- [ ] Security training for team
- [ ] Review and update security policies
- [ ] Penetration testing (if applicable)
- [ ] Compliance audit
- [ ] Update documentation

---

## Conclusion

**Remember:**
- 🔴 API keys are like passwords - NEVER share publicly
- 🔴 Always use `.env.local` for real keys
- 🔴 Keep `.env.example` with placeholders only
- 🔴 Check `.gitignore` before committing
- 🔴 Revoke immediately if exposed

**Security is everyone's responsibility!**

---

**Last Updated:** November 29, 2024  
**Version:** 1.0  
**Security Level:** CRITICAL
