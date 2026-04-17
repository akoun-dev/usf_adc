import { ForumTab } from "../components/ForumTab"
import { ForumTopicsTab } from "../components/ForumTopicsTab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "react-i18next"

export default function AdminForumPage() {
    const { t } = useTranslation()
    
    return (
        <div className="space-y-6 animate-fade-in">
            <Tabs defaultValue="topics" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="topics">{t('admin.forumTopics', 'Topics')}</TabsTrigger>
                    <TabsTrigger value="categories">{t('admin.forumCategories', 'Catégories')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="categories">
                    <ForumTab />
                </TabsContent>
                
                <TabsContent value="topics">
                    <ForumTopicsTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
