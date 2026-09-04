import type { BookTag } from '@/lib/models/user'
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
import React, { useEffect, useState } from 'react'

interface TagFilterProps extends React.ComponentProps<'div'> {
  tags: BookTag[]
  onSelectedTagsChange: (selectedItems: number[]) => void
}

function TagFilter({
  tags,
  onSelectedTagsChange,
  className = '',
}: TagFilterProps): React.ReactNode {
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])

  useEffect(() => {
    // notify parent when selected change
    onSelectedTagsChange(selectedTagIds)
  }, [selectedTagIds, tags])

  function handleTagToggle(tagId: number) {
    setSelectedTagIds(prev => (
      prev.includes(tagId)
        ? prev.filter(itemId => itemId !== tagId)
        : [...prev, tagId]
    ))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn('rounded-full h-10 shadow-md', className)}
        >
          <Icon path={mdiTagMultipleOutline} />
          标签
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-30vh">
        <DropdownMenuLabel>
          标签
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {
          tags.map(({ name, id }) => (
            <DropdownMenuCheckboxItem
              key={id}
              checked={selectedTagIds.includes(id)}
              onClick={(e) => {
                e.preventDefault() // prevent lose focus
                handleTagToggle(id)
              }}
            >
              {name}
            </DropdownMenuCheckboxItem>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface BookFilterProps extends React.ComponentProps<'div'> {
  filterInput: string
  onFilterInputChange: (input: string) => void
  tags: BookTag[]
  onSelectedTagsChange: (selectedItems: number[]) => void
}

export default function BookFilter({
  filterInput,
  onFilterInputChange,
  tags,
  onSelectedTagsChange,
  className,
}: BookFilterProps) {
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

  function toggleFilter() {
    // user has intended the click, do not auto
    if (!isToggleReset)
      setIsToggleReset(true)

    setIsToggled(!isToggled)
  }

  return (
    <div
      className={cn(
        `flex transition-all anframer-motion animate-duration-300
         space-between h-10 rounded-full gap-10 sticky top-4 z-50`,
        className,
      )}
    >
      {renderFilter && (
        <TagFilter
          className={
            cn(animateDurationClass, isToggled
              ? 'animate-in slide-in-l-1/2 fade-in-0'
              : 'animate-out slide-out-l-1/2 fade-out-0')
          }
          tags={tags}
          onSelectedTagsChange={onSelectedTagsChange}
        />
      )}
      {/* search bar (center) */}
      {renderFilter && (
        <Input
          type="text"
          value={filterInput}
          onChange={e => onFilterInputChange(e.target.value)}
          placeholder="Search..."
          className={cn('flex-[5] w-full shadow-md rounded-full outline-none h-10', isToggled
            ? 'animate-in slide-in-r-1/2 fade-in-0'
            : 'animate-out slide-out-r-1/2 fade-out-0', 'animate-duration-400 z-30')}
        />
      )}

      {/* trigger */}
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
        筛选器
      </Button>
    </div>
  )
}
