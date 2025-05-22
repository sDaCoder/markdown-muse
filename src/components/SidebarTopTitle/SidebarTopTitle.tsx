import { ScrollText } from 'lucide-react'
import { SidebarGroupLabel } from '../ui/sidebar'

const SidebarTopTitle: React.FC = () => {
    return (
        <>
            <div className="flex items-center justify-start">
                <div>
                    <ScrollText size={28} />
                </div>
                <SidebarGroupLabel>
                    <div className="ml-2 text-sm font-medium overflow-auto">Markdown Muse</div>
                </SidebarGroupLabel>
            </div>
        </>
    )
}

export default SidebarTopTitle
