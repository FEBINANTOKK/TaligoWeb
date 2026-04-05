"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getProfile,
  createProfile,
  updateProfile,
  type CandidateProfile,
  type ProfileExperience,
  type ProfileEducation,
  type ProfileLinks,
} from "@/lib/profile";
import { getUserRole } from "@/lib/user-role";

interface FormData {
  name: string;
  location: string;
  phone: string;
  headline: string;
  summary: string;
  experienceYears: string;
  skills: string;
  experience: ProfileExperience[];
  education: ProfileEducation[];
  links: ProfileLinks;
  jobType: string[];
  workMode: string[];
}

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];
const WORK_MODES = ["Remote", "On-site", "Hybrid"];

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    experience: true,
    education: true,
    links: false,
    preferences: false,
  });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    location: "",
    phone: "",
    headline: "",
    summary: "",
    experienceYears: "",
    skills: "",
    experience: [],
    education: [],
    links: {},
    jobType: [],
    workMode: [],
  });

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Check role authorization
        const role = await getUserRole();
        if (role !== "candidate") {
          setError("Unauthorized: Only candidates can access this page");
          setAuthorized(false);
          return;
        }

        setAuthorized(true);

        // Fetch existing profile if available
        const profileData = await getProfile();
        if (profileData) {
          setProfile(profileData);
          setFormData({
            name: profileData.name ?? "",
            location: profileData.location ?? "",
            phone: profileData.phone ?? "",
            headline: profileData.headline ?? "",
            summary: profileData.summary ?? "",
            experienceYears: profileData.experienceYears?.toString() ?? "",
            skills: (profileData.skills ?? []).join(", "),
            experience: profileData.experience ?? [],
            education: profileData.education ?? [],
            links: profileData.links ?? {},
            jobType: profileData.jobType ?? [],
            workMode: profileData.workMode ?? [],
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [],
  );

  const handleExperienceChange = useCallback(
    (index: number, field: keyof ProfileExperience, value: string) => {
      setFormData((prev) => ({
        ...prev,
        experience: prev.experience.map((exp, i) =>
          i === index ? { ...exp, [field]: value } : exp,
        ),
      }));
    },
    [],
  );

  const addExperience = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", role: "", description: "" },
      ],
    }));
  }, []);

  const removeExperience = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  }, []);

  const handleEducationChange = useCallback(
    (index: number, field: keyof ProfileEducation, value: string) => {
      setFormData((prev) => ({
        ...prev,
        education: prev.education.map((edu, i) =>
          i === index ? { ...edu, [field]: value } : edu,
        ),
      }));
    },
    [],
  );

  const addEducation = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { institution: "", degree: "" }],
    }));
  }, []);

  const removeEducation = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  }, []);

  const handleLinkChange = useCallback(
    (field: keyof ProfileLinks, value: string) => {
      setFormData((prev) => ({
        ...prev,
        links: { ...prev.links, [field]: value },
      }));
    },
    [],
  );

  const toggleJobType = useCallback((type: string) => {
    setFormData((prev) => ({
      ...prev,
      jobType: prev.jobType.includes(type)
        ? prev.jobType.filter((t) => t !== type)
        : [...prev.jobType, type],
    }));
  }, []);

  const toggleWorkMode = useCallback((mode: string) => {
    setFormData((prev) => ({
      ...prev,
      workMode: prev.workMode.includes(mode)
        ? prev.workMode.filter((m) => m !== mode)
        : [...prev.workMode, mode],
    }));
  }, []);

  const toggleSection = useCallback(
    (section: keyof typeof expandedSections) => {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }

      const submitData: Partial<CandidateProfile> = {
        name: formData.name.trim(),
        location: formData.location.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        headline: formData.headline.trim() || undefined,
        summary: formData.summary.trim() || undefined,
        experienceYears: formData.experienceYears
          ? parseInt(formData.experienceYears, 10)
          : undefined,
        skills: formData.skills
          ? formData.skills
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : [],
        experience: formData.experience.filter(
          (exp) => exp.company || exp.role,
        ),
        education: formData.education.filter(
          (edu) => edu.institution || edu.degree,
        ),
        links:
          Object.keys(formData.links).length > 0
            ? (formData.links as ProfileLinks)
            : undefined,
        jobType: formData.jobType.length > 0 ? formData.jobType : undefined,
        workMode: formData.workMode.length > 0 ? formData.workMode : undefined,
      };

      if (profile) {
        await updateProfile(submitData);
      } else {
        await createProfile(submitData);
      }

      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-destructive" />
          <p className="font-semibold text-destructive">Unauthorized</p>
          <p className="mt-1 text-sm text-destructive/80">
            Only candidates can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {profile ? "Edit" : "Create"} Profile
        </h1>
      </div>

      {/* Basic Info Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Basic Information
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground">
              Full Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="New York, USA"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Professional Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Professional Information
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">
              Professional Headline
            </label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleInputChange}
              placeholder="Senior Full Stack Developer"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Professional Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              placeholder="Tell us about yourself, your experience, and what you're looking for..."
              rows={4}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Years of Experience
            </label>
            <input
              type="number"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleInputChange}
              placeholder="5"
              min="0"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Skills{" "}
              <span className="text-xs text-muted-foreground">
                (comma-separated)
              </span>
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="React, TypeScript, Node.js, PostgreSQL"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <button
          type="button"
          onClick={() => toggleSection("experience")}
          className="flex w-full items-center justify-between text-lg font-semibold text-foreground hover:text-accent-foreground"
        >
          Experience
          {expandedSections.experience ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {expandedSections.experience && (
          <div className="mt-4 space-y-4">
            {formData.experience.map((exp, idx) => (
              <div
                key={idx}
                className="space-y-3 rounded-lg border border-border/50 bg-background p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Experience {idx + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="rounded-lg bg-destructive/10 p-1 text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) =>
                      handleExperienceChange(idx, "company", e.target.value)
                    }
                    placeholder="Company Name"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) =>
                      handleExperienceChange(idx, "role", e.target.value)
                    }
                    placeholder="Job Title"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="month"
                    value={exp.startDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      handleExperienceChange(idx, "startDate", e.target.value)
                    }
                    className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="month"
                    value={exp.endDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      handleExperienceChange(idx, "endDate", e.target.value)
                    }
                    className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <textarea
                    value={exp.description || ""}
                    onChange={(e) =>
                      handleExperienceChange(idx, "description", e.target.value)
                    }
                    placeholder="Description of responsibilities"
                    rows={2}
                    className="sm:col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addExperience}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Plus className="h-4 w-4" />
              Add Experience
            </button>
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <button
          type="button"
          onClick={() => toggleSection("education")}
          className="flex w-full items-center justify-between text-lg font-semibold text-foreground hover:text-accent-foreground"
        >
          Education
          {expandedSections.education ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {expandedSections.education && (
          <div className="mt-4 space-y-4">
            {formData.education.map((edu, idx) => (
              <div
                key={idx}
                className="space-y-3 rounded-lg border border-border/50 bg-background p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Education {idx + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="rounded-lg bg-destructive/10 p-1 text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) =>
                      handleEducationChange(idx, "institution", e.target.value)
                    }
                    placeholder="Institution Name"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) =>
                      handleEducationChange(idx, "degree", e.target.value)
                    }
                    placeholder="Degree (e.g., Bachelor of Science)"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="text"
                    value={edu.field || ""}
                    onChange={(e) =>
                      handleEducationChange(idx, "field", e.target.value)
                    }
                    placeholder="Field of Study"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="number"
                    value={edu.graduationYear || ""}
                    onChange={(e) =>
                      handleEducationChange(
                        idx,
                        "graduationYear",
                        e.target.value,
                      )
                    }
                    placeholder="Graduation Year"
                    min="1900"
                    max="2100"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Plus className="h-4 w-4" />
              Add Education
            </button>
          </div>
        )}
      </div>

      {/* Links Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <button
          type="button"
          onClick={() => toggleSection("links")}
          className="flex w-full items-center justify-between text-lg font-semibold text-foreground hover:text-accent-foreground"
        >
          Links
          {expandedSections.links ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {expandedSections.links && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">
                GitHub Profile
              </label>
              <input
                type="url"
                value={formData.links.github || ""}
                onChange={(e) => handleLinkChange("github", e.target.value)}
                placeholder="https://github.com/username"
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={formData.links.linkedin || ""}
                onChange={(e) => handleLinkChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Portfolio Website
              </label>
              <input
                type="url"
                value={formData.links.portfolio || ""}
                onChange={(e) => handleLinkChange("portfolio", e.target.value)}
                placeholder="https://yourportfolio.com"
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        )}
      </div>

      {/* Preferences Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <button
          type="button"
          onClick={() => toggleSection("preferences")}
          className="flex w-full items-center justify-between text-lg font-semibold text-foreground hover:text-accent-foreground"
        >
          Job Preferences
          {expandedSections.preferences ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {expandedSections.preferences && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">
                Preferred Job Types
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {JOB_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleJobType(type)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      formData.jobType.includes(type)
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background text-foreground hover:bg-accent"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Preferred Work Mode
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {WORK_MODES.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => toggleWorkMode(mode)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      formData.workMode.includes(mode)
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background text-foreground hover:bg-accent"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Saving..." : "Save Profile"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
