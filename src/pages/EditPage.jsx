import StreamdownEditorSurface from '../components/TabsArea/TabsArea'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { addNewUserText, getAllUserTexts, getUserText, updateUserText } from '../userTextAPI'

const EditPage = () => {
    const { textId: urlTextId } = useParams()
    const [initialText, setInitialText] = useState('')
    const [markdownText, setMarkdownText] = useState('')
    const [textId, setTextId] = useState(null)
    const [lastSaved, setLastSaved] = useState(null)
    const [hasLoaded, setHasLoaded] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const { user } = useUser()

    useEffect(() => {
        ;(async () => {
            try {
                if (urlTextId) {
                    const res = await getUserText(user?.id, urlTextId)
                    if (res.data.textObj) {
                        setMarkdownText(res.data.textObj.text ?? '')
                        setInitialText(res.data.textObj.text ?? '')
                        setTextId(res.data.textObj._id)
                        setLastSaved(res.data.textObj.lastSaved)
                    }
                } else {
                    const res = await getAllUserTexts(user?.id)
                    if (res.data.texts && res.data.texts.length > 0) {
                        setMarkdownText(res.data.texts[0].text ?? '')
                        setInitialText(res.data.texts[0].text ?? '')
                        setTextId(res.data.texts[0]._id)
                        setLastSaved(res.data.texts[0].lastSaved)
                    }
                }
                setHasLoaded(true)
            } catch (error) {
                toast.error('Error fetching markdown from the server')
                setHasLoaded(true)
            }
        })()
    }, [urlTextId, user?.id])

    const hasUnsavedChanges = hasLoaded && markdownText !== initialText

    const handleSave = useCallback(async () => {
        if (isSaving) return
        if (!hasUnsavedChanges) {
            toast('No changes to save')
            return
        }

        setIsSaving(true)
        const toastId = toast.loading('Saving markdown to the server...')

        try {
            let res

            if (textId) {
                res = await updateUserText(user?.id, textId, undefined, markdownText)
            } else {
                res = await addNewUserText(user?.id, 'Untitled Text', markdownText)
                setTextId(res.data._id)
            }

            const savedAt = res.data.lastSaved ?? new Date().toISOString()
            setInitialText(markdownText)
            setLastSaved(savedAt)
            toast.success(`Saved to server at ${new Date(savedAt).toLocaleTimeString()}`, { id: toastId })
        } catch (error) {
            toast.error('Failed to save markdown', { id: toastId })
        } finally {
            setIsSaving(false)
        }
    }, [hasUnsavedChanges, isSaving, markdownText, textId, user?.id])

    useEffect(() => {
        const handleKeyDown = (event) => {
            const isSaveShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's'
            if (!isSaveShortcut) return

            event.preventDefault()
            void handleSave()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleSave])

    return (
        <>
            {/*
            <TabsArea
                markdownText={markdownText}
                setMarkdownText={setMarkdownText}
                copyIcon={copyIcon}
                setCopyIcon={setCopyIcon}
                lastSaved={lastSaved}
            />
            */}
            <StreamdownEditorSurface
                markdownText={markdownText}
                setMarkdownText={setMarkdownText}
                lastSaved={lastSaved}
                isSaving={isSaving}
                hasUnsavedChanges={hasUnsavedChanges}
                onSave={handleSave}
            />
        </>
    )
}

export default EditPage
