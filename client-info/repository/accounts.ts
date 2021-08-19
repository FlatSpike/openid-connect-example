export class Account {

  private _id: string
  private _name: string
  private _description: string

  constructor(id: string, name: string, description: string) {
    this._id = id
    this._name = name
    this._description = description
  }

  get id() {
    return this._id 
  }

  get name() {
    return this._name
  }

  get description() {
    return this._description
  }
}

const accounts: Array<Account> = [
  new Account('1', 'Random man', 'there is nothing to say'),
  new Account('2', 'Another one', '^_^')
]

export class AccountRepository {

  public async findById(id: string) {
    return accounts.find((account) => {
      return account.id == id
    })
  }
}
