---
name: roblox-game-development
description: >
  Create and structure Roblox games/experiences using Luau scripts, Roblox Studio project
  layout, and the Rojo file-sync workflow. Use this skill whenever the user wants to build
  a Roblox game, script gameplay mechanics, create a Roblox obby/simulator/tycoon/FPS/RPG,
  write Luau code, set up DataStores, RemoteEvents, or anything involving Roblox Studio
  projects. Trigger for requests like "build a Roblox game", "make a Roblox script that...",
  "add a leaderboard/shop/inventory to my Roblox game", "create a Roblox obby", or
  "scaffold a Rojo project". Covers project scaffolding (Rojo/default.project.json),
  server/client/shared script architecture, RemoteEvents/RemoteFunctions, DataStoreService
  persistence, and packaging the project so it can be synced into Roblox Studio.
---

# Roblox Game Developer

This skill produces **Rojo-syncable Roblox projects**: a folder of Luau scripts + a
`default.project.json` that maps to the Studio instance tree. The user pulls it into
Studio with the Rojo plugin (or `rojo build` for a `.rbxlx` place file), rather than
building it directly inside Studio's own editor.

---

## 1. Understand the Request

Before building, clarify:
- **Game genre?** Obby, simulator, tycoon, FPS, RPG, tower defense, social/hangout?
- **Core mechanic?** What does the player actually do moment to moment?
- **Multiplayer scope?** Solo, small party, or many concurrent players (affects DataStore/replication design)?
- **Monetization?** Robux products, gamepasses, none?
- **Existing project?** If the user already has a Rojo/Studio project, read it before scaffolding a new one.

---

## 2. Project Structure (Rojo layout)

```
MyGame/
├── default.project.json      ← Rojo manifest, maps folders to the DataModel tree
├── src/
│   ├── server/                ← ServerScriptService (Script instances, server-only logic)
│   │   ├── main.server.luau
│   │   └── systems/
│   ├── client/                 ← StarterPlayerScripts (LocalScript instances)
│   │   ├── main.client.luau
│   │   └── controllers/
│   ├── shared/                 ← ReplicatedStorage.Shared (ModuleScripts, both sides)
│   │   ├── Modules/
│   │   └── Config/
│   └── starter-gui/             ← StarterGui (UI ModuleScripts + Screens)
├── assets/                       ← meshes, sounds, images (referenced by asset id once uploaded)
└── default.project.json
```

Every `.luau` file becomes a Studio Script instance at the corresponding tree path.
Suffix conventions Rojo understands: `*.server.luau` → `Script`, `*.client.luau` → `LocalScript`,
plain `*.luau` → `ModuleScript`.

---

## 3. default.project.json (REQUIRED)

```json
{
  "name": "MyGame",
  "tree": {
    "$className": "DataModel",
    "ServerScriptService": {
      "$path": "src/server"
    },
    "ReplicatedStorage": {
      "Shared": { "$path": "src/shared" }
    },
    "StarterPlayer": {
      "StarterPlayerScripts": { "$path": "src/client" }
    },
    "StarterGui": {
      "$path": "src/starter-gui"
    }
  }
}
```

---

## 4. Script Architecture — Quick Reference

### Server (`src/server/`)
Owns game state, validates all client input, writes to DataStores. Never trust the client.

### Client (`src/client/`)
Input handling, camera, UI, visual/audio feedback. Fires RemoteEvents to request actions;
never mutates authoritative state directly.

### Shared (`src/shared/Modules/`)
`ModuleScript`s with constants, types, and pure functions used by both sides
(e.g. `GameConfig`, `Signal`, `Trove`, item definitions).

### Communication: RemoteEvents / RemoteFunctions
Create one `RemoteEvent`/`RemoteFunction` per action in a shared `Remotes` folder under
`ReplicatedStorage`, referenced by name from a shared module — never hardcode magic strings
in more than one place. See `references/remotes.md`.

### Persistence: DataStoreService
Use `pcall`-wrapped reads/writes, `UpdateAsync` (not `SetAsync`) for player data to avoid
race conditions, and `BindToClose` to flush pending saves. See `references/datastores.md`.

---

## 5. Common Game Systems — Quick Reference

| System | Where it lives | Notes |
|---|---|---|
| Leaderboard / stats | `server/systems/Leaderstats.luau` | Populate `leaderstats` Folder under `Player` for the built-in Roblox leaderboard UI |
| Shop / inventory | `server/systems/Shop.luau` + `shared/Modules/Items.luau` | Server validates purchases; client only requests |
| Tool / weapon | `src/server` Tool instance + `Handle` part | See `references/tools.md` |
| Zones / regions | `shared/Modules/Zones.luau` using `Region3` or `WorldModel:GetPartsInPart` | |
| Tycoon plots | `server/systems/Tycoon.luau` | Assign plot on `PlayerAdded`, clean up on `PlayerRemoving` |
| Obby checkpoints | `server/systems/Checkpoints.luau` + `SpawnLocation` instances | Save last checkpoint per player |
| NPCs | `server/systems/NPC.luau` using `PathfindingService` | |

