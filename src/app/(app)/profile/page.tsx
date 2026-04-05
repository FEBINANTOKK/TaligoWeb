"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  Edit2,
  ExternalLink,
  Globe,
  FileText,
  MapPin,
  Phone,
  Briefcase,
  BookOpen,
  Award,
  Plus,
  Code2,
  User,
} from "lucide-react";
import { getProfile, type CandidateProfile } from "@/lib/profile";
import { getUserRole } from "@/lib/user-role";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);

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

        // Fetch profile
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading your profile...</span>
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

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error loading profile</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
        <Award className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">
          No profile yet
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your profile to get started with job applications
        </p>
        <Link
          href="/profile/edit"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
          {profile.headline && (
            <p className="mt-1 text-base text-muted-foreground">
              {profile.headline}
            </p>
          )}
        </div>
        <Link
          href="/profile/edit"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
        >
          <Edit2 className="h-4 w-4" />
          Edit Profile
        </Link>
      </div>

      {/* Basic Info */}
      <div className="grid gap-4 sm:grid-cols-3">
        {profile.location && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Location
            </div>
            <p className="mt-2 font-medium text-foreground">
              {profile.location}
            </p>
          </div>
        )}

        {profile.phone && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              Phone
            </div>
            <a
              href={`tel:${profile.phone}`}
              className="mt-2 font-medium text-primary hover:underline"
            >
              {profile.phone}
            </a>
          </div>
        )}

        {profile.experienceYears !== undefined && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              Experience
            </div>
            <p className="mt-2 font-medium text-foreground">
              {profile.experienceYears} years
            </p>
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {profile.summary && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">About</h2>
          <p className="mt-3 text-muted-foreground">{profile.summary}</p>
        </div>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Experience</h2>
          <div className="mt-4 space-y-4">
            {profile.experience.map((exp, idx) => (
              <div
                key={exp._id || idx}
                className="border-l-2 border-border pl-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{exp.role}</p>
                    <p className="text-sm text-accent-foreground">
                      {exp.company}
                    </p>
                  </div>
                  {exp.startDate && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(exp.startDate).getFullYear()}
                      {exp.endDate
                        ? ` - ${new Date(exp.endDate).getFullYear()}`
                        : " - Present"}
                    </p>
                  )}
                </div>
                {exp.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <BookOpen className="h-5 w-5" />
            Education
          </h2>
          <div className="mt-4 space-y-4">
            {profile.education.map((edu, idx) => (
              <div
                key={edu._id || idx}
                className="border-l-2 border-border pl-4"
              >
                <p className="font-semibold text-foreground">
                  {edu.degree}
                  {edu.field && ` in ${edu.field}`}
                </p>
                <p className="text-sm text-accent-foreground">
                  {edu.institution}
                </p>
                {edu.graduationYear && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Graduated {edu.graduationYear}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {profile.links &&
        (profile.links.github ||
          profile.links.linkedin ||
          profile.links.portfolio) && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Links</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {profile.links.github && (
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <Code2 className="h-4 w-4" />
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {profile.links.linkedin && (
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <User className="h-4 w-4" />
                  LinkedIn
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {profile.links.portfolio && (
                <a
                  href={profile.links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <Globe className="h-4 w-4" />
                  Portfolio
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        )}

      {/* Resume */}
      {profile.resume && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <FileText className="h-5 w-5" />
            Resume
          </h2>
          <a
            href={profile.resume.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <FileText className="h-4 w-4" />
            View Resume
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Job Preferences */}
      {profile.jobType?.length || profile.workMode?.length ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Job Preferences
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {profile.jobType && profile.jobType.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Job Types
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.jobType.map((type) => (
                    <span
                      key={type}
                      className="inline-flex rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {profile.workMode && profile.workMode.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Work Mode
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.workMode.map((mode) => (
                    <span
                      key={mode}
                      className="inline-flex rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {mode}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
