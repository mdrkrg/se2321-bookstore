import type { Book } from '@/lib/models/user'
import type { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

import { mdiMenu, mdiTagMultipleOutline } from '@mdi/js'

import Icon from '@mdi/react'

import { Link } from '@tanstack/react-router'
import * as React from 'react'
import { useEffect, useState } from 'react'
import GoodCard from './good-card'

type Checked = DropdownMenuCheckboxItemProps['checked']
function TagFilter(
  { className = '' }: { className?: string },
): React.ReactNode {
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
  ]
  const tagRefDict: Map<
    string,
    ReturnType<typeof useState<Checked>>
  > = new Map()
  dummyTags.forEach(item => tagRefDict.set(item, useState<Checked>(false)))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn('rounded-full h-10 shadow-md', className)}
        >
          <Icon path={mdiTagMultipleOutline} />
          Tags
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-30vh">
        <DropdownMenuLabel>
          Appearance
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {
          Array.from(tagRefDict).map(([tag, state]) => {
            const [checked, setChecked] = state
            return (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={checked}
                onClick={(e) => {
                  e.preventDefault() // prevent lose focus
                  setChecked(!checked)
                }}
              >
                {tag}
              </DropdownMenuCheckboxItem>
            )
          })
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// const fetchingBook = <div className="aspect-video rounded-xl bg-muted" />

function FilterTrigger() {
  const [isToggled, setIsToggled] = useState(true)
  const [isToggleReset, setIsToggleReset] = useState(false)
  const [renderFilter, setRenderFilter] = useState(false)
  const animateDuration = 300
  const animateDurationClass = `animate-duration-${animateDuration}`

  // prevent animation from jiggling
  useEffect(() => {
    setTimeout(() => {
      if (isToggled) {
        setRenderFilter(true)
      }
      else {
        setRenderFilter(false)
      }
    }, animateDuration * 0.8)
  }, [isToggled])

  /*
   * Perform auto untoggle when scroll down,
   * and toggle when scroll back
   * unless the user has intended to (un)toggle it
   */
  useEffect(() => {
    const handleScroll = () => {
      if (!isToggleReset) {
        if (window.scrollY > 1) {
          setIsToggled(false) // Untoggle when scrolled over
        }
        else {
          setIsToggled(true)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isToggleReset])

  const toggleFilter = () => {
    // user has intended the click, do not auto
    if (!isToggleReset)
      setIsToggleReset(true)

    setIsToggled(!isToggled)
  }

  return (
    <div
      className={
        `flex transition-all anframer-motion animate-duration-300
         space-between h-10 rounded-full gap-10 sticky top-4 z-50`
      }
    >
      {renderFilter && (
        <TagFilter className={
          cn(animateDurationClass, isToggled
            ? 'animate-in slide-in-l-1/2 fade-in-0'
            : 'animate-out slide-out-l-1/2 fade-out-0')
        }
        />
      )}
      {/* Search Bar (Center) */}
      {renderFilter && (
        <Input
          type="text"
          placeholder="Search..."
          className={cn('flex-[5] w-full shadow-md rounded-full outline-none h-10', isToggled
            ? 'animate-in slide-in-r-1/2 fade-in-0'
            : 'animate-out slide-out-r-1/2 fade-out-0', 'animate-duration-400 z-30')}
        />
      )}

      <Button
        className={cn(
          `flex-1 p-4 h-10 bg-white font-bold rounded-full text-black
          hover:bg-gray-200 transition-colors
          animate-duration-200
          z-40
          max-w-100px
          shadow-md`,
          renderFilter ? 'ml-0' : 'mr-0 ml-auto',
        )}
        onClick={toggleFilter}
        aria-label="Toggle Filter"
      >
        <Icon path={mdiMenu} />
        Filter
      </Button>
    </div>
  )
}

export default function CardsWaterfall({ bookList }: { bookList: Array<Book> }) {
  return (
    <div className="w-full rounded bg-white">
      <FilterTrigger />
      {
        bookList.length
          ? (
              <div className="flex flex-1 flex-col gap-4 p-4 w-full">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4 w-80vw">
                  {
                    bookList.map((book, index) => {
                      return (
                        <Link to={`/book/${book.id}`} key={index}>
                          <GoodCard book={book} />
                        </Link>
                      )
                    })
                  }
                  {/* TODO:
                    * Add lazy loading and dummy data here, refer to
                    * https://tanstack.com/query/latest/docs/framework/react/examples/load-more-infinite-scroll
                    * for more details.
                    */}
                </div>
              </div>
            )
          : <h2 className="text-center font-bold text-2xl">当前书籍已售空</h2>
      }
    </div>
  )
}
