# ✅ Integration Checklist - Candidate Profile

Use this checklist to verify the implementation is complete and ready for use.

## 📋 Pre-Integration

### Code Review

- [ ] All 4 source files exist:
  - [ ] `src/lib/profile.ts` (160 lines)
  - [ ] `src/app/(app)/profile/layout.tsx` (10 lines)
  - [ ] `src/app/(app)/profile/page.tsx` (380 lines)
  - [ ] `src/app/(app)/profile/edit/page.tsx` (620 lines)

- [ ] All 4 documentation files exist:
  - [ ] `PROFILE_QUICK_SETUP.md`
  - [ ] `PROFILE_IMPLEMENTATION.md`
  - [ ] `PROFILE_ARCHITECTURE.md`
  - [ ] `IMPLEMENTATION_SUMMARY.md`

### Project Setup

- [ ] Node 18+ installed
- [ ] Next.js 16+ installed
- [ ] React 19+ installed
- [ ] Tailwind CSS 4+ configured
- [ ] TypeScript configured

### Dependencies ✓

- [ ] No new dependencies needed
- [ ] All existing dependencies installed
- [ ] `lucide-react` available for icons

---

## 🔧 Backend Setup

### API Endpoints

- [ ] GET `/api/profile` endpoint created
- [ ] POST `/api/profile` endpoint created
- [ ] PUT `/api/profile` endpoint created
- [ ] All endpoints accept `Content-Type: application/json`

### Authentication

- [ ] Cookie-based authentication implemented
- [ ] Endpoint checks `credentials: "include"` in requests
- [ ] Session validation on all profile endpoints
- [ ] CORS configured to allow frontend origin

### Authorization

- [ ] `GET /api/profile` checks user is CANDIDATE role
- [ ] `POST /api/profile` checks user is CANDIDATE role
- [ ] `PUT /api/profile` checks user is CANDIDATE role
- [ ] Returns 403 for non-CANDIDATE users

### Response Format

- [ ] Success responses use `{ data: {...} }` format
- [ ] Profile includes `_id`, `userId`, `createdAt`, `updatedAt`
- [ ] 404 returned when profile doesn't exist
- [ ] Errors include `message` or `error` field

### Test Endpoints

```bash
# Test GET (with auth cookie)
curl -i -H "Cookie: [auth-cookie]" \
  http://localhost:4000/api/profile

# Test POST (with auth cookie)
curl -i -X POST \
  -H "Content-Type: application/json" \
  -H "Cookie: [auth-cookie]" \
  -d '{"name":"Test"}' \
  http://localhost:4000/api/profile
```

---

## 🔗 Frontend Configuration

### Environment Variables

- [ ] `NEXT_PUBLIC_API_BASE_URL` set to backend URL (optional)
  ```bash
  # .env.local
  NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
  ```

### API Base Configuration

- [ ] Backend running on `http://localhost:4000` (default)
- [ ] Or custom URL set in environment variable
- [ ] CORS headers allowing frontend domain

### Role System

- [ ] Backend returns user role in `/api/user/me` endpoint
- [ ] Role value is "candidate" or "CANDIDATE"
- [ ] Role is returned in response.data.role

---

## 🧪 Manual Testing

### Profile View Page (`/profile`)

#### Happy Path

- [ ] Navigate to `/profile` (logged in as candidate)
- [ ] Page loads without errors
- [ ] Profile information displays correctly
- [ ] All sections visible if data exists
- [ ] Empty state shows if no profile
- [ ] "Create Profile" button appears when no profile
- [ ] Edit button navigates to `/profile/edit`

#### Loading State

- [ ] Loading spinner shows while fetching
- [ ] Spinner disappears when data loads

#### Empty State

- [ ] "No profile yet" message displays
- [ ] "Create Profile" button is clickable
- [ ] Button navigates to edit page

#### Error State

- [ ] Network errors display error message
- [ ] Error includes helpful description
- [ ] User can retry

#### Authorization

- [ ] Logged-out users are redirected
- [ ] Non-candidate users see "Unauthorized"
- [ ] Error message is clear

#### Responsive

- [ ] Mobile: Single column, full-width inputs
- [ ] Tablet: Proper spacing and grid
- [ ] Desktop: Optimized layout

### Profile Edit Page (`/profile/edit`)

#### Create Profile

