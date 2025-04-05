import type { Address, Book, Order } from '@/lib/models/user'
import dayjs from 'dayjs'
import _, { random, range, sample, sampleSize } from 'lodash'
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

export function getRandomTimestamp() {
  return random(_.now())
}

export function fetchFakeOrderList(): Order[] {
  return range(random(testBookList.length)).map((i) => {
    const address = sample(fakeAddressList) as Address
    return {
      id: i,
      receiver: address.receiver,
      address: address.address,
      tel: address.tel,
      createdAt: dayjs(getRandomTimestamp()).format(),
      items: sampleSize(testBookList, random(1, 5)).map((book) => {
        return {
          id: book.id,
          book,
          number: random(1, 5),
        }
      }),
    }
  })
}
