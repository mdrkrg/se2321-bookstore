import type { Address, Book, BookTag, Order, UserDTO } from '@/lib/models/user'
import dayjs from 'dayjs'
import _, { random, range, sample, sampleSize } from 'lodash'
import booklist from './booklist.json'

export const testBookList: Book[] = booklist.items.map(
  i => ({ ...i, available: true, stock: random(50) }),
)

const fakeAddressList: Address[] = [
  {
    id: 1000000001,
    address: '北京市朝阳区建国路88号SOHO现代城D座1002室',
    tel: '13988881234',
    receiver: '王强',
  },
  {
    id: 1000000002,
    address: '上海市浦东新区世纪大道2000号金茂大厦30层',
    tel: '13899992345',
    receiver: '李娜',
  },
  {
    id: 1000000003,
    address: '广东省广州市天河区体育东路123号中信广场8楼',
    tel: '13777773456',
    receiver: '陈伟',
  },
  {
    id: 1000000004,
    address: '四川省成都市武侯区人民南路四段56号华西大厦2单元301',
    tel: '13666664567',
    receiver: '赵静',
  },
  {
    id: 1000000005,
    address: '浙江省杭州市西湖区文三路500号银泰中心A座1508',
    tel: '13555555678',
    receiver: '周杰',
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

export const defaultAvatarUrl = 'https://ui.shadcn.com/avatars/01.png'

export function fetchFakeUser(): UserDTO {
  return {
    id: 1,
    username: 'Lorem Ipsum',
    email: 'test@example.com',
    role: 'USER',
    balance: 1000,
    userInfo: {
      nickname: 'lorem',
      avatar: defaultAvatarUrl,
      introduction: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pulvinar libero sagittis, suscipit leo quis, venenatis ante. Etiam nulla mauris, sodales vitae ultricies eu, fringilla in libero. Mauris volutpat molestie rhoncus. Donec sit amet ante in nulla vehicula imperdiet et eget mi. Proin finibus tortor ut placerat luctus. Nullam condimentum leo eu nunc sagittis consequat. Praesent mi dolor, accumsan quis tortor eu, varius vulputate lectus. Quisque quis vulputate urna. Curabitur venenatis vestibulum quam, ut sodales eros posuere eget.',
    },
  }
}

const dummyTags = [
  'romance',
  'philosophy',
  'Lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'dolore',
  'magnam',
  'aliquam',
  'quaerat',
  'voluptatem',
  'enim',
  'aeque',
  'doleamus',
  'animo',
  'cum',
  'corpore',
  'dolemus',
  'fieri',
  'tamen',
  'permagna',
  'accessio',
  'potest',
  'aliquod',
  'aeternum',
  'et',
  'infinitum',
  'impendere',
  'malum',
  'nobis',
  'opinemur',
  'Quod',
  'idem',
  'licet',
  'transferre',
  'voluptatem',
  'ut',
  'postea',
  'variari',
  'voluptas',
  'distinguique',
  'possit',
  'augeri',
  'amplificarique',
  'non',
  'possit',
  'etiam',
  'Athenis',
  'patre',
  'audiebam',
  'facete',
  'et',
  'urbane',
  'Stoicos',
  'irridente',
  'statua',
  'est',
  'quo',
  'nobis',
  'philosophia',
  'defensa',
].map((value, index) => ({ id: index, name: value }))

export function fetchFakeTags(): BookTag[] {
  return dummyTags
}
