import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { defaultAvatarUrl } from '@/lib/utils/dummy'
import { Route as MeRootRoute } from '@/routes/me'
import { useState } from 'react'

export function ProfileInfo({
  className,
}: React.ComponentProps<'article'>) {
  const { userInfo, username } = MeRootRoute.useLoaderData()
  const {
    nickname,
    avatar,
    introduction,
  } = userInfo
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <article className={className}>
      <section className="flex justify-center mx-auto p-8">
        <div className="w-1/4 m-auto">
          <Avatar className="mx-auto w-16 h-16">
            <AvatarImage src={avatar || defaultAvatarUrl} alt="User avatar" />
            <AvatarFallback>{nickname?.substring(2) || '用户'}</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-2/4 m-auto p-4">
          <div className="text-lg font-medium">{username}</div>
          <div className="text-sm">{nickname || '未设置昵称'}</div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="m-auto w-1/4 rounded-lg"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          展开更多
        </Button>
      </section>
      {isExpanded && (
        <section className="w-full p-4">
          <h1 className="font-medium leading-8">个人简介</h1>
          <div>{introduction || '未设置简介'}</div>
        </section>
      )}
    </article>
  )
}
