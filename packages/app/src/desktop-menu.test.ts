import { describe, expect, test } from "bun:test"
import { DESKTOP_MENU } from "./desktop-menu"

describe("desktop menu", () => {
  test("navigates between tabs", () => {
    const items = DESKTOP_MENU.flatMap((menu) => menu.items ?? []).filter((item) => {
      if (item.type !== "item") return false
      return item.command === "tab.prev" || item.command === "tab.next"
    })

    expect(items).toEqual([
      { type: "item", labelKey: "desktop.menu.back", command: "tab.prev", accelerator: { macos: "Alt+Cmd+Left" } },
      {
        type: "item",
        labelKey: "desktop.menu.forward",
        command: "tab.next",
        accelerator: { macos: "Alt+Cmd+Right" },
      },
    ])
  })

  test("exports logs through the desktop command registry", () => {
    const items = DESKTOP_MENU.flatMap((menu) => menu.items ?? []).filter(
      (item) => item.type === "item" && item.labelKey === "desktop.menu.exportLogs",
    )

    expect(items).toHaveLength(2)
    expect(items.every((item) => item.type === "item" && item.command === "logs.export" && !item.action)).toBe(true)
  })

  test("provides translated labels for role-backed entries", () => {
    const windowMenu = DESKTOP_MENU.find((menu) => menu.role === "windowMenu")
    const roleItems = DESKTOP_MENU.flatMap((menu) => menu.items ?? []).filter(
      (item) => item.type === "item" && item.role && item.labelKey,
    )

    expect(windowMenu?.labelKey).toBe("desktop.menu.window")
    expect(roleItems.length).toBeGreaterThan(0)
  })
})
