interface Url {
  id: string,
  name?: string,
  originalUrl: string,
  shortId: string
}

interface CreateUrl {
  execute(): Promise<Url>
}

// todo: use case implementation