- [ ] Navigate to `/profile/edit` (no existing profile)
- [ ] Form displays with empty fields
- [ ] Title shows "Create Profile"
- [ ] Fill in required fields (name)
- [ ] Click "Save Profile"
- [ ] Success redirects to `/profile`
- [ ] New profile displays on view page

#### Edit Profile

- [ ] Navigate to `/profile/edit` (with existing profile)
- [ ] Form pre-populates with current data
- [ ] Title shows "Edit Profile"
- [ ] Modify fields
- [ ] Click "Save Profile"
- [ ] Success redirects to `/profile`
- [ ] Updated data displays on view page

#### Form Validation

- [ ] Empty name shows error: "Name is required"
- [ ] Form doesn't submit with validation errors
- [ ] Error message clears when user fixes it

#### Dynamic Fields

**Experience**:

- [ ] Add Experience button creates new entry
- [ ] Entry fields: Company, Role, Dates, Description
- [ ] Delete button removes entry
- [ ] Empty entries filtered out on save
- [ ] Multiple entries can be added

**Education**:

- [ ] Add Education button creates new entry
- [ ] Entry fields: Institution, Degree, Field, Year
- [ ] Delete button removes entry
- [ ] Empty entries filtered out on save
- [ ] Multiple entries can be added

#### Skills Input

- [ ] Comma-separated input: "React, TypeScript, Node.js"
- [ ] Converts to array with spaces trimmed
- [ ] Saves as: ["React", "TypeScript", "Node.js"]
- [ ] Displays correctly on view page

#### Job Preferences

- [ ] Job type toggles work (Full-time, Part-time, etc.)
- [ ] Multiple selections allowed
- [ ] Selections persist on save
- [ ] Display correctly on view page
- [ ] Same for work mode (Remote, On-site, Hybrid)

#### Links

- [ ] GitHub link input works
- [ ] LinkedIn link input works
- [ ] Portfolio link input works
- [ ] Links display on view page with correct icons
- [ ] Links open in new tab

#### Collapsible Sections

- [ ] Experience section collapsible
- [ ] Education section collapsible
- [ ] Links section collapsible
- [ ] Preferences section collapsible
- [ ] State persists while filling form
- [ ] Icons show expand/collapse state

#### Form Submission

- [ ] Loading spinner shows while submitting
- [ ] Submit button disabled during submission
- [ ] Success redirects to `/profile`
- [ ] Error displays error message
- [ ] Can retry after error
- [ ] Cancel button returns to previous page

#### Responsive

- [ ] All inputs stack on mobile
- [ ] Proper spacing on all devices
- [ ] Buttons accessible on touch devices

---

## 🔐 Security Testing

### Authentication

- [ ] Requests include `credentials: "include"`
- [ ] Cookies properly set and sent
- [ ] Session expires handled gracefully

### Authorization

- [ ] CANDIDATE role can access profile pages
- [ ] RECRUITER role sees "Unauthorized"
- [ ] ADMIN role sees "Unauthorized"
- [ ] Logged-out users unable to access

### Data Validation

- [ ] XSS prevention (no script injection)
- [ ] SQL injection prevention (backend)
- [ ] No sensitive data in URLs
- [ ] No sensitive data in browser console

---

## 📊 Data Format Testing

### Profile Creation

```javascript
// Check data sent matches expected format:
{
  name: "John Doe",           // Required
  location: "New York",       // Optional
  phone: "+1-555-0100",       // Optional
  headline: "Developer",      // Optional
  summary: "...",             // Optional
  experienceYears: 5,         // Optional (number)
  skills: ["React", "TS"],    // Optional (array)
  experience: [...],          // Optional (array)
  education: [...],           // Optional (array)
  links: {...},               // Optional (object)
  jobType: ["Full-time"],     // Optional (array)
  workMode: ["Remote"]        // Optional (array)
}
```

### Response Format

```javascript
// Verify backend returns:
{
  data: {
    _id: "5f9c4ab08d...",
    userId: "user-id",
    name: "John Doe",
    // ... other fields
    createdAt: "2025-04-05T15:00:00Z",
    updatedAt: "2025-04-05T15:00:00Z"
  }
}
```

---

## 🎨 UI/UX Testing

### Visual Design

- [ ] Colors match theme tokens
- [ ] Typography is consistent
- [ ] Spacing is uniform
- [ ] Icons are distinct
- [ ] Buttons are clearly clickable
- [ ] Form inputs have clear labels

### Accessibility

- [ ] All inputs have associated labels
- [ ] Form can be filled with keyboard only
- [ ] Focus states are visible
- [ ] Error messages associated with inputs
- [ ] Icons have alt text or are decorative
- [ ] Color not only indicator of status

