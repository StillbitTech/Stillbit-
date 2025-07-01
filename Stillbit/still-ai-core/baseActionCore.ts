interface ActionDefinition<Input, Output> {
  id: string
  description: string
  handler: (input: Input) => Promise<Output>
}

export class ActionCore {
  private registry = new Map<string, ActionDefinition<any, any>>()

  register<Input, Output>(action: ActionDefinition<Input, Output>) {
    this.registry.set(action.id, action)
  }

  async execute<Input, Output>(id: string, input: Input): Promise<Output | null> {
    const action = this.registry.get(id)
    if (!action) return null
    return action.handler(input)
  }

  list(): string[] {
    return Array.from(this.registry.keys())
  }
}
