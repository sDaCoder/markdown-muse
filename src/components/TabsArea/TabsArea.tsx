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
