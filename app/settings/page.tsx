import { Settings2, Globe2, Bell, Shield, Palette, Info } from "lucide-react";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Settings</h1>
        <p className="text-slate-400">Customize your NOOR experience and preferences.</p>
      </div>

      <div className="space-y-4">
        <SettingsSection icon={<Globe2 className="w-5 h-5 text-cyan-400" />} title="Region & Language" description="Set your default city, calculation method, and display language.">
          <div className="space-y-4">
            <SettingsRow label="Default City" value="Mecca, Saudi Arabia" />
            <SettingsRow label="Calculation Method" value="Moonsighting Committee" />
            <SettingsRow label="Language" value="English" />
            <SettingsRow label="Time Format" value="12-Hour" />
          </div>
        </SettingsSection>

        <SettingsSection icon={<Bell className="w-5 h-5 text-indigo-400" />} title="Notifications" description="Configure prayer time reminders and alerts.">
          <div className="space-y-3">
            {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((prayer) => (
              <div key={prayer} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{prayer} Reminder</span>
                <div className="w-10 h-5 rounded-full bg-white/10 relative cursor-pointer hover:bg-white/20 transition-colors">
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection icon={<Palette className="w-5 h-5 text-purple-400" />} title="Appearance" description="Customize the visual experience.">
          <div className="space-y-4">
            <SettingsRow label="Theme" value="Dark (Default)" />
            <SettingsRow label="Map Style" value="CARTO Dark" />
          </div>
        </SettingsSection>

        <SettingsSection icon={<Shield className="w-5 h-5 text-emerald-400" />} title="Privacy & Data" description="Manage your data preferences.">
          <div className="space-y-4">
            <SettingsRow label="Location Access" value="City-level only" />
            <SettingsRow label="Analytics Sharing" value="Anonymized" />
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}

function SettingsSection({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl border border-white/5 p-6">
      <div className="flex items-center space-x-3 mb-1">
        {icon}
        <h2 className="font-semibold text-white">{title}</h2>
      </div>
      <p className="text-xs text-slate-500 mb-5 ml-8">{description}</p>
      {children}
    </div>
  );
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-t border-white/5 pt-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm text-white font-medium">{value}</span>
    </div>
  );
}
