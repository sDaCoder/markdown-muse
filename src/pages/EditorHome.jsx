import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { Clock3, FileText, PencilLine, Plus, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { addNewUserText, getAllUserTexts } from '../userTextAPI'
import { Button } from '../components/ui/button'

const formatUpdatedAt = (value) => {
  if (!value) return 'No activity yet'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'No activity yet'

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const buildPreview = (text) => {
  if (!text) return 'Empty note. Open it to start writing.'

  return text
    .replace(/\s+/g, ' ')
    .replace(/[#>*`~-]/g, '')
    .trim()
    .slice(0, 140) || 'Empty note. Open it to start writing.'
}

const sortByLastSaved = (notes) =>
  [...notes].sort((a, b) => {
    const aTime = a?.lastSaved ? new Date(a.lastSaved).getTime() : 0
    const bTime = b?.lastSaved ? new Date(b.lastSaved).getTime() : 0
    return bTime - aTime
  })

const EditorHome = () => {
  const navigate = useNavigate()
  const { user, isLoaded, isSignedIn } = useUser()
  const [notes, setNotes] = useState([])
  const [isFetching, setIsFetching] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn || !user?.id) {
      setIsFetching(false)
      return
    }

    const loadNotes = async () => {
      setIsFetching(true)
      try {
        const res = await getAllUserTexts(user.id)
        setNotes(sortByLastSaved(res.data.texts || []))
      } catch (error) {
        setNotes([])
        toast.error('Failed to load your recent notes')
      } finally {
        setIsFetching(false)
      }
    }

    loadNotes()
  }, [isLoaded, isSignedIn, user?.id])

  const featuredNote = notes[0]

  const metrics = useMemo(() => {
    const recentCount = notes.length
    const activeCount = notes.filter((note) => (note?.text || '').trim().length > 0).length

    return {
      recentCount,
      activeCount,
      lastActivity: featuredNote?.lastSaved ? formatUpdatedAt(featuredNote.lastSaved) : 'No saved sessions yet',
    }
  }, [featuredNote, notes])

  const handleCreateNote = async () => {
    if (!user?.id) return

    setIsCreating(true)
    try {
      const res = await addNewUserText(user.id, 'Untitled Text', '')
      toast.success('New note created')
      navigate(`/editor/${res.data._id}`)
    } catch (error) {
      toast.error('Failed to create a new note')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] overflow-hidden px-6 py-8 md:px-8 lg:px-12">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),transparent_60%)] blur-3xl" />

        <header className="glass-elevated relative overflow-hidden rounded-[28px] px-6 py-8 transition-opacity duration-300 md:px-8">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(135deg,rgba(125,211,252,0.12),transparent_60%)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium tracking-[0.24em] text-primary uppercase">
                <Sparkles className="size-3.5" />
                Editor Home
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-glow md:text-5xl">
                  Recent notes, ready to reopen.
                </h1>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                  Jump back into your latest drafts, scan recent activity, and open the note that still has momentum.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="transition-transform duration-200 hover:-translate-y-0.5"
                onClick={handleCreateNote}
                disabled={isCreating}
              >
                <Plus className="size-4" />
                {isCreating ? 'Creating...' : 'New note'}
              </Button>
              {featuredNote && (
                <Button
                  variant="outline"
                  size="lg"
                  className="transition-transform duration-200 hover:-translate-y-0.5"
                  onClick={() => navigate(`/editor/${featuredNote._id}`)}
                >
                  <PencilLine className="size-4" />
                  Continue latest
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_1.7fr]">
          <section className="glass rounded-[24px] p-6">
            <div className="mb-6 flex items-center gap-2 text-sm font-medium text-primary">
              <Clock3 className="size-4" />
              Workspace status
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/6 bg-white/3 p-4">
                <p className="text-sm text-muted-foreground">Recent notes</p>
                <p className="mt-3 text-3xl font-semibold">{metrics.recentCount}</p>
              </div>
              <div className="rounded-2xl border border-white/6 bg-white/3 p-4">
                <p className="text-sm text-muted-foreground">Notes with content</p>
                <p className="mt-3 text-3xl font-semibold">{metrics.activeCount}</p>
              </div>
              <div className="rounded-2xl border border-white/6 bg-white/3 p-4 sm:col-span-2 lg:col-span-1">
                <p className="text-sm text-muted-foreground">Last activity</p>
                <p className="mt-3 text-base font-medium leading-6">{metrics.lastActivity}</p>
              </div>
            </div>
          </section>

          <section className="glass rounded-[24px] p-4 md:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Recent notes</h2>
                <p className="text-sm text-muted-foreground">
                  Your latest drafts, ordered by most recent save.
                </p>
              </div>
            </div>

            {isFetching ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 animate-pulse rounded-2xl border border-primary/10 bg-primary/5"
                  />
                ))}
              </div>
            ) : notes.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-[24px] border border-dashed border-primary/20 bg-[linear-gradient(180deg,rgba(125,211,252,0.06),rgba(125,211,252,0.01))] px-6 text-center">
                <div className="mb-4 rounded-full border border-primary/20 bg-primary/10 p-4 text-primary">
                  <FileText className="size-6" />
                </div>
                <h3 className="text-xl font-semibold">No recent notes yet</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  Start a fresh markdown note and it will appear here with its title, preview, and last saved time.
                </p>
                <Button className="mt-6" onClick={handleCreateNote} disabled={isCreating}>
                  <Plus className="size-4" />
                  Create your first note
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note, index) => (
                  <button
                    key={note._id}
                    type="button"
                    onClick={() => navigate(`/editor/${note._id}`)}
                    className="group w-full rounded-[22px] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.07]"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-semibold text-primary">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                              {note.textTitle || 'Untitled Text'}
                            </h3>
                            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                              Markdown draft
                            </p>
                          </div>
                        </div>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                          {buildPreview(note.text)}
                        </p>
                      </div>

                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <div className="text-sm text-muted-foreground">
                          {formatUpdatedAt(note.lastSaved)}
                        </div>
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                          Open note
                          <PencilLine className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  )
}

export default EditorHome
