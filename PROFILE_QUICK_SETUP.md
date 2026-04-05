# Candidate Profile - Quick Setup & Integration

## ✅ Implementation Complete

All files have been created and are ready to use. Below is a quick reference for integration.

## Files Created

### API & Types

- **`src/lib/profile.ts`** - Profile API functions and TypeScript types
  - `getProfile()` - Fetch profile
  - `createProfile()` - Create new profile
  - `updateProfile()` - Update existing profile
  - `CandidateProfile` type with all fields
  - `ProfileExperience`, `ProfileEducation`, `ProfileLinks` types

### Pages

- **`src/app/(app)/profile/page.tsx`** - View profile page
  - Displays complete profile with 9 sections
  - Shows "Create Profile" if no profile exists
  - Role-based access (CANDIDATE only)
  - Full error/loading/empty state handling

- **`src/app/(app)/profile/edit/page.tsx`** - Edit/create profile page
  - Form for creating new or updating existing profile
  - 6 collapsible sections
  - Dynamic arrays for experience and education
  - Job preference toggles
  - Auto-validation and error messages

### Layout

- **`src/app/(app)/profile/layout.tsx`** - Profile layout wrapper with max-width container

### Documentation

- **`PROFILE_IMPLEMENTATION.md`** - Complete technical documentation
- **`PROFILE_QUICK_SETUP.md`** - This file

## 🚀 How to Use

### 1. Access Profile Pages

Navigate candidates to:

- **View**: `/profile`
- **Edit/Create**: `/profile/edit`

### 2. Add Navigation Links

Update your navigation files to include profile links:

#### In `src/Constants/navigation.ts`:

```typescript
export const candidateNavigation = [
  // ... existing items
  {
    href: "/profile",
    label: "Profile",
    icon: "User", // or whatever icon component
  },
];
```

#### In `src/components/Sidebar.tsx`:

```tsx
import Link from "next/link";

// In your navigation loop:
<Link href="/profile" className="...">
  Profile
</Link>;
```

### 3. API Backend

The backend must provide:

```
GET  /api/profile      → Fetch profile
POST /api/profile      → Create profile
PUT  /api/profile      → Update profile
```

**Request headers**:

```
Content-Type: application/json
Cookie: [auth cookie]  (automatically sent via credentials: "include")
```

**Response format**:

```json
{
  "data": {
    "_id": "...",
    "name": "John Doe",
    "headline": "Software Engineer",
    ...
  }
}
```

### 4. Environment Variable

Ensure `NEXT_PUBLIC_API_BASE_URL` is set (or defaults to `http://localhost:4000`):

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## 📋 Features Implemented

### Profile View (`/profile`)

- ✅ Display profile sections
- ✅ Show "Create Profile" button if not exists
- ✅ Edit button links to `/profile/edit`
- ✅ External links support (GitHub, LinkedIn, Portfolio)
- ✅ Resume link display
- ✅ Skills tags display
- ✅ Experience/Education lists
- ✅ Job preferences display

### Profile Edit (`/profile/edit`)

- ✅ Create new profile form
- ✅ Update existing profile form
- ✅ Add/remove experience entries
- ✅ Add/remove education entries
- ✅ Comma-separated skills input
- ✅ Job type toggles (Full-time, Part-time, Contract, etc.)
- ✅ Work mode toggles (Remote, On-site, Hybrid)
- ✅ External link inputs
- ✅ Form validation
- ✅ Loading/error states
- ✅ Auto-redirect on success

### Authorization

- ✅ Role check (CANDIDATE only)
- ✅ Cookie-based authentication
- ✅ Unauthorized error messages

### UX/Design

- ✅ Tailwind CSS styling
- ✅ Responsive layout
- ✅ Loading spinners
- ✅ Error alerts
- ✅ Empty states
- ✅ Collapsible form sections
- ✅ Lucide React icons
- ✅ Smooth transitions

## 🔐 Authentication Flow

```
1. User navigates to /profile
2. Component calls getUserRole()
3. Role checked against "candidate"
4. If not candidate → Show "Unauthorized"
5. If candidate → Fetch profile via getProfile()
6. Display profile or "Create Profile" button
```

## 📝 Form Data Structure

When submitting the edit form, the following data is sent:

```typescript
{
  name: string,           // REQUIRED
  location?: string,
  phone?: string,
  headline?: string,
  summary?: string,
  experienceYears?: number,
  skills?: string[],      // Auto-converted from comma-separated input
  experience?: Array<{
    company: string,
    role: string,
    description?: string,
    startDate?: string,
    endDate?: string,
  }>,
  education?: Array<{
    institution: string,
    degree: string,
    field?: string,
    graduationYear?: number,
  }>,
  links?: {
    github?: string,
    linkedin?: string,
    portfolio?: string,
  },
  jobType?: string[],     // Array of selected job types
  workMode?: string[],    // Array of selected work modes
}
```

## 🛠️ Customization

### Change Job Types & Work Modes

Edit `src/app/(app)/profile/edit/page.tsx`:

```typescript
const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  // Add/remove as needed
];

const WORK_MODES = [
  "Remote",
  "On-site",
  "Hybrid",
  // Add/remove as needed
];
```

### Customize Profile Fields

To add/remove fields:

1. Update `CandidateProfile` interface in `src/lib/profile.ts`
2. Update `FormData` interface in `src/app/(app)/profile/edit/page.tsx`
3. Add/remove form inputs in the edit page
4. Add/remove display sections in the view page

### Change Styling

All components use Tailwind CSS with:

- `bg-card`, `bg-background` - Background colors
- `text-foreground`, `text-muted-foreground` - Text colors
- `border-border` - Border color
- `rounded-xl`, `rounded-lg` - Border radius
- `px-4 py-2` - Padding (adjust as needed)

## 🐛 Troubleshooting

| Issue                    | Solution                                               |
| ------------------------ | ------------------------------------------------------ |
| "Unauthorized" error     | Check user role is CANDIDATE in backend                |
| "Failed to load profile" | Ensure API is running on `http://localhost:4000`       |
| Profile not saving       | Check backend accepts PUT/POST to `/api/profile`       |
| Links not working        | Ensure backend returns absolute URLs in `links` object |
| Skills not saving        | Ensure comma-separated input is converted to array     |

## 📚 Related Files

- **Existing API utility**: `src/lib/api.ts` - Base request function
- **Existing auth utility**: `src/lib/user-role.ts` - Role checking
- **Existing layout**: `src/app/(app)/layout.tsx` - App layout wrapper
- **Full documentation**: `PROFILE_IMPLEMENTATION.md`

## 🔗 Integration Checklist

- [ ] Backend API endpoints implemented
- [ ] Environment variables configured
- [ ] Navigation links added (optional but recommended)
- [ ] Test viewing profile at `/profile`
- [ ] Test creating profile at `/profile/edit`
- [ ] Test editing profile
- [ ] Test role authorization (non-candidates should see error)
- [ ] Test with actual data from backend
- [ ] Customize fields/job types as needed
- [ ] Deploy with backend API

## 💡 Key Implementation Details

- Uses `"use client"` for client-side rendering
- Cookie-based authentication via `credentials: "include"`
- Role-based access control with `getUserRole()`
- Optimistic state updates with `useState`
- Form submission with automatic CREATE vs UPDATE logic
- Responsive grid layouts with Tailwind CSS breakpoints
- Lucide React icons for consistent UI

---

**Status**: ✅ Ready for use  
**Last Updated**: April 5, 2026  
**Type**: Candidate Profile Management System