See `references/systems.md` for full code patterns of each.

---

## 6. Build Workflow

### Step 1 — Scaffold the directory
```bash
mkdir -p MyGame/src/{server/systems,client/controllers,shared/{Modules,Config},starter-gui}
```

### Step 2 — Write `default.project.json` and all `.luau` files

### Step 3 — Validate Luau syntax
Use `selene` if available, otherwise a lightweight balance/syntax sanity check:
```bash
pip install --break-system-packages --quiet luaparser 2>/dev/null || true
# Or, if selene is installed:
selene src/ 2>/dev/null || echo "selene not available, skipping lint"
```

### Step 4 — Package for delivery
Zip the project folder (Rojo projects are plain text, no binary packaging step needed):
```bash
cd MyGame && zip -r ../MyGame.zip . -x '*.DS_Store'
```

### Step 5 — Output the file
Copy the `.zip` (or the raw folder, if the user is working in an agentic coding surface
rather than Claude.ai) to `/mnt/user-data/outputs/` and present it.

---

## 7. Telling the User How to Use It

1. Install **Rojo** (`https://rojo.space`) — either the Roblox Studio plugin, or the CLI via `aftman`/`foreman`.
2. Unzip the project, open Roblox Studio, connect the Rojo plugin, click **Connect** to live-sync `src/` into the DataModel.
3. Alternatively, `rojo build -o Game.rbxlx` produces a place file to open directly in Studio.
4. Playtest with **F5** (Play) / **F7** (Play here) in Studio.

---

## 8. Quality Checklist

Before delivering:
- [ ] No client script trusts unvalidated data from a RemoteEvent — server re-checks everything
- [ ] All DataStore writes are wrapped in `pcall` with retry/backoff on failure
- [ ] `default.project.json` paths match the actual folder structure exactly
- [ ] Script suffixes (`.server.luau` / `.client.luau` / `.luau`) match intended instance type
- [ ] Shared constants (item ids, remote names) live in one shared module, not duplicated
- [ ] `PlayerAdded`/`PlayerRemoving` cleanup is handled for any per-player state

---

## 9. RemoteEvents & RemoteFunctions — Detail

### Setup (shared/Config/Remotes.luau)
```lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local remotesFolder = ReplicatedStorage:FindFirstChild("Remotes")
    or Instance.new("Folder")
remotesFolder.Name = "Remotes"
remotesFolder.Parent = ReplicatedStorage

local function getOrCreate(className, name)
    local existing = remotesFolder:FindFirstChild(name)
    if existing then return existing end
    local inst = Instance.new(className)
    inst.Name = name
    inst.Parent = remotesFolder
    return inst
end

return {
    PurchaseItem = getOrCreate("RemoteEvent", "PurchaseItem"),
    RequestInventory = getOrCreate("RemoteFunction", "RequestInventory"),
}
```

### Server: listening + validating
```lua
local Remotes = require(ReplicatedStorage.Shared.Config.Remotes)

Remotes.PurchaseItem.OnServerEvent:Connect(function(player, itemId)
    if typeof(itemId) ~= "string" then return end
    local item = Items[itemId]
    if not item then return end

    local stats = player:FindFirstChild("leaderstats")
    if not stats or stats.Coins.Value < item.price then return end

    stats.Coins.Value -= item.price
    -- grant item...
end)
```

### Client: firing
```lua
Remotes.PurchaseItem:FireServer(itemId)
```

### Rules
- Server never trusts arguments — re-validate type, ownership, affordability every time.
- RemoteFunctions block the caller; prefer RemoteEvent + a follow-up event for anything
  that might be slow (DataStore calls), to avoid stalling the client.
- Rate-limit remotes that can be spammed (debounce per player, or a token bucket) to
  prevent exploited scripts from flooding the server.

---

## 10. DataStoreService — Safe Player Data (Detail)

### Basic pattern
```lua
local DataStoreService = game:GetService("DataStoreService")
local playerData = DataStoreService:GetDataStore("PlayerData_v1")

local sessionCache = {}

local function loadData(player)
    local key = "player_" .. player.UserId
    local success, result = pcall(function()
        return playerData:GetAsync(key)
    end)
    sessionCache[player.UserId] = (success and result) or {
        coins = 0,
        inventory = {},
    }
end

local function saveData(player)
    local key = "player_" .. player.UserId
    local data = sessionCache[player.UserId]
    if not data then return end

    local success, err = pcall(function()
        playerData:UpdateAsync(key, function(old)
            return data -- last-write-wins per server; fine for single-server saves
        end)
    end)
    if not success then
        warn("Failed to save data for", player.Name, err)
    end
end

game.Players.PlayerAdded:Connect(loadData)
game.Players.PlayerRemoving:Connect(saveData)

game:BindToClose(function()
    for _, player in game.Players:GetPlayers() do
        saveData(player)
    end
    task.wait(1) -- give async calls a moment to flush
end)
```

