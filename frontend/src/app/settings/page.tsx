"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { api } from "@/lib/api";
import type { Settings } from "@/types/api";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await api.getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function toggleSetting(
    key: keyof Settings,
    value: boolean
  ) {
    if (!settings) return;

    setSettings({
      ...settings,
      [key]: value,
    });

    setSaving(true);

    try {
      const updated = await api.updateSettings({
        [key]: value,
      });

      setSettings(updated);
    } catch (error) {
      console.error("Failed to update settings:", error);

      setSettings(settings);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="ml-[300px] min-h-screen">
        <div className="mx-auto max-w-[800px] px-8 py-10">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-[#444]">
              Settings
            </h1>

            <p className="mt-2 font-semibold text-[#999]">
              Customize your learning experience
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="text-5xl">⚙️</div>

              <p className="mt-4 font-extrabold text-[#777]">
                Loading settings...
              </p>
            </div>
          ) : !settings ? (
            <div className="rounded-2xl border border-[#dedede] p-8 text-center">
              <p className="font-extrabold text-[#777]">
                Unable to load settings.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#dedede] bg-white">
              <SettingRow
                title="Sound Effects"
                description="Play sounds for correct and incorrect answers."
                enabled={settings.sound_enabled}
                onChange={(value) =>
                  toggleSetting("sound_enabled", value)
                }
              />

              <SettingRow
                title="Music"
                description="Play background music while learning."
                enabled={settings.music_enabled}
                onChange={(value) =>
                  toggleSetting("music_enabled", value)
                }
              />

              <SettingRow
                title="Notifications"
                description="Receive reminders and learning updates."
                enabled={settings.notifications_enabled}
                onChange={(value) =>
                  toggleSetting("notifications_enabled", value)
                }
              />

              <div className="border-t border-[#eee] px-6 py-5">
                <p className="text-xs font-bold text-[#999]">
                  {saving ? "Saving..." : "Changes are saved automatically."}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

interface SettingRowProps {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}

function SettingRow({
  title,
  description,
  enabled,
  onChange,
}: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-[#eee] px-6 py-6 last:border-b-0">
      <div>
        <h2 className="font-extrabold text-[#444]">
          {title}
        </h2>

        <p className="mt-1 text-sm font-semibold text-[#999]">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        aria-label={`Toggle ${title}`}
        className={`relative h-8 w-14 shrink-0 rounded-full transition ${
          enabled ? "bg-[#58cc02]" : "bg-[#bdbdbd]"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
            enabled ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}