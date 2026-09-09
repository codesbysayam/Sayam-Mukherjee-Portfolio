# GitHub Profile README Automatic Sync — Setup Guide

This guide explains how to configure the automatic synchronization workflow between this portfolio repository (`codesbysayam/Sayam-Mukherjee-Portfolio`) and your public GitHub profile repository (`codesbysayam/codesbysayam`).

---

## 🎯 How It Works

```
Portfolio Repository (codesbysayam/Sayam-Mukherjee-Portfolio)
    │
    └── github-profile/README.md  (Single Source of Truth)
            │
            ▼ (git push to main)
    GitHub Actions (.github/workflows/sync-profile-readme.yml)
            │
            ▼ (authenticated via PROFILE_REPO_TOKEN secret)
Profile Repository (codesbysayam/codesbysayam)
    │
    └── README.md  (Rendered on github.com/codesbysayam)
```

Whenever you update `github-profile/README.md` and push to the `main` branch of this portfolio repository, GitHub Actions automatically pushes the updated README into your public profile repository `codesbysayam/codesbysayam`.

---

## 🔑 Step 1: Create a Fine-Grained Personal Access Token (PAT)

Because GitHub's default `GITHUB_TOKEN` is strictly scoped only to the current repository, cross-repository pushes to `codesbysayam/codesbysayam` require a fine-grained token with scoped access.

1. In your browser, log in to GitHub and navigate to:  
   **GitHub Account Settings → Developer Settings → Personal access tokens → Fine-grained tokens**  
   Direct link: [https://github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta)
2. Click **Generate new token**.
3. Configure the token details:
   - **Token name:** `Sync Profile README`
   - **Expiration:** Select your preferred duration (e.g., 90 days, 1 year, or custom).
   - **Resource owner:** `codesbysayam`
4. **Repository access:**
   - Select **Only select repositories**.
   - Choose exclusively: **`codesbysayam/codesbysayam`**.  
     *(Do NOT grant access to all repositories).*
5. **Permissions:**
   - Click on **Repository permissions**.
   - Locate **Contents**.
   - Change the permission level to **Read and write**.  
     *(This grants the minimum permission necessary to commit the synchronized README.md).*
6. Scroll down and click **Generate token**.
7. **Copy the generated token immediately** and store it securely (e.g. in your password manager).  
   > ⚠️ **Security Warning:** NEVER commit this token into git, code, comments, `.env` files, or pull requests.

---

## 🔐 Step 2: Add the Token as a Secret in the Portfolio Repository

1. Open your portfolio repository on GitHub:  
   [https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio](https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio)
2. Click on the **Settings** tab in the top navigation bar.
3. In the left sidebar, navigate to:  
   **Secrets and variables → Actions**  
   Direct link: [https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio/settings/secrets/actions](https://github.com/codesbysayam/Sayam-Mukherjee-Portfolio/settings/secrets/actions)
4. Click the green button: **New repository secret**.
5. Set the fields:
   - **Name:** `PROFILE_REPO_TOKEN`  
     *(Must match this exact name, uppercase).*
   - **Secret:** Paste the fine-grained Personal Access Token copied in Step 1.
6. Click **Add secret**.

---

## 📁 Step 3: Ensure Your Profile Repository Exists

GitHub displays a special profile README only if the repository meets three requirements:
- The repository must be named **exactly** after your GitHub username: `codesbysayam`.
- The repository must be **Public**.
- The repository must contain a `README.md` at its root.

If you have not yet created this repository:
1. Navigate to [https://github.com/new](https://github.com/new).
2. Set repository name to: `codesbysayam`.
3. Set visibility to: **Public**.
4. Check **Add a README file**.
5. Click **Create repository**.

---

## 🚀 Step 4: Test the Automatic Sync

### Option A: Trigger via Git Push
1. Make a small edit in `github-profile/README.md`.
2. Commit and push the change to your portfolio repository:
   ```bash
   git add github-profile/README.md
   git commit -m "docs: update profile bio"
   git push origin main
   ```
3. Go to the **Actions** tab in `codesbysayam/Sayam-Mukherjee-Portfolio` to watch the `Sync GitHub Profile README` workflow run.
4. Once completed (typically < 30 seconds), visit [https://github.com/codesbysayam](https://github.com/codesbysayam) to see your updated profile README live!

### Option B: Trigger Manually (Workflow Dispatch)
1. Go to **Actions → Sync GitHub Profile README** in the portfolio repository.
2. Click **Run workflow → Branch: main → Run workflow**.

---

## 🔒 Security Best Practices

- **Zero-Token Storage:** No tokens or credentials are stored within repository code.
- **Least-Privilege Scoping:** The token has permission to modify only `codesbysayam/codesbysayam/README.md` and cannot access private repositories or account settings.
- **Single Source of Truth:** You only ever edit `github-profile/README.md` inside this portfolio repository.
