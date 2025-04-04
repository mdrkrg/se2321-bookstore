import type { Address, Book } from '@/lib/models/user'
import booklist from './booklist.json'

export const testBookList: Book[] = booklist.items

const fakeAddressList: Address[] = [
  {
    id: 0,
    receiver: 'Brandy DuBuque',
    address: 'North Carolina Hickory 2250 N Center St',
    tel: '(828) 328-6080',
  },
  {
    id: 1,
    receiver: 'Brandy DuBuque',
    address: 'Alaska Fairbanks 3260 College Rd',
    tel: '(828) 328-6080',
  },
  {
    id: 2,
    receiver: 'Mr. Kris Beatty IV',
    address: 'Pennsylvania Mechanicsburg 5250 Simpson Ferry Rd',
    tel: '(717) 458-0430',
  },
]

export function fetchFakeAddress() {
  return fakeAddressList
}
