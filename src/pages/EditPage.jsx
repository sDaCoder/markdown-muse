import TabsArea from '../components/TabsArea/TabsArea'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const EditPage = () => {
    // const storedText = localStorage.getItem('markdownText')
    // const [markdownText, setMarkdownText] = useState(storedText)
    const { textId: urlTextId } = useParams()
    const [initialText, setInitialText] = useState('')
    const [markdownText, setMarkdownText] = useState('')
    const [copyIcon, setCopyIcon] = useState(true)
    const [textId, setTextId] = useState(null)
    const [lastSaved, setLastSaved] = useState(null)
    const [hasLoaded, setHasLoaded] = useState(false)
    const timerRef = useRef(null)
    const { user } = useUser()

    // useEffect(() => {
    //   localStorage.setItem('markdownText', markdownText)
    //   setCopyIcon(true)
    // }, [markdownText])
    // console.log(user.id);


    // fetching the markdown text from the server on initial render
    useEffect(() => {
        (async () => {
            try {
                if (urlTextId) {
                    const res = await axios.get(`http://localhost:3000/api/${user.id}/${urlTextId}`)
                    if (res.data.textObj) {
                        setMarkdownText(res.data.textObj.text)
                        setInitialText(res.data.textObj.text)
                        setTextId(res.data.textObj._id)
                        setLastSaved(res.data.textObj.lastSaved)
                    }
                } else {
                    const res = await axios.get(`http://localhost:3000/api/${user.id}`)
                    if (res.data.texts && res.data.texts.length > 0) {
                        setMarkdownText(res.data.texts[0].text)
                        setInitialText(res.data.texts[0].text)
                        setTextId(res.data.texts[0]._id)
                        setLastSaved(res.data.texts[0].lastSaved)
                    }
                }
                setHasLoaded(true)
            } catch (error) {
                toast.error('Error fetching markdown from the server')
            }
        }
        )()
    }, [urlTextId])

    useEffect(() => {
        if (!hasLoaded) return
        if (timerRef.current) clearTimeout(timerRef.current)
        if (markdownText === '' || markdownText === initialText) return

        timerRef.current = setTimeout(async () => {
            const toastId = toast.loading('Saving...')
            try {
                if (textId) {
                    // Update existing text
                    const res = await axios.patch(`http://localhost:3000/api/${user.id}/${textId}`, {
                        text: markdownText
                    })
                    setLastSaved(res.data.lastSaved)
                }
                else {
                    // Create new text
                    const res = await axios.post(`http://localhost:3000/api/${user.id}`, {
                        text: markdownText
                    })
                    setTextId(res.data._id)
                    setLastSaved(res.data.lastSaved)
                    // Save the new textId
                    // const getRes = await axios.get('http://localhost:3000/api')
                    // if (getRes.data.texts && getRes.data.texts.length > 0) {
                    //   setLastSaved(getRes.data.texts[0].lastSaved)
                    //   setTextId(getRes.data.texts[0]._id)
                    // }
                }
                setCopyIcon(true)
                setInitialText(markdownText)
                const now = new Date(lastSaved || Date.now())
                setLastSaved(now)
                toast.success(`Saved to database at ${now.toLocaleTimeString()}`, { id: toastId })
            } catch (err) {
                toast.error('Failed to save markdown', { id: toastId })
            }
        }, 3000)

        return () => clearTimeout(timerRef.current)
    }, [markdownText, hasLoaded, textId])

    return (
        <>
            <TabsArea
                markdownText={markdownText}
                setMarkdownText={setMarkdownText}
                copyIcon={copyIcon}
                setCopyIcon={setCopyIcon}
                lastSaved={lastSaved}
            />
        </>
    )
}

export default EditPage