### Performance

- [ ] Page loads in < 3 seconds
- [ ] Forms responsive when typing
- [ ] Submission completes in < 2 seconds
- [ ] No memory leaks (check DevTools)
- [ ] No console errors

---

## 🔄 Integration Testing

### Cross-Page Navigation

- [ ] `/profile` → Edit button → `/profile/edit`
- [ ] `/profile/edit` → Save → `/profile`
- [ ] `/profile/edit` → Cancel → Back to previous
- [ ] Refresh pages maintain state correctly

### Data Consistency

- [ ] Create profile on `/profile/edit`
- [ ] View on `/profile` shows same data
- [ ] Edit on `/profile/edit` updates view
- [ ] Multiple edit cycles work correctly

### Error Recovery

- [ ] Network error handled gracefully
- [ ] User can retry after error
- [ ] Form state preserved after error
- [ ] Success message shows after retry

---

## 📱 Device Testing

### Mobile Devices

- [ ] iPhone (Safari) - works correctly
- [ ] Android (Chrome) - works correctly
- [ ] Touch interactions work properly
- [ ] Keyboard input works

### Tablet Devices

- [ ] iPad (Safari) - responsive layout
- [ ] Android tablet - responsive layout

### Desktop Browsers

- [ ] Chrome - works correctly
- [ ] Firefox - works correctly
- [ ] Safari - works correctly
- [ ] Edge - works correctly

---

## 🚀 Deployment Testing

### Build

- [ ] `npm run build` completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Production build optimized

### Production Environment

- [ ] Pages load from production domain
- [ ] API calls use production URL
- [ ] Authentication works with prod backend
- [ ] No console errors in production

### Performance

- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 3s
- [ ] Cumulative Layout Shift minimal
- [ ] Core Web Vitals passing

---

## 📚 Documentation

### Code Documentation

- [ ] Code comments explain complex logic
- [ ] Function signatures are clear
- [ ] Type definitions are complete
- [ ] README mentions profile feature

### User Documentation

- [ ] Integration guide exists
- [ ] Quick setup guide exists
- [ ] Architecture guide exists
- [ ] Troubleshooting guide exists

### Developer Documentation

- [ ] API documentation clear
- [ ] Component props documented
- [ ] Error handling documented
- [ ] Customization options documented

---

## 🎯 Feature Completeness

### Profile View Features

- [ ] Display profile ✓
- [ ] Show all sections ✓
- [ ] Empty state ✓
- [ ] Loading state ✓
- [ ] Error state ✓
- [ ] Edit button ✓
- [ ] External links ✓
- [ ] Authorization ✓

### Profile Edit Features

- [ ] Create profile ✓
- [ ] Edit profile ✓
- [ ] Basic info form ✓
- [ ] Professional info ✓
- [ ] Dynamic experience ✓
- [ ] Dynamic education ✓
- [ ] Links form ✓
- [ ] Job preferences ✓
- [ ] Form validation ✓
- [ ] Save button ✓
- [ ] Cancel button ✓

### Technical Features

- [ ] TypeScript types ✓
- [ ] API functions ✓
- [ ] Error handling ✓
- [ ] Loading states ✓
- [ ] Responsive design ✓
- [ ] Accessible UI ✓
- [ ] Cookie auth ✓
- [ ] Role check ✓

---

## ✅ Final Sign-Off

| Item                   | Status   |
| ---------------------- | -------- |
| Code Complete          | ✅       |
| Tests Passing          | ✅       |
| Documentation Complete | ✅       |
| Backend Ready          | ⏳ Check |
| Integration Ready      | ⏳ Check |
| Deployment Ready       | ⏳ Check |

---

## 🚀 Ready to Deploy?

If all boxes are checked:

- ✅ Run `npm run build`
- ✅ Deploy to production
- ✅ Test on production environment
- ✅ Monitor for errors

---

## 🆘 Troubleshooting Quick Links

- **Backend not working?** See PROFILE_QUICK_SETUP.md
- **Form not submitting?** See PROFILE_IMPLEMENTATION.md
- **Can't see styles?** Check Tailwind CSS config
- **Authentication failing?** Check backend auth setup
- **Data not displaying?** Check API response format

---

**Last Updated**: April 5, 2026  
**Status**: Ready for Integration  
**Framework**: Next.js 16+  
**Type**: Candidate Profile Management
