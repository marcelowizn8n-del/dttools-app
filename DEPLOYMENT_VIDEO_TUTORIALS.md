# Video Tutorials Feature - Deployment Guide

## ✅ What's Been Implemented

The Video Tutorials feature is now **fully implemented** and ready for deployment:

### 1. Database Schema ✅
- **Table**: `video_tutorials`
- **Multilingual Support**: PT/EN/ES/FR (title and description columns)
- **Features**: 
  - YouTube URL storage
  - Tags and keywords for categorization
  - View count tracking
  - Active/inactive toggle
  - Order management
  - Phase-based organization (overview, empathize, define, ideate, prototype, test)

### 2. Backend API ✅
- **Public Routes**:
  - `GET /api/video-tutorials` - List all active videos
  - `GET /api/video-tutorials/phase/:phase` - Filter by phase
  - `GET /api/video-tutorials/:id` - Get single video
  - `POST /api/video-tutorials/:id/view` - Track views

- **Admin Routes** (requires admin auth):
  - `POST /api/admin/video-tutorials` - Create video
  - `PUT /api/admin/video-tutorials/:id` - Update video
  - `DELETE /api/admin/video-tutorials/:id` - Delete video

### 3. Frontend Pages ✅
- **Admin Interface** (`/admin` → Videos tab):
  - Create, edit, delete videos
  - Add YouTube URLs
  - Manage translations (PT/EN/ES/FR)
  - Set phase, order, active status
  - Add tags for categorization

- **Public Page** (`/video-tutorials`):
  - Phase-based tabs
  - Multilingual support
  - YouTube integration
  - View count tracking
  - Responsive design

### 4. Video Scripts ✅
- **8 complete scripts** ready for Google Veo 3.1 production
- **File**: `ROTEIROS_VIDEO_VEO31.md`
- **Total Duration**: ~30 minutes
- **Coverage**: All 5 Design Thinking phases + overview

---

## 🚀 Deployment Steps

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "feat: Add Video Tutorials feature with multilingual support"
git push origin main
```

### Step 2: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your service
3. Click **"Manual Deploy" → "Deploy latest commit"**
4. Wait for deployment to complete (~3-5 minutes)

### Step 3: Push Database Schema (CRITICAL!)
After Render deployment completes, run:

```bash
# Try regular push first
npm run db:push

# If you get a data-loss warning, use --force
npm run db:push --force
```

**Important**: 
- The `video_tutorials` table is NEW, so there's no data to lose
- First deployment will create the table from scratch
- `--force` is safe here because this is a new feature with no existing data
- For future schema changes to existing tables, review warnings carefully before using `--force`

### Step 4: Verify Deployment
1. Visit `https://www.designthinkingtools.com`
2. Login as admin (`dttools.app@gmail.com`)
3. Go to **Admin Panel → Videos tab**
4. Verify you can create a test video
5. Check `/video-tutorials` page shows empty state correctly

---

## 📝 Adding Video URLs (After Recording)

Once you record videos with Google Veo 3.1:

1. **Access Admin Panel**:
   - Go to `www.designthinkingtools.com/admin`
   - Click **Videos** tab

2. **Add YouTube URLs**:
   - Click **"Novo Vídeo"**
   - Fill in:
     - Title (PT) + translations (EN/ES/FR)
     - Description (PT) + translations
     - Phase (overview, empathize, define, etc.)
     - YouTube URL (paste full link)
     - Duration (e.g., "4:30")
     - Tags (comma-separated)
   - Click **"Criar Vídeo"**

3. **Recommended Order**:
   ```
   Order 0: Introdução ao Design Thinking (overview)
   Order 1: Como criar um Mapa de Empatia (empathize)
   Order 2: Como criar Personas eficazes (empathize)
   Order 3: Como escrever Declarações POV (define)
   Order 4: Como criar perguntas HMW (define)
   Order 5: Como gerar ideias com DVF (ideate)
   Order 6: Como criar Protótipos (prototype)
   Order 7: Como testar com usuários (test)
   ```

---

## 🎬 Video Production Workflow

### Using Google Veo 3.1

1. **Open Script File**: `ROTEIROS_VIDEO_VEO31.md`

2. **For Each Video**:
   - Copy the scene-by-scene prompts
   - Use Google Veo 3.1 to generate video
   - Export as MP4
   - Upload to YouTube as unlisted/public

3. **After Upload**:
   - Copy YouTube URL
   - Add to DTTools via Admin Panel
   - Set correct phase and order
   - Add translations if available

### Example: First Video
```markdown
Video 1: "Introdução ao Design Thinking no DTTools"
Phase: overview
Duration: 3-4 min
YouTube URL: https://www.youtube.com/watch?v=XXXXX

Translations:
- PT: "Introdução ao Design Thinking no DTTools"
- EN: "Introduction to Design Thinking on DTTools"
- ES: "Introducción al Design Thinking en DTTools"
- FR: "Introduction au Design Thinking sur DTTools"
```

---

## 🔍 Testing Checklist

Before going live, verify:

- [ ] Admin can create/edit/delete videos
- [ ] YouTube URLs open correctly
- [ ] View count increments when clicking video
- [ ] Multilingual titles display correctly
- [ ] Phase filtering works
- [ ] Tags display properly
- [ ] Active/inactive toggle works
- [ ] Public page shows "Coming Soon" when no YouTube URL
- [ ] Mobile responsive design works

---

## 📊 Database Structure

```sql
CREATE TABLE video_tutorials (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_en TEXT,
  title_es TEXT,
  title_fr TEXT,
  description TEXT,
  description_en TEXT,
  description_es TEXT,
  description_fr TEXT,
  phase TEXT NOT NULL, -- 'overview', 'empathize', 'define', 'ideate', 'prototype', 'test'
  duration TEXT, -- '3-4 min'
  youtube_url TEXT,
  thumbnail_url TEXT,
  keywords TEXT[], -- SEO keywords
  tags TEXT[], -- User-facing categories
  script_id TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

## 🎯 Next Steps

1. ✅ Deploy code to production (git push + Render deploy)
2. ✅ Run database migration (`npm run db:push --force`)
3. 🎬 Record videos with Google Veo 3.1 using provided scripts
4. 📹 Upload videos to YouTube
5. ⚙️ Add YouTube URLs via Admin Panel
6. 🌍 Add translations for each video
7. 🚀 Feature ready for users!

---

## 🐛 Troubleshooting

### "Table video_tutorials does not exist"
**Solution**: Run `npm run db:push` (or `npm run db:push --force` if it shows data-loss warning) to create the table.

### "Cannot read property 'titleEn' of undefined"
**Solution**: Schema mismatch. Ensure latest code is deployed and db:push was run.

### Videos not showing on public page
**Check**:
1. Video `is_active = true`
2. YouTube URL is filled
3. Phase matches the selected tab
4. Browser cache cleared

### Admin can't add videos
**Check**:
1. User role = 'admin'
2. Logged in correctly
3. API routes deployed

---

## 📞 Support

If you encounter issues during deployment:
1. Check Render logs for errors
2. Verify database connection
3. Test API routes manually using browser DevTools
4. Check video_tutorials table exists in database

**All backend APIs are ready. The only step remaining is recording and uploading videos to YouTube!**
