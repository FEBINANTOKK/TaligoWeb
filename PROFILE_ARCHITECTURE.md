# Candidate Profile - Architecture & Data Flow

## Page Structure Overview

```
/profile (View Page)
├── Header
│   ├── Name + Headline
│   └── Edit Profile Button
├── Basic Info Cards (Grid 3-columns)
│   ├── Location
│   ├── Phone
│   └── Experience Years
├── Sections (vertical stack)
│   ├── About (Summary)
│   ├── Skills (Tags)
│   ├── Experience (Timeline)
│   ├── Education (Timeline)
│   ├── Links (External)
│   ├── Resume (Link)
│   └── Job Preferences (Badges)
└── Error/Loading States

/profile/edit (Edit Page)
├── Header (Create/Edit Profile)
├── Error Alert (if any)
├── Form Sections (collapsible)
│   ├── Basic Information (expanded)
│   ├── Professional Information (expanded)
│   ├── Experience (expandable)
│   │   └── Dynamic entries with add/remove
│   ├── Education (expandable)
│   │   └── Dynamic entries with add/remove
│   ├── Links (expandable)
│   └── Job Preferences (expandable)
├── Action Buttons
│   ├── Save Profile
│   └── Cancel
└── Loading/Error States
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Navigation                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Check User Role (CANDIDATE?)                   │
├─────────────────────────────────────────────────────────────┤
│  ✓ Candidate              │  ✗ Not Candidate              │
│  Continue               │  Show "Unauthorized"           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Fetch Profile (getProfile)                     │
├─────────────────────────────────────────────────────────────┤
│  Profile Exists         │  Profile Not Found (404)         │
│  Show Profile Data      │  Show "Create Profile" Button   │
└─────────────────────────────────────────────────────────────┘


EDIT/CREATE FLOW:
┌─────────────────────────────────────────────────────────────┐
│               User Clicks Edit/Create                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         Load Existing Profile into Form (if exists)         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              User Fills Form & Clicks Save                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Validate Form (Name required)                  │
├─────────────────────────────────────────────────────────────┤
│  ✓ Valid                │  ✗ Invalid                       │
│  Continue              │  Show Error Message              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│     Profile Exists?     │     No Profile Yet              │
├─────────────────────────────────────────────────────────────┤
│     Call updateProfile()│     Call createProfile()        │
│     (PUT)              │     (POST)                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Success? Set Profile Data                      │
├─────────────────────────────────────────────────────────────┤
│  ✓ Success              │  ✗ Error                        │
│  Redirect to /profile   │  Show Error Message             │
└─────────────────────────────────────────────────────────────┘
```

## File Dependencies

```
src/app/(app)/profile/page.tsx
  ├── imports: lucide-react (icons)
  ├── imports: next/link
  ├── imports: next/navigation (useRouter)
  └── imports: src/lib/profile.ts
     ├── getProfile()
     └── CandidateProfile type

src/app/(app)/profile/edit/page.tsx
  ├── imports: lucide-react (icons)
  ├── imports: next/navigation (useRouter)
  └── imports: src/lib/profile.ts
     ├── getProfile()
     ├── createProfile()
     ├── updateProfile()
     └── Types: CandidateProfile, ProfileExperience, etc.

src/lib/profile.ts
  ├── imports: src/lib/api.ts
  │  └── API_BASE constant
  └── exports: All types and API functions

src/lib/user-role.ts (existing)
  └── exports: getUserRole()
```

## Type Hierarchy

```
CandidateProfile (Main Type)
├── Basic Info Fields
│   ├── name: string (required)
│   ├── location?: string
│   └── phone?: string
│
├── Professional Fields
│   ├── headline?: string
│   ├── summary?: string
│   └── experienceYears?: number
│
├── skills?: string[]
│
├── experience?: ProfileExperience[]
│   ├── company: string
│   ├── role: string
│   ├── description?: string
│   ├── startDate?: string
│   └── endDate?: string
│
├── education?: ProfileEducation[]
│   ├── institution: string
│   ├── degree: string
│   ├── field?: string
│   └── graduationYear?: number
│
├── links?: ProfileLinks
│   ├── github?: string
│   ├── linkedin?: string
│   └── portfolio?: string
│
├── jobType?: string[]
│
├── workMode?: string[]
│
└── Metadata
    ├── _id: string
    ├── userId: string
    ├── createdAt: string
    ├── updatedAt: string
    └── resume?: { url: string; filename: string }
```

## Form State Structure

```typescript
FormData {
  // Input fields (strings/numbers)
  name: string;
  location: string;
  phone: string;
  headline: string;
  summary: string;
  experienceYears: string;      // Stringified number for input
  skills: string;               // Comma-separated, not array yet

  // Complex fields (arrays/objects)
  experience: ProfileExperience[];
  education: ProfileEducation[];
  links: ProfileLinks;           // Map of {key: value}
  jobType: string[];
  workMode: string[];

  // Helper state
  expandedSections: {
    experience: boolean;
    education: boolean;
    links: boolean;
    preferences: boolean;
  };
}
```

## API Request/Response Examples

### GET /api/profile

**Request**:

```
GET /api/profile HTTP/1.1
Host: localhost:4000
Content-Type: application/json
Cookie: [auth-cookie]
```

**Response (200 OK)**:

