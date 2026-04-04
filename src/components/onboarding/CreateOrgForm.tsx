import { useState, type FormEvent } from "react";

interface CreateOrgFormProps {
  onSubmit: (organizationName: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export default function CreateOrgForm({
  onSubmit,
  onBack,
  isLoading,
}: CreateOrgFormProps) {
  const [organizationName, setOrganizationName] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(organizationName.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold text-card-foreground text-center">
        Create Organization
      </h1>
      <p className="text-sm text-muted-foreground text-center">
        Set up your company workspace in a few seconds.
      </p>

      <div className="space-y-2">
        <label htmlFor="organizationName" className="text-sm font-medium">
          Organization name
        </label>
        <input
          id="organizationName"
          type="text"
          value={organizationName}
          onChange={(event) => setOrganizationName(event.target.value)}
          placeholder="Acme Inc"
          required
          minLength={2}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating..." : "Create and Continue"}
      </button>

      <button
        type="button"
        onClick={onBack}
        disabled={isLoading}
        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Back
      </button>
    </form>
  );
}
