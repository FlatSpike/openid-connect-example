export class Session {

  private _sid: string
  private _acccountId: string
  private _idToken: string

  constructor(sid: string, accountId: string, idToken: string) {
    this._sid = sid
    this._acccountId = accountId
    this._idToken = idToken
  }

  get sid() {
    return this._sid
  }

  get accountId() {
    return this._acccountId
  }

  get idToken() {
    return this._idToken
  }
}

let sessions: Array<Session> = []

export class SessionRepository {

  async findBySid(sid: string): Promise<Session | undefined> {
    return sessions.find((item) => item.sid === sid)
  }
 
  async save(session: Session) {
    sessions = sessions.filter((item) => item.sid !== session.sid)
    sessions.push(session)
  }

  async delete(session: Session) {
    sessions = sessions.filter((item) => item.sid !== session.sid)
  }
}