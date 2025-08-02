import { useState } from 'react'
import { Post } from '@/types'
import { PostCard } from '@/components/PostCard'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Plus } from '@phosphor-icons/react'

interface CalendarViewProps {
  posts: Post[]
  onEditPost: (post: Post) => void
  onCreatePost: (date?: Date) => void
  onApprovePost: (post: Post) => void
  onRejectPost: (post: Post) => void
}

export function CalendarView({ 
  posts, 
  onEditPost, 
  onCreatePost,
  onApprovePost,
  onRejectPost 
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => 
      isSameDay(new Date(post.scheduledDate), date)
    )
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={previousMonth}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextMonth}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
        <Button onClick={() => onCreatePost()}>
          <Plus size={16} className="mr-2" />
          New Post
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map(day => {
          const dayPosts = getPostsForDate(day)
          const isCurrentDay = isToday(day)

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] p-2 border rounded-lg ${
                isCurrentDay ? 'border-primary bg-primary/5' : 'border-border'
              } hover:bg-muted/30 transition-colors cursor-pointer`}
              onClick={() => onCreatePost(day)}
            >
              {/* Date Number */}
              <div className={`text-right mb-2 ${
                isCurrentDay ? 'font-semibold text-primary' : 'text-muted-foreground'
              }`}>
                {format(day, 'd')}
              </div>

              {/* Posts for this day */}
              <div className="space-y-1">
                {dayPosts.slice(0, 2).map(post => (
                  <div
                    key={post.id}
                    className="text-xs p-1 rounded bg-white border border-border shadow-sm hover:shadow cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditPost(post)
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs h-4 px-1 ${
                          post.status === 'approved' ? 'bg-green-100 text-green-700' :
                          post.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          post.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {post.platform}
                      </Badge>
                    </div>
                    <div className="line-clamp-2 text-foreground">
                      {post.content}
                    </div>
                  </div>
                ))}
                
                {dayPosts.length > 2 && (
                  <div className="text-xs text-muted-foreground text-center py-1">
                    +{dayPosts.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">Quick Stats</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{posts.filter(p => p.status === 'draft').length} Drafts</span>
              <span>{posts.filter(p => p.status === 'pending').length} Pending Review</span>
              <span>{posts.filter(p => p.status === 'approved').length} Approved</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Export Calendar
            </Button>
            <Button variant="outline" size="sm">
              Team View
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}