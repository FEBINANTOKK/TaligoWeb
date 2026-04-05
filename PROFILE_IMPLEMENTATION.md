# Candidate Profile UI Implementation

Complete Candidate Profile management system for Next.js App Router with cookie-based authentication.

## Overview

The Candidate Profile system allows CANDIDATE role users to:

- View their complete profile with all sections
- Create a new profile if one doesn't exist
- Edit and update their profile information
- Manage multiple sections: experience, education, links, and job preferences

## Architecture

### File Structure

```
src/
├── lib/
│   ├── profile.ts          # Profile API functions & types
│   ├── api.ts              # Base API utilities (already exists)
│   └── user-role.ts        # Role checking utilities (already exists)
├── app/
│   └── (app)/
│       └── profile/
│           ├── layout.tsx          # Profile layout wrapper
│           ├── page.tsx            # View profile page
│           └── edit/
│               └── page.tsx        # Edit profile page
```

## API Endpoints

All endpoints require `credentials: "include"` for cookie-based authentication.

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| GET    | `/api/profile` | Fetch candidate's profile |
| POST   | `/api/profile` | Create new profile        |
| PUT    | `/api/profile` | Update existing profile   |

### Error Handling

- 404: Profile doesn't exist (returns `null` in `getProfile()`)
- 401: Unauthorized (not authenticated)
- 403: User is not a CANDIDATE role
- 400/422: Validation error

## Data Types

### CandidateProfile

```typescript
interface CandidateProfile {
  _id: string;
  userId: string;

  // Basic Info
  name: string;
  location?: string;
  phone?: string;

  // Professional
  headline?: string;
  summary?: string;
  experienceYears?: number;

  // Skills
  skills?: string[];

  // Experience & Education
  experience?: ProfileExperience[];
  education?: ProfileEducation[];

  // Links
  links?: ProfileLinks;

  // Preferences
  jobType?: string[]; // "Full-time", "Part-time", "Contract", etc.
  workMode?: string[]; // "Remote", "On-site", "Hybrid"

  // Resume
  resume?: { url: string; filename: string };

  // Metadata
  createdAt: string;
  updatedAt: string;
}
```

### Related Types

```typescript
interface ProfileExperience {
  _id?: string;
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface ProfileEducation {
  _id?: string;
  institution: string;
  degree: string;
  field?: string;
  graduationYear?: number;
}

interface ProfileLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}
```

## Pages

### `/profile` - View Profile

**Route**: `src/app/(app)/profile/page.tsx`

**Features**:

- Displays complete profile information organized in sections
- Shows "Create Profile" button if profile doesn't exist
- Role-based access control (CANDIDATE only)
- Loading, error, and empty states
- Edit button to navigate to edit page

**Sections Displayed**:

1. **Header**: Name, headline, edit button
2. **Basic Info Cards**: Location, phone, experience years
3. **About**: Professional summary
4. **Skills**: Skill tags
5. **Experience**: List of role, company, dates, description
6. **Education**: Degree, institution, field, graduation year
7. **Links**: GitHub, LinkedIn, Portfolio (external links)
8. **Resume**: Link to resume file
9. **Job Preferences**: Job types and work modes

**State Management**:

- `profile`: Current profile data
- `loading`: Initial fetch state
- `error`: Error message display
- `authorized`: Role authorization check

### `/profile/edit` - Edit Profile

**Route**: `src/app/(app)/profile/edit/page.tsx`

**Features**:

- Create new profile if none exists
- Update existing profile
- Dynamic form sections with collapse/expand
- Add/remove experience and education entries
- Toggle job preferences (job types and work modes)
- Form validation (name required)
- Auto-convert comma-separated skills to array

**Form Sections**:

1. **Basic Information**: Name, phone, location
2. **Professional Information**: Headline, summary, experience years, skills
3. **Experience**: Dynamic list with add/remove buttons
4. **Education**: Dynamic list with add/remove buttons
5. **Links**: GitHub, LinkedIn, Portfolio URLs
6. **Job Preferences**: Job types and work modes

**Key Features**:

- Collapsible sections for compact UI (except Basic & Professional)
- Validation error messages
- Loading and submission states
- Automatic redirect to profile view after successful save
- Support for both CREATE and UPDATE operations

**Form Validation**:

- Name is required
- Email format validation (if phone field)
- Empty experience/education entries are filtered out
- Skill string is split on commas and trimmed

## API Utility Functions

Located in `src/lib/profile.ts`:

### `getProfile(): Promise<CandidateProfile | null>`

Fetches the authenticated user's profile.

```typescript
const profile = await getProfile();
// Returns null if profile doesn't exist (404)
// Throws error on auth/server issues
```

### `createProfile(data: Partial<CandidateProfile>): Promise<CandidateProfile>`

Creates a new profile.

```typescript
const newProfile = await createProfile({
  name: "John Doe",
  headline: "Software Engineer",
  skills: ["React", "Node.js"],
});
```

