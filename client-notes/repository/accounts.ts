export class Account {

  private _id: string
  private _name: string

  constructor(id: string, name: string) {
    this._id = id
    this._name = name
  }

  get id() {
    return this._id 
  }

  get name() {
    return this._name
  }
}

const accounts: Array<Account> = [
  new Account('1', 'Account 1'),
  new Account('2', 'Account 2')
]

export class AccountRepository {

  public async findById(id: string) {
    return accounts.find((account) => {
      return account.id == id
    })
  }
}
