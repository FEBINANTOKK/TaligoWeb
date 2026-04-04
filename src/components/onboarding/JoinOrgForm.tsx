import { useState, type FormEvent } from "react";

interface JoinOrgFormProps {
  onSubmit: (joinCode: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export default function JoinOrgForm({
  onSubmit,
  onBack,
  isLoading,
}: JoinOrgFormProps) {
  const [joinCode, setJoinCode] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(joinCode.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold text-card-foreground text-center">
        Join Organization
      </h1>
      <p className="text-sm text-muted-foreground text-center">
        Enter your invitation code to join your team.
      </p>

      <div className="space-y-2">
        <label htmlFor="joinCode" className="text-sm font-medium">
          Join code
        </label>
        <input
          id="joinCode"
          type="text"
          value={joinCode}
          onChange={(event) => setJoinCode(event.target.value)}
          placeholder="TEAM-ABCD"
          required
          minLength={4}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Joining..." : "Join and Continue"}
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
