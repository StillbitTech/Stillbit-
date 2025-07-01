interface ContractMeta {
  programId: string
  authority: string
  creationSlot: number
}

export function verifyContract(meta: ContractMeta): boolean {
  return meta.programId.length === 44 && meta.authority.length === 44
}
