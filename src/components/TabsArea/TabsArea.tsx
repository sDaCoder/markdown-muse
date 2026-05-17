import { useMemo } from 'react'
import { differenceInYears, formatDistanceToNowStrict } from 'date-fns'
import { BookOpenText, PencilLine, Save } from 'lucide-react'
import { Streamdown } from 'streamdown'
import { cjk } from '@streamdown/cjk'
import { code } from '@streamdown/code'
import { math } from '@streamdown/math'
import { mermaid } from '@streamdown/mermaid'
import 'streamdown/styles.css'

import { Button } from './../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './../ui/tabs'
import { Textarea } from './../ui/textarea'
import { Clock3 } from 'lucide-react'

interface StreamdownEditorSurfaceProps {
    markdownText: string
    setMarkdownText: (markdownText: string) => void
    lastSaved: Date | string | null
    isSaving: boolean
    hasUnsavedChanges: boolean
    onSave: () => void
}

const streamdownPlugins = { cjk, code, math, mermaid }

const formatLastSaved = (lastSaved: Date | string | null) => {
    if (!lastSaved) return 'Last saved long ago'

    const date = new Date(lastSaved)
    if (Number.isNaN(date.getTime())) return 'Last saved long ago'

    const diffMs = Date.now() - date.getTime()
    if (diffMs < 45 * 1000) return 'Last saved now'
    if (differenceInYears(new Date(), date) >= 10) return 'Last saved long ago'

    return `Last saved ${formatDistanceToNowStrict(date, { addSuffix: true })}`
}

