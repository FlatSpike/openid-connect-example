export class Note {

  private _accountId: string
  private _text: string = ""
  private _createdAt: Date = new Date()

  constructor(accountId: string, text: string = "") {
    this._accountId = accountId
    this._text = text
  }

  get accountId() {
    return this._accountId
  }

  get text() {
    return this._text
  }

  set text(value) {
    this._text = value
  }

  get createdAt() {
    return this._createdAt
  }
}

const notes: Array<Note> = [
  new Note("1", "Some text"),
  new Note("1", "Meaningless sentence"),
  new Note("2", "Old poun"),
  new Note("2", "Frog leaps in"),
  new Note("2", "Water`s sound"),
]

export class NoteRepository {

  async getByAccountId(accountId: string) {
    return notes.filter((note) => { 
      return note.accountId === accountId
    })
  }
}