### Rules
- Always wrap `GetAsync`/`SetAsync`/`UpdateAsync` in `pcall` — DataStore calls can throttle/error.
- Prefer `UpdateAsync` over `SetAsync` when a player might have data touched from more than
  one server (trading, cross-server events) — it lets you merge instead of blindly overwrite.
- Add retry-with-backoff for production games (3 attempts, exponential delay) rather than a bare pcall.
- Never call DataStore methods from LocalScripts — DataStoreService is server-only.
- Version your store name (`PlayerData_v1`) so schema migrations don't corrupt old saves.
- For anything transactional (currency), consider `DataStoreService:GetOrderedDataStore`
  or a dedicated MessagingService pattern if you need cross-server consistency.

---

## 11. Common Gameplay Systems (Detail)

### Leaderstats (built-in leaderboard UI)
```lua
game.Players.PlayerAdded:Connect(function(player)
    local stats = Instance.new("Folder")
    stats.Name = "leaderstats"
    stats.Parent = player

    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 0
    coins.Parent = stats
end)
```

### Tycoon plot assignment
```lua
local plots = workspace.Plots:GetChildren()
local assigned = {}

game.Players.PlayerAdded:Connect(function(player)
    for _, plot in plots do
        if not assigned[plot] then
            assigned[plot] = player
            plot:SetAttribute("Owner", player.UserId)
            break
        end
    end
end)

game.Players.PlayerRemoving:Connect(function(player)
    for plot, owner in assigned do
        if owner == player then
            assigned[plot] = nil
            plot:SetAttribute("Owner", nil)
        end
    end
end)
```

### Obby checkpoints
```lua
local function onCheckpointTouched(checkpoint, hit)
    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if not player then return end
    player:SetAttribute("LastCheckpoint", checkpoint.Name)
end

for _, cp in workspace.Checkpoints:GetChildren() do
    cp.Touched:Connect(function(hit) onCheckpointTouched(cp, hit) end)
end
```

### NPC pathfinding
```lua
local PathfindingService = game:GetService("PathfindingService")

local function moveTo(npc, targetPosition)
    local path = PathfindingService:CreatePath()
    path:ComputeAsync(npc.PrimaryPart.Position, targetPosition)
    for _, waypoint in path:GetWaypoints() do
        npc.Humanoid:MoveTo(waypoint.Position)
        npc.Humanoid.MoveToFinished:Wait()
    end
end
```

### Shop purchase (server-authoritative)
The pattern is: client requests via RemoteEvent, server validates funds/ownership, server
mutates state, server informs client of the result. See section 9 for the full remote handler.

---

## 12. Tools & Weapons (Detail)

Roblox `Tool` instances are created and configured in Studio (they need a `Handle` Part
with actual geometry/mesh), but their behavior scripts follow this pattern:

```lua
-- Script inside the Tool instance
local tool = script.Parent

local function onActivated()
    local character = tool.Parent
    local humanoid = character and character:FindFirstChild("Humanoid")
    if not humanoid then return end

    -- swing animation, damage raycast, etc.
end

tool.Activated:Connect(onActivated)
```

### Damage validation (server-side)
Never let the client report "I hit player X for Y damage" — the server should own the hit
detection (raycast/region check) or, at minimum, sanity-check client-reported hits against
server-known positions and cooldowns before applying damage.

### Rules
- `Tool.Activated` fires on the server automatically when the local player clicks/taps while
  holding the tool — no RemoteEvent needed for the basic activation signal.
- Put cosmetic feedback (swing animation, sound) on the client via a LocalScript inside
  StarterPlayerScripts listening to `Humanoid.AnimationPlayed`, or replicate via a lightweight
  RemoteEvent if it needs to be seen by other players.
- Debounce `Activated` server-side to prevent script-exploited rapid-fire activation.

---

## Common Mistakes to Avoid

- **Never** trust client-sent values (currency amounts, damage numbers) without server-side validation
- **Never** use `SetAsync` for incremental player data — use `UpdateAsync` to avoid overwrites from concurrent sessions/servers
- **Never** put gameplay logic in `StarterGui`/LocalScripts that should be server-authoritative
- Don't forget `BindToClose` to save data before the server shuts down
- Keep one `RemoteEvent` per distinct action — don't multiplex unrelated actions through a single remote with a string "type" argument unless there's a good reason
- Roblox asset ids (meshes, sounds, decals) can't be generated locally — the user uploads assets in Studio/Creator Dashboard and gives you the id, or you leave a placeholder id and note it