### `updateProfile(data: Partial<CandidateProfile>): Promise<CandidateProfile>`

Updates an existing profile.

```typescript
const updated = await updateProfile({
  summary: "Updated summary",
  experienceYears: 5,
});
```

## UI Components

### Design System

Uses Tailwind CSS with custom theme tokens:

- **Colors**:
  - `foreground`: Main text color
  - `muted-foreground`: Secondary text
  - `border`: Border color
  - `primary`: Primary action color
  - `destructive`: Error/delete color
  - `accent`: Hover states

- **Layout**:
  - Cards: `rounded-xl border border-border bg-card p-6`
  - Buttons: `rounded-lg px-4 py-2 text-sm font-semibold transition-colors`
  - Inputs: `rounded-lg border border-border bg-background px-3 py-2`

### Icons

Uses `lucide-react` icons:

- `Loader2` - Loading spinner
- `AlertCircle` - Errors
- `Edit2` - Edit button
- `Plus` - Add button
- `Trash2` - Delete button
- `MapPin`, `Phone`, `Briefcase` - Info icons
- `Github`, `Linkedin`, `Globe` - Social links
- `FileText` - Resume

## Data Flow

### View Profile Flow

```
1. Component mounts
   ↓
2. Check user role (must be CANDIDATE)
   ↓
3. Fetch profile via getProfile()
   ↓
4. Profile exists?
   ├─ YES → Display profile data
   └─ NO → Show "Create Profile" button
```

### Edit Profile Flow

```
1. Component mounts
   ↓
2. Check user role (must be CANDIDATE)
   ↓
3. Try fetch existing profile
   ├─ EXISTS → Populate form with data
   └─ NOT EXISTS → Show empty form
   ↓
4. User fills form
   ↓
5. Submit
   ├─ Profile exists? → updateProfile(data)
   └─ No profile? → createProfile(data)
   ↓
6. Success → Redirect to /profile
   |
7. Error → Show error message
```

## Error Handling

### Common Errors

| Error                              | Cause                      | Solution              |
| ---------------------------------- | -------------------------- | --------------------- |
| "Unauthorized: Only candidates..." | User is not CANDIDATE role | Check role in backend |
| "Failed to load profile"           | Network/fetch error        | Check API is running  |
| "API error: 400 Bad Request"       | Invalid data format        | Validate form data    |
| "API error: 401 Unauthorized"      | Session expired            | Re-authenticate       |

### Error Display

- Top-level errors shown in alert box with icon
- Form-level validation: Name is required
- Network errors automatically caught and displayed

## State Management

Uses React hooks for state:

- `useState()` - Form data, loading, error, authorization
- `useEffect()` - Initial data fetch
- `useCallback()` - Memoized handlers for form changes

## Authentication & Authorization

### Role-Based Access

```typescript
const role = await getUserRole();
if (role !== "candidate") {
  // Show unauthorized message
}
```

### Cookie-Based Auth

All API requests include:

```typescript
{
  credentials: "include", // This sends/receives cookies
  headers: { "Content-Type": "application/json" },
}
```

## Responsive Design

- Mobile-first approach
- Grid layouts adapt from 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Stack all form fields vertically on mobile
- Flexible gap spacing with Tailwind responsive prefixes

## Key Features

✅ Full CRUD operations on profile
✅ Role-based access control  
✅ Cookie-based authentication
✅ Dynamic form arrays (experience, education)
✅ Skill tag management
✅ Job preference toggles
✅ External link support (GitHub, LinkedIn, Portfolio)
✅ Loading and error states
✅ Empty state handling
✅ Responsive design
✅ Type-safe API functions
✅ Collapsible form sections

## Usage

1. **View Profile**:
   Navigate to `/profile` to see your profile

2. **Create Profile**:
   - Go to `/profile` → Click "Create Profile" button
   - Or navigate directly to `/profile/edit`

3. **Edit Profile**:
   - Go to `/profile` → Click "Edit Profile" button
   - Or navigate directly to `/profile/edit`

4. **Add Experience/Education**:
   - In edit page, scroll to section
   - Click "Add Experience" or "Add Education"
   - Fill in details
   - Save profile

5. **Manage Skills**:
   - In Professional section, enter skills comma-separated
   - Example: `React, TypeScript, Node.js`
   - Automatically converted to array on save

## Backend Requirements

The backend API (`http://localhost:4000/api/profile`) must:

1. Accept `GET` to fetch profile
2. Accept `POST` to create profile
3. Accept `PUT` to update profile
4. Respect cookie-based authentication
5. Return `null`/404 if profile doesn't exist
6. Validate `name` field is required
7. Return profile data in format:
   ```json
   {
     "data": {
       /* CandidateProfile fields */
     }
   }
   ```

## Future Enhancements

- Resume upload endpoint
- Profile completion percentage
- Profile verification badges
- Export profile as PDF
- Profile preview for recruiters
- Undo/redo functionality
- Auto-save drafts
- Profile suggestions based on job titles
