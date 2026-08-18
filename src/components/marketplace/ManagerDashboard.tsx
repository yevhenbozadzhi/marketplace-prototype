"use client";

import { Ban, Eye, MessageSquare, UserPlus } from "lucide-react";
import { normalize, formatMoney } from "@/lib/format";
import { translateRole, translateStatus } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { SelectInput, TextInput } from "@/components/ui/Field";
import { useMarketplace } from "./MarketplaceProvider";

export function ManagerDashboard() {
  const { state, query, filteredAssets, currentUser, locale, createParticipant, updateParticipantStatus, openChat, openAsset, t } = useMarketplace();

  return (
    <div className="space-y-5">
      <form onSubmit={createParticipant} className="rounded-md border border-[#ded6cc] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <UserPlus className="h-4 w-4 text-[#a76721]" />
          {t("addParticipant")}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <SelectInput name="role" className="mt-0" required>
            <option value="buyer">{t("buyer")}</option>
            <option value="seller">{t("seller")}</option>
          </SelectInput>
          <TextInput name="company" placeholder={t("company")} className="mt-0" required />
          <TextInput name="name" placeholder={t("contactName")} className="mt-0" required />
          <TextInput name="email" type="email" placeholder={t("email")} className="mt-0" required />
          <TextInput name="location" placeholder={t("location")} className="mt-0" required />
          <TextInput name="tags" placeholder={t("tagsComma")} className="mt-0" />
        </div>
        <Button className="mt-4" variant="primary" type="submit">
          <UserPlus className="h-4 w-4" />
          {t("createAccount")}
        </Button>
      </form>

      <div className="rounded-md border border-[#ded6cc] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#f8efe3] text-xs uppercase tracking-[0.12em] text-[#7b6b5d]">
              <tr>
                <th className="px-4 py-3">{t("participant")}</th>
                <th className="px-4 py-3">{t("role")}</th>
                <th className="px-4 py-3">{t("location")}</th>
                <th className="px-4 py-3">{t("status")}</th>
                <th className="px-4 py-3">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {state.participants
                .filter((participant) => participant.role !== "manager")
                .filter((participant) => [participant.name, participant.company, participant.location, participant.role, participant.status].join(" ").toLowerCase().includes(normalize(query)))
                .map((participant) => (
                  <tr key={participant.id} className="border-t border-[#eee5da]">
                    <td className="px-4 py-3">
                      <b>{participant.company}</b>
                      <span className="block text-xs text-[#67594d]">{participant.name} · {participant.email}</span>
                    </td>
                    <td className="px-4 py-3">{translateRole(locale, participant.role)}</td>
                    <td className="px-4 py-3">{participant.location}</td>
                    <td className="px-4 py-3">{translateStatus(locale, participant.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => updateParticipantStatus(participant.id, "active")}
                          variant={participant.status === "active" ? "active" : "secondary"}
                          type="button"
                        >
                          {t("active")}
                        </Button>
                        <Button
                          onClick={() => updateParticipantStatus(participant.id, "suspended")}
                          variant={participant.status === "suspended" ? "active" : "secondary"}
                          type="button"
                        >
                          <Ban className="h-3 w-3" />
                          {t("suspend")}
                        </Button>
                        <Button
                          onClick={() => updateParticipantStatus(participant.id, "removed")}
                          variant={participant.status === "removed" ? "active" : "danger"}
                          type="button"
                        >
                          {t("remove")}
                        </Button>
                        {currentUser && (
                          <Button onClick={() => openChat(participant)} type="button">
                            <MessageSquare className="h-3 w-3" />
                            {t("chat")}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredAssets.map((asset) => (
          <article key={asset.id} className="rounded-md border border-[#ded6cc] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9b6a2e]">{t("asset")}</p>
                <h2 className="mt-1 text-lg font-semibold">{asset.title}</h2>
              </div>
              <span className="rounded-md bg-[#f3eee7] px-3 py-1 text-sm font-semibold">{translateStatus(locale, asset.status)}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <span>{asset.region}</span>
              <span>{asset.sector}</span>
              <span>{asset.type}</span>
              <span>{formatMoney(asset.priceMin, asset.priceMax)}</span>
            </div>
            <Button onClick={() => openAsset(asset.id)} className="mt-4" type="button">
              <Eye className="h-4 w-4" />
              {t("viewAsset")}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
