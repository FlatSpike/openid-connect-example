import { v4 as uuid } from 'uuid'

// this account entity can contain whatever you want,
// there no restrictions for it
class Account {
  // https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
  // this is standart openid climes
  // only sub clime is required (its accountId in terms of openid spec)
  // all others are optional
  sub: string
  name: string = 'name'
  given_name: string = 'given_name'
  family_name: string = 'family_name'
  middle_name: string = 'middle_name'
  nickname: string = 'nickname'
  preferred_username: string = 'johnny'
  profile: string = 'profile'
  picture: string = 'picture'
  website: string = 'website'
  email: string = 'email'
  email_verified: boolean = false
  gender: string = 'gender'
  birthdate: string = 'birthdate'
  zoneinfo: string = 'zoneinfo'
  locale: string = 'locale'
  phone_number: string = 'phone_number'
  phone_number_verified: boolean = false
  address: Address = new Address()
  update_at: number = 0

  // custom properties
  // we can define any properties
  // we have only one restriction claim not  
  login: string
  private password: string

  testPassword(password: string) {
    return this.password === password
  }

  constructor(sub: string, login: string, password: string) {
    this.sub = sub
    this.login = login
    this.password = password
  }
}

// https://openid.net/specs/openid-connect-core-1_0.html#AddressClaim
class Address {
    country: string = 'country'
    formatted: string = 'formatted'
    locality: string = 'locality'
    postal_code: string = 'postal_code'
    region: string = 'region'
    street_address: string = 'street_address'
}

const accounts = [
  new Account("1", 'user_1', 'pass_1'),
  new Account("2", 'user_2', 'pass_2')
]

export default class AccoutRepository {

  static async findById(id: string) {
    return accounts.find((account) => {
       return account.sub === id 
    })
  }

  static async findByLogin(login: string) {
    return accounts.find((account) => { 
      return account.login === login 
    })
  }
}