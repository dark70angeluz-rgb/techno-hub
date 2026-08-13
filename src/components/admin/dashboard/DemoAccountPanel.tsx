import { toast } from "sonner";
import { Card, StatusChip } from "@/components/kit";
import { Button } from "@/components/kit/Button";
import Icon from "@/components/kit/Icon";
import { useAdminStore, type DemoAccount } from "@/lib/admin-store";

/** One-click demo account provisioning for showing the portal to prospects. */
export default function DemoAccountPanel() {
  const { demoAccounts, createDemoAccount, removeDemoAccount } = useAdminStore();

  const handleCreate = () => {
    const account = createDemoAccount();
    toast.success("Demo account created", {
      description: `${account.email} · ${account.password}`,
    });
  };

  const copy = (account: DemoAccount) => {
    void navigator.clipboard
      ?.writeText(`${account.email} / ${account.password}`)
      .then(() => toast.success("Credentials copied"))
      .catch(() => toast.error("Could not copy credentials"));
  };

  return (
    <Card className="col-span-12 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-tint">
            <Icon name="badge" size={20} className="text-blue" />
          </span>
          <div>
            <h3 className="text-[16px] font-bold text-navy">Demo accounts</h3>
            <p className="mt-0.5 max-w-[52ch] text-[13px] leading-[1.55] text-faint">
              Generate a temporary set of portal credentials for demos and walkthroughs. Demo
              accounts are local to this browser and can be removed at any time.
            </p>
          </div>
        </div>
        <Button iconLeading="person_add" onClick={handleCreate}>
          Create demo account
        </Button>
      </div>

      {demoAccounts.length === 0 ? (
        <p className="mt-5 rounded-[12px] border border-dashed border-line-strong px-4 py-6 text-center text-[13.5px] text-muted">
          No demo accounts yet.
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-2">
          {demoAccounts.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-line bg-dirty px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-navy">{a.email}</p>
                <p className="mt-0.5 text-[12.5px] text-muted">
                  {a.name} · password <span className="font-mono">{a.password}</span> · {a.createdAt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusChip label="Demo" tone="blue" icon="science" />
                <Button variant="secondary" size="sm" iconLeading="content_copy" onClick={() => copy(a)}>
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconLeading="delete"
                  onClick={() => removeDemoAccount(a.id)}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
