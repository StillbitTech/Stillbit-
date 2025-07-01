import { ActionCore } from "./actionCore"
import { AlertService } from "./alertService"

interface AgentContext {
  vaultId: string
  timestamp: number
}

export class CoreAgent {
  constructor(
    private actions: ActionCore,
    private alerts: AlertService
  ) {}

  async run(id: string, input: any, ctx: AgentContext) {
    const result = await this.actions.execute(id, input)
    if (result && result.alert) {
      this.alerts.emit({
        id,
        vaultId: ctx.vaultId,
        type: "anomaly",
        message: result.alert,
        level: result.level || "warn",
        timestamp: ctx.timestamp
      })
    }
    return result
  }
}