```json
{
  "data": {
    "_id": "65abc123def456",
    "userId": "user-id",
    "name": "John Doe",
    "headline": "Senior Full Stack Developer",
    "location": "San Francisco, CA",
    "phone": "+1-555-0100",
    "summary": "Experienced developer with 5+ years...",
    "experienceYears": 5,
    "skills": ["React", "Node.js", "TypeScript"],
    "experience": [
      {
        "_id": "exp-1",
        "company": "Tech Corp",
        "role": "Senior Developer",
        "startDate": "2023-01-15T00:00:00Z",
        "endDate": null,
        "description": "Led development of..."
      }
    ],
    "education": [
      {
        "_id": "edu-1",
        "institution": "MIT",
        "degree": "Bachelor of Science",
        "field": "Computer Science",
        "graduationYear": 2018
      }
    ],
    "links": {
      "github": "https://github.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe",
      "portfolio": "https://johndoe.dev"
    },
    "jobType": ["Full-time", "Contract"],
    "workMode": ["Remote", "Hybrid"],
    "resume": {
      "url": "https://storage.example.com/resume.pdf",
      "filename": "john-doe-resume.pdf"
    },
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2025-04-05T15:30:00Z"
  }
}
```

**Response (404 Not Found)**:

```json
{
  "message": "Profile not found"
}
```

### POST /api/profile (Create)

**Request**:

```json
{
  "name": "Jane Smith",
  "headline": "UX Designer",
  "summary": "Creative designer with passion for user experience",
  "experienceYears": 3,
  "skills": ["Figma", "UI Design", "Prototyping"],
  "jobType": ["Full-time"],
  "workMode": ["Remote"]
}
```

**Response (201 Created)**:

```json
{
  "data": {
    "_id": "65abc456def789",
    "userId": "user-id",
    "name": "Jane Smith",
    "headline": "UX Designer",
    ...
    "createdAt": "2025-04-05T15:35:00Z"
  }
}
```

### PUT /api/profile (Update)

**Request**:

```json
{
  "summary": "Updated summary text",
  "experienceYears": 4
}
```

**Response (200 OK)**:

```json
{
  "data": {
    "_id": "65abc456def789",
    ...
    "updatedAt": "2025-04-05T15:40:00Z"
  }
}
```

## Component State Transitions

### View Profile Page

```
LOADING
  ├─ Check role
  ├─ Fetch profile
  └─ Set initial state
     ↓
AUTHORIZED?
  ├─ Yes → DISPLAY_PROFILE or EMPTY_STATE
  └─ No  → UNAUTHORIZED_ERROR

DISPLAY_PROFILE
  ├─ Show all sections
  └─ Show edit button

EMPTY_STATE
  ├─ Show placeholder
  └─ Show create button

UNAUTHORIZED_ERROR
  └─ Show error alert

ERROR
  └─ Show error alert
```

### Edit Profile Page

```
LOADING
  ├─ Check role
  ├─ Fetch existing profile (if exists)
  └─ Populate form
     ↓
AUTHORIZED?
  ├─ Yes → FORM_READY
  └─ No  → UNAUTHORIZED_ERROR

FORM_READY
  ├─ User fills form
  └─ Can add/remove items
     ↓
SUBMITTING
  ├─ Validate form
  ├─ Send request
  └─ Wait response
     ↓
SUCCESS?
  ├─ Yes → REDIRECT (/profile)
  └─ No  → SHOW_ERROR (stay on page)
```

## Styling Classes Pattern

```
Cards:
  rounded-xl border border-border bg-card p-6

Buttons:
  Primary: bg-primary text-primary-foreground px-4 py-2 rounded-lg
  Secondary: border border-border text-foreground px-4 py-2 rounded-lg
  Danger: bg-destructive/10 text-destructive

Input Fields:
  rounded-lg border border-border bg-background px-3 py-2
  focus:outline-none focus:ring-2 focus:ring-ring

Icons:
  4x4: h-4 w-4
  5x5: h-5 w-5
  Foreground: text-muted-foreground
  Primary: text-primary
```

## Key Algorithms

### Skills Processing

```
Input: "React, TypeScript, Node.js"
       ↓
Split by comma: ["React", " TypeScript", " Node.js"]
       ↓
Trim each item: ["React", "TypeScript", "Node.js"]
       ↓
Filter empty: ["React", "TypeScript", "Node.js"]
       ↓
Output: string[]
```

### Experience/Education Filtering

```
Input: [
  { company: "", role: "Developer" },  ← Has role, consider it valid
  { company: "", role: "" },           ← Both empty, filter out
  { company: "TechCorp", role: "" }    ← Has company, consider it valid
]
       ↓
Filter entries where (company || role)
       ↓
Output: Entries with at least one non-empty field
```

### Form Data Normalization

```
Input: Partial<CandidateProfile>
       ↓
Convert:
  - name: trim whitespace
  - skills: split & trim
  - experienceYears: parse to number
  - experience/education: filter empty
  - Empty fields: set to undefined
  ↓
Output: Clean object ready for API
```

---

This architecture ensures:

- ✅ Type safety with TypeScript
- ✅ Predictable data flow
- ✅ Proper error handling
- ✅ Clear separation of concerns
- ✅ Reusable API functions
- ✅ Component modularity
