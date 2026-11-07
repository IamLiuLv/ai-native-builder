// The book is not an agent product, so there is no conversation beside the stage.
import type { SceneChat } from "../engine/AgentPanel.tsx";

export const STORY_CHATS: readonly SceneChat[] = Array.from({ length: 6 }, () => ({ label: "", open: null, rows: [] }));