const StreamdownEditorSurface: React.FC<StreamdownEditorSurfaceProps> = ({
    markdownText,
    setMarkdownText,
    lastSaved,
    isSaving,
    hasUnsavedChanges,
    onSave,
}) => {
    const metrics = useMemo(() => {
        const trimmed = markdownText.trim()
        const words = trimmed ? trimmed.split(/\s+/).length : 0

        return {
            words,
            characters: markdownText.length,
            lines: markdownText ? markdownText.split('\n').length : 0,
        }
    }, [markdownText])

    return (
        <section className="relative min-h-[calc(100vh-88px)] overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_28%),linear-gradient(180deg,rgba(7,12,24,0.86),rgba(7,12,24,0.98))]" />
            <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-5">
                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 shadow-[0_30px_120px_rgba(2,6,23,0.55)] backdrop-blur-xl">
                    <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(14,116,144,0.18),rgba(15,23,42,0.08)_45%,rgba(217,119,6,0.12))] px-5 py-5 sm:px-7">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/75">muse response</p>
                                <h1 className="font-semibold mt-2 text-3xl text-white sm:text-4xl">Write in plain markdown, inspect the final document in context.</h1>
                                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                                    Switch between raw source and formatted output without leaving the editing surface.
                                </p>
                                <p className="text-sm text-slate-300">{formatLastSaved(lastSaved)}</p>
                            </div>

                            <div className="flex flex-col items-start gap-2 sm:items-end">
                                {/* <p className="text-sm text-slate-300">{formatLastSaved(lastSaved)}</p> */}
                                <Button
                                    onClick={onSave}
                                    disabled={isSaving || !hasUnsavedChanges}
                                    className="h-12 rounded-2xl bg-cyan-300 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
                                >
                                    <Save className="size-4" />
                                    {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save markdown' : 'Saved'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 border-b border-white/10 bg-slate-950/65 px-5 py-4 text-sm text-slate-200 sm:grid-cols-3 sm:px-7">
                        <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                            <div className="flex items-center gap-2 text-slate-400">
                                <PencilLine className="size-4 text-cyan-300" />
                                Words
                            </div>
                            <p className="mt-2 text-2xl font-semibold text-white">{metrics.words}</p>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                            <div className="flex items-center gap-2 text-slate-400">
                                <BookOpenText className="size-4 text-amber-300" />
                                Characters
                            </div>
                            <p className="mt-2 text-2xl font-semibold text-white">{metrics.characters}</p>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Clock3 className="size-4 text-emerald-300" />
                                Lines
                            </div>
                            <p className="mt-2 text-2xl font-semibold text-white">{metrics.lines}</p>
                        </div>
                    </div>

                    <Tabs defaultValue="editor" className="gap-0">
                        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7">
                            <TabsList className="grid h-auto w-full max-w-md grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
                                <TabsTrigger
                                    value="editor"
                                    className="rounded-xl py-2.5 text-sm data-[state=active]:border-white/10 data-[state=active]:bg-cyan-300 data-[state=active]:text-slate-950"
                                >
                                    Editor
                                </TabsTrigger>
                                <TabsTrigger
                                    value="formatted"
                                    className="rounded-xl py-2.5 text-sm data-[state=active]:border-white/10 data-[state=active]:bg-amber-300 data-[state=active]:text-slate-950"
                                >
                                    Formatted text
                                </TabsTrigger>
                            </TabsList>
                            <div className="hidden text-xs font-medium uppercase tracking-[0.22em] text-slate-500 lg:block">
                                {hasUnsavedChanges ? 'Unsaved changes' : 'Server in sync'}
                            </div>
                        </div>

                        <TabsContent value="editor" className="m-0">
                            <div className="grid min-h-[620px] lg:grid-cols-[minmax(0,1fr)_260px]">
                                <div className="border-b border-white/10 lg:border-r lg:border-b-0">
                                    <Textarea
                                        className="min-h-[620px] resize-none border-0 bg-transparent px-5 py-5 font-mono text-[15px] leading-7 text-slate-100 shadow-none focus-visible:ring-0 sm:px-7"
                                        placeholder={'# Start writing\n\nUse markdown here, then open the formatted tab to inspect the final render.'}
                                        value={markdownText}
                                        onChange={(event) => setMarkdownText(event.target.value)}
                                    />
                                </div>
                                <aside className="flex flex-col justify-between bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(9,14,28,0.98))] px-5 py-5 sm:px-7 lg:px-5">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Editing notes</p>
                                        <div className="mt-4 space-y-4 text-sm leading-6 text-slate-300">
                                            <p>Use the editor tab for raw markdown structure, headings, code blocks, lists, tables, and links.</p>
                                            <p>The formatted tab renders the same content through <span className="font-semibold text-white">streamdown</span>, matching the package you installed.</p>
                                            <p>Use <span className="font-semibold text-white">Cmd/Ctrl + S</span> or the save button to persist the current note to the running server.</p>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/8 p-4 text-sm text-cyan-50">
                                        <p className="font-semibold text-cyan-200">Current state</p>
                                        <p className="mt-2 text-cyan-50/85">
                                            {hasUnsavedChanges ? 'Local edits are ahead of the saved server version.' : 'Rendered markdown matches the saved server version.'}
                                        </p>
                                    </div>
                                </aside>
                            </div>
                        </TabsContent>

                        <TabsContent value="formatted" className="m-0">
                            <div className="min-h-[620px] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-5 py-6 sm:px-7">
                                {markdownText.trim() ? (
                                    <div className="streamdown prose prose-invert max-w-none rounded-[24px] border border-white/10 bg-slate-950/70 px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:px-8">
                                        <Streamdown
                                            className="size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                                            plugins={streamdownPlugins}
                                        >
                                            {markdownText}
                                        </Streamdown>
                                    </div>
                                ) : (
                                    <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/12 bg-slate-950/45 px-6 text-center">
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Formatted preview</p>
                                        <h2 className="mt-4 font-serif text-3xl text-white">Nothing to render yet.</h2>
                                        <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                                            Add markdown in the editor tab and streamdown will render the formatted document here.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </section>
    )
}

export default StreamdownEditorSurface

/*
Legacy component kept commented out per request.

import { Tabs, TabsList, TabsTrigger, TabsContent } from './../ui/tabs'
import { Card, CardContent, CardFooter } from './../ui/card'
import { Save, ScrollText, Copy, Check } from 'lucide-react'
import { Textarea } from './../ui/textarea'
import { Button } from './../ui/button'
import Markdown from 'react-markdown'
import { useState } from 'react'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'

interface TabsAreaProps {
    markdownText: string
    setMarkdownText: (markdownText: string) => void
    copyIcon: boolean
    setCopyIcon: (copyIcon: boolean) => void
    lastSaved: Date
}

const TabsArea: React.FC<TabsAreaProps> = ({
    markdownText,
    setMarkdownText,
    copyIcon,
    setCopyIcon,
    lastSaved
}) => {
    const [copyText, setCopyText] = useState<string>('')
    const handleCopy = () => {
        if (markdownText) {
            setCopyText(markdownText)
            copy(copyText)
            setCopyIcon(false)
            toast.success('Markdown copied to clipboard!')
        } else {
            toast.error('No markdown text to copy')
        }
    }
    return (
        <>
            <div className='flex items-center justify-center min-h-[calc(100vh-80px)] py-12'>
                <Tabs defaultValue="markdown" className="w-[800px]">
                    <TabsList className="grid w-full grid-cols-2 glass p-1 mb-4 rounded-xl">
                        <TabsTrigger 
                            value="textarea" 
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all rounded-lg"
                        >
                            Editor
                        </TabsTrigger>
                        <TabsTrigger 
                            value="markdown"
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all rounded-lg"
                        >
                            Preview
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="textarea" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="glass overflow-hidden border-0">
                            <div className="p-6">
                                <Textarea
                                    className='w-full h-[400px] overflow-y-auto resize-none bg-background/30 border-primary/20 focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 rounded-xl p-4'
                                    placeholder='Type your markdown here...'
                                    onChange={(e) => {
                                        setMarkdownText(e.target.value)
                                    }}
                                    value={markdownText}
                                />
                            </div>
                            <CardFooter className="border-t border-primary/10 bg-primary/5 py-4">
                                <Save className='mx-2 text-primary' size={18} />
                                <p className='text-xs text-muted-foreground font-medium'>
                                    Last saved at {lastSaved ? new Date(lastSaved).toLocaleString() : 'Not saved yet'}
                                </p>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="markdown" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="glass overflow-hidden border-0">
                            <div className='flex items-center justify-between p-6 pb-2'>
                                <h1 className='text-xl font-bold text-primary tracking-tight'>Glacier Preview</h1>
                                <Button
                                    onClick={handleCopy}
                                    variant="ghost"
                                    className='rounded-full hover:bg-primary/20 hover:border hover:border-primary/30 text-primary h-10 w-10 p-0 transition-all'
                                >
                                    {!copyIcon ? <Check className='text-primary' size={20} /> : <Copy className='text-primary' size={20} />}
                                </Button>
                            </div>
                            <CardContent className='px-6 pb-6'>
                                <div className='w-full min-h-[350px] max-h-[450px] overflow-y-auto py-6 px-8 bg-background/40 rounded-xl border border-primary/10 backdrop-blur-sm prose prose-invert max-w-none'>
                                    {markdownText ?
                                        <Markdown className="markdown-content">
                                            {markdownText.trim()}
                                        </Markdown>
                                        :
                                        <div className='w-full h-[300px] flex flex-col gap-4 items-center justify-center'>
                                            <ScrollText className='text-primary/20 animate-pulse' size={88} />
                                            <h2 className='text-primary/40 font-bold text-lg'>Ethereal silence...</h2>
                                            <p className='text-muted-foreground/40 text-sm'>Start typing to see the light.</p>
                                        </div>
                                    }
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-primary/10 bg-primary/5 py-4">
                                <Save className='mx-2 text-primary' size={18} />
                                <p className='text-xs text-muted-foreground font-medium'>
                                    Last saved at {lastSaved ? new Date(lastSaved).toLocaleString() : 'N/A'}
                                </p>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}

export default TabsArea
*/
