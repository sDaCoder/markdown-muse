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
            <div className='flex items-center justify-center h-[80vh]'>

                <Tabs defaultValue="markdown" className="w-[700px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="textarea">Textarea</TabsTrigger>
                        <TabsTrigger value="markdown">Markdown</TabsTrigger>
                    </TabsList>

                    <TabsContent value="textarea">
                        <Card>
                            <Textarea
                                className='w-[90%] mx-auto h-[200px] overflow-y-auto resize-none'
                                placeholder='Type your markdown here...'
                                onChange={(e) => {
                                    setMarkdownText(e.target.value)
                                }}
                                value={markdownText}
                            />
                            <CardFooter>
                                <Save className='mx-2' />
                                <p className='text-xs text-muted-foreground'>
                                    Last saved at {new Date(lastSaved).toLocaleString()}
                                </p>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="markdown">
                        <Card>
                            <div className='w-[90%] flex items-center justify-between mx-auto'>
                                <h1 className='text-2xl font-bold text-zinc-600'>Markdown Preview</h1>
                                <Button
                                    onClick={handleCopy}
                                    className='rounded-full cursor-pointer bg-zinc-500 hover:bg-zinc-600 h-10 w-10'>
                                    {!copyIcon ? <Check className='text-white' size={16} /> : <Copy className='text-white' size={16} />}
                                </Button>
                            </div>
                            <CardContent className='w-[90%] min-h-[150px] mx-auto py-6 bg-zinc-100 rounded-md shadow-lg border'>
                                {markdownText ?
                                    <>
                                        <div className='w-full h-[200px] overflow-y-auto'>
                                            <Markdown>
                                                {markdownText.trim()}
                                            </Markdown>
                                        </div>
                                    </>
                                    :
                                    <div className='w-full h-[100%] flex flex-col gap-4 items-center justify-center'>
                                        <ScrollText className='text-zinc-400' size={88} />
                                        <h2 className='text-zinc-400 font-extrabold text-lg'>No markdown found</h2>
                                    </div>
                                }
                            </CardContent>
                            <CardFooter>
                                <Save className='mx-2' />
                                <p className='text-xs text-muted-foreground'>
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
