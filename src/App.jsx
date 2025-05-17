import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Save, ScrollText, Copy, Check } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar/Navbar'
import Markdown from 'react-markdown'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'
import axios from 'axios'

function App() {
  // const storedText = localStorage.getItem('markdownText')
  // const [markdownText, setMarkdownText] = useState(storedText)
  const [markdownText, setMarkdownText] = useState('')
  const [copyText, setCopyText] = useState('')
  const [copyIcon, setCopyIcon] = useState(true)
  const [textId, setTextId] = useState(null)
  const [lastSaved, setLastSaved] = useState(null)
  const timerRef = useRef(null)

  // useEffect(() => {
  //   localStorage.setItem('markdownText', markdownText)
  //   setCopyIcon(true)
  // }, [markdownText])

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

  // fetching the markdown text from the server on initial render
  useEffect(() => {
    (
      async () => {
        try {
          const res = await axios.get('http://localhost:3000/api')
          if (res.data.texts && res.data.texts.length > 0) {
            setMarkdownText(res.data.texts[0].text)
            setTextId(res.data.texts[0]._id)
          }
        } catch (error) {
          toast.error('Error fetching markdown from the server')
        }
      }
    )()
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (markdownText === '') return

    timerRef.current = setTimeout(async () => {
      const toastId = toast.loading('Saving...')
      try {
        if (textId) {
          // Update existing text
          await axios.patch(`http://localhost:3000/api/${textId}`, { 
            text: markdownText
          })
        } else {
          // Create new text
          const res = await axios.post('http://localhost:3000/api', { 
            text: markdownText 
          })
          // Save the new textId
          const getRes = await axios.get('http://localhost:3000/api')
          if (getRes.data.texts && getRes.data.texts.length > 0) {
            setTextId(getRes.data.texts[0]._id)
          }
        }
        setCopyIcon(true)
        const now = new Date()
        setLastSaved(now)
        toast.success(`Saved to database at ${now.toLocaleTimeString()}`, { id: toastId })
      } catch (err) {
        toast.error('Failed to save markdown', { id: toastId })
      }
    }, 3000)

    return () => clearTimeout(timerRef.current)
  }, [markdownText])

  return (
    <>
      <Navbar />

      <div className='flex items-center justify-center h-[80vh]'>

        <Tabs defaultValue="textarea" className="w-[700px]">
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
                <Save className='mx-2'/>
                <p className='text-xs text-muted-foreground'>
                  Last saved at {new Date().toLocaleString()}
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
                <Save className='mx-2'/>
                <p className='text-xs text-muted-foreground'>
                  Last saved at {new Date(lastSaved).toLocaleString()}
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